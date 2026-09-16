#!/usr/bin/env python3
"""Refresh public data. Python 3.10+, standard library only. Secrets never enter dist/."""
import concurrent.futures, datetime as dt, email.utils, hashlib, html, json, os, re, sys
import urllib.parse as up, urllib.request as ur, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'config.json').read_text())
FILE=ROOT/'dist/data/research.json'
NOW=dt.datetime.now(dt.timezone.utc).isoformat()
AGENT='NomanRazaSialResearchPortfolio/1.0 (+https://orcid.org/0000-0002-8384-2646)'
def get(url,headers=None):
    request=ur.Request(url,headers={'User-Agent':AGENT,'Accept':'application/json',**(headers or {})})
    with ur.urlopen(request,timeout=18) as r:
        body=r.read(5_000_001)
        if len(body)>5_000_000: raise ValueError('Response exceeds size limit')
        return body,r.url

def js(url,headers=None):return json.loads(get(url,headers)[0])
def allowed(url):
    u=up.urlparse(url);h=(u.hostname or '').lower()
    return u.scheme=='https' and any(h==d or h.endswith('.'+d) for d in CONFIG['allowedDomains'])
def canonical(url):
    u=up.urlsplit(url);q=up.parse_qsl(u.query)
    return up.urlunsplit((u.scheme,u.netloc,u.path.rstrip('/'),up.urlencode([(k,v) for k,v in q if not k.startswith('utm_')]),''))
def key(p):return (p.get('doi') or re.sub(r'\W','',p['title']).lower()).lower()
def merge_publications(*groups):
    result={}
    for group in groups:
        for p in group:
            k=key(p)
            existing=result.get(k)
            if not existing:
                # Match normalized titles when a provider does not supply a DOI.
                title=re.sub(r'\W','',p['title']).lower()
                existing=next((v for v in result.values() if re.sub(r'\W','',v['title']).lower()==title),None)
            if existing:
                if p['source'] not in existing['source']:existing['source']+=' + '+p['source']
                for field in ('year','journal','doi','authors'):
                    if not existing.get(field) and p.get(field):existing[field]=p[field]
                if p.get('citations') is not None:
                    existing['citations']=p['citations'];existing['citationSource']=p.get('citationSource')
            else:result[k]=dict(p)
    return sorted(result.values(),key=lambda p:(-int(p.get('year') or 0),p['title']))

def orcid():
    d=js('https://pub.orcid.org/v3.0/'+CONFIG['orcid']+'/works');out=[]
    if 'group' not in d:raise ValueError('Invalid ORCID response')
    for group in d['group']:
        w=group['work-summary'][0]
        doi=next((i['external-id-value'].lower() for i in w.get('external-ids',{}).get('external-id',[]) if i['external-id-type']=='doi'),'')
        out.append({'title':w['title']['title']['value'],'year':((w.get('publication-date') or {}).get('year') or {}).get('value',''),'journal':(w.get('journal-title') or {}).get('value',''),'doi':doi,'url':'https://doi.org/'+doi if doi else 'https://orcid.org/'+CONFIG['orcid'],'source':'ORCID'})
    return {'orcidPublications':out,'orcidUpdatedAt':NOW}

def openalex():
    suffix='?'+up.urlencode({'api_key':os.environ['OPENALEX_API_KEY']}) if os.getenv('OPENALEX_API_KEY') else ''
    d=js('https://api.openalex.org/authors/https://orcid.org/'+CONFIG['orcid']+suffix)
    if d.get('orcid','').rstrip('/').split('/')[-1]!=CONFIG['orcid']:raise ValueError('ORCID mismatch')
    stats=d.get('summary_stats',{});out=[];cursor='*'
    while cursor:
        params={'filter':'author.id:'+d['id'].split('/')[-1],'per-page':200,'cursor':cursor}
        if os.getenv('OPENALEX_API_KEY'):params['api_key']=os.environ['OPENALEX_API_KEY']
        works=js('https://api.openalex.org/works?'+up.urlencode(params))
        for w in works['results']:
            doi=(w.get('doi') or '').removeprefix('https://doi.org/').lower()
            authors=' and '.join(a['author']['display_name'] for a in w.get('authorships',[]))
            out.append({'title':w['display_name'],'year':str(w.get('publication_year') or ''),'journal':((w.get('primary_location') or {}).get('source') or {}).get('display_name',''),'doi':doi,'url':w.get('doi') or w['id'],'source':'OpenAlex','authors':authors,'citations':w.get('cited_by_count'),'citationSource':'OpenAlex'})
        cursor=works.get('meta',{}).get('next_cursor')
        if not works['results']:break
    return {'openalexPublications':out,'metrics':{'provider':'OpenAlex','url':d['id'],'citations':d.get('cited_by_count'),'hIndex':stats.get('h_index'),'i10Index':stats.get('i10_index'),'worksCount':d.get('works_count'),'countsByYear':d.get('counts_by_year',[]),'updatedAt':NOW}}

def scholar():
    if not os.getenv('SERPAPI_KEY'):return None
    out=[];start=0;first=None
    while True:
        params={'engine':'google_scholar_author','author_id':CONFIG['scholarId'],'hl':'en','num':100,'start':start,'api_key':os.environ['SERPAPI_KEY']}
        d=js('https://serpapi.com/search.json?'+up.urlencode(params))
        if d.get('error'):raise ValueError('Scholar provider error')
        if first is None:first=d
        for a in d.get('articles',[]):out.append({'title':a['title'],'year':a.get('year',''),'journal':a.get('publication',''),'authors':a.get('authors','').replace(', ',' and '),'url':a['link'],'source':'Google Scholar','citations':a.get('cited_by',{}).get('value'),'citationSource':'Google Scholar'})
        if not d.get('serpapi_pagination',{}).get('next'):break
        start+=100
        if start>=5000:raise ValueError('Scholar pagination exceeds expected profile size')
    table=first.get('cited_by',{}).get('table',[])
    if not table:raise ValueError('Missing Scholar metrics')
    metrics={'provider':'Google Scholar','url':'https://scholar.google.com/citations?user='+CONFIG['scholarId'],'updatedAt':NOW}
    recent={}
    for row in table:
        for name,vals in row.items():
            field={'citations':'citations','h_index':'hIndex','i10_index':'i10Index'}.get(name)
            if not field:continue
            metrics[field]=vals.get('all')
            for label,value in vals.items():
                if label!='all':recent['label']=label.replace('_',' ');recent[field]=value
    return {'scholarPublications':out,'scholar':{'metrics':metrics,'recent':recent,'status':'ok'}}

def linkedin():
    token=os.getenv('LINKEDIN_ACCESS_TOKEN');author=os.getenv('LINKEDIN_AUTHOR_URN')
    if not token or not author:return None
    if not author.startswith('urn:li:person:'):raise ValueError('Personal author URN required')
    version=os.getenv('LINKEDIN_VERSION','202604')
    params={'author':author,'q':'author','count':20,'sortBy':'CREATED'}
    d=js('https://api.linkedin.com/rest/posts?'+up.urlencode(params),{'Authorization':'Bearer '+token,'Linkedin-Version':version,'X-Restli-Protocol-Version':'2.0.0','X-RestLi-Method':'FINDER'})
    out=[]
    for p in d.get('elements',[]):
        if p.get('author')!=author or p.get('visibility')!='PUBLIC' or p.get('lifecycleState')!='PUBLISHED':continue
        out.append({'text':p.get('commentary',''),'url':'https://www.linkedin.com/feed/update/'+p['id']+'/','date':dt.datetime.fromtimestamp(p.get('publishedAt',p.get('createdAt'))/1000,dt.timezone.utc).isoformat()})
    return {'linkedin':{'posts':out[:6],'status':'ok','updatedAt':NOW}}

class Page(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.text=[];self.href=None;self.words=[];self.skip=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','style','nav','footer','header'):self.skip+=1
        if not self.skip and tag=='a':self.href=a.get('href');self.words=[]
    def handle_endtag(self,tag):
        if tag in ('script','style','nav','footer','header'):self.skip=max(0,self.skip-1)
        if tag=='a' and self.href:
            self.links.append((self.href,' '.join(self.words)));self.href=None
    def handle_data(self,text):
        if not self.skip:
            clean=' '.join(text.split())
            if clean:self.text.append(clean)
            if self.href:self.words.append(clean)

def parsed_date(s):
    if not s:return None
    try:return email.utils.parsedate_to_datetime(s).isoformat()
    except Exception:
        try:return dt.datetime.fromisoformat(s.replace('Z','+00:00')).isoformat()
        except Exception:return None

def collect_source(source,previous):
    state={**source,'lastAttempt':NOW};old=previous or {}
    try:
        body,final=get(source['url'],{'Accept':'application/rss+xml,application/xml,text/html'})
        if not allowed(final):raise ValueError('Redirect to non-approved publisher')
        text=body.decode('utf-8',errors='replace');rows=[]
        if source['kind']=='rss':
            root=ET.fromstring(body)
            for node in root.findall('.//item')+root.findall('.//{http://www.w3.org/2005/Atom}entry'):
                def value(name):
                    el=node.find(name)
                    return ''.join(el.itertext()).strip() if el is not None else ''
                title=value('title') or value('{http://www.w3.org/2005/Atom}title')
                link=value('link');atom=node.find('{http://www.w3.org/2005/Atom}link')
                if not link and atom is not None:link=atom.get('href','')
                description=value('description')
                if not any(k in (title+' '+description).lower() for k in CONFIG['keywords']):continue
                link=up.urljoin(final,link)
                if not allowed(link):continue
                rows.append({'title':html.unescape(title),'url':canonical(link),'date':parsed_date(value('pubDate') or value('{http://www.w3.org/2005/Atom}published')),'source':source['name'],'category':source['category'],'discoveredAt':NOW,'kind':'News'})
        else:
            page=Page();page.feed(text)
            digest=hashlib.sha256(' '.join(page.text).encode()).hexdigest()
            if source['kind']=='monitor' and old.get('hash') and old['hash']!=digest:
                rows.append({'title':source['name']+' — source page updated','url':source['url'],'source':source['name'],'category':source['category'],'discoveredAt':NOW,'kind':'Page change','summary':'A content change was detected on this official page. Review the source for its scope and effective dates; this is not a confirmed legal amendment.'})
            state['hash']=digest
            for href,title in page.links:
                link=canonical(up.urljoin(final,href))
                if len(title)<35 or len(title)>260 or link==canonical(final) or not allowed(link):continue
                if not any(k in title.lower() for k in CONFIG['keywords']):continue
                rows.append({'title':title,'url':link,'source':source['name'],'category':source['category'],'discoveredAt':NOW,'kind':'Source discovery'})
        state.update(status='Checked',lastSuccess=NOW)
        return state,rows
    except Exception:
        # Do not expose exception URLs: query strings could contain credentials.
        state.update(status='Update unavailable — retained saved items',lastSuccess=old.get('lastSuccess'),hash=old.get('hash'))
        return state,[]

def save(data):
    data['publications']=merge_publications(data.get('orcidPublications',[]),data.get('openalexPublications',[]),data.get('scholarPublications',[]))
    # Atomic replacement keeps readers from observing half-written JSON.
    tmp=FILE.with_suffix('.tmp');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2));tmp.replace(FILE)
    snapshot=ROOT/'dist/data/snapshot.js';temp=snapshot.with_suffix('.tmp')
    temp.write_text('window.PORTFOLIO_DATA = '+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+';\n');temp.replace(snapshot)

def main():
    data=json.loads(FILE.read_text());data.setdefault('orcidPublications',[p for p in data['publications'] if p['source']=='ORCID']);data['lastAttempt']=NOW
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures={pool.submit(fn):name for name,fn in [('ORCID',orcid),('OpenAlex',openalex),('Scholar',scholar),('LinkedIn',linkedin)]}
        for future in concurrent.futures.as_completed(futures):
            name=futures[future]
            try:
                result=future.result()
                if result:data.update(result);print(name+': updated')
                else:print(name+': credentials not configured')
            except Exception:
                print(name+': update failed; saved data retained')
                if name=='LinkedIn':data.setdefault('linkedin',{})['status']='error'
                if name=='Scholar' and data.get('scholar'):data['scholar']['status']='error'
    previous={s['url']:s for s in data.get('sources',[])};fresh=[];states=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures=[pool.submit(collect_source,s,previous.get(s['url'])) for s in CONFIG['sources']]
        for f in futures:
            state,rows=f.result();states.append(state);fresh.extend(rows);print(state['name']+': '+state['status'])
    news={canonical(n['url']):n for n in data.get('news',[]) if allowed(n['url'])}
    for n in fresh:
        k=canonical(n['url'])
        if k not in news or n['kind']=='Page change':news[k]=n
    data['news']=sorted(news.values(),key=lambda n:n.get('date') or n.get('discoveredAt') or '',reverse=True)[:80]
    data['sources']=states
    if any(s['status']=='Checked' for s in states):data['newsUpdatedAt']=NOW
    save(data)
    print('Saved '+str(len(data['publications']))+' publications and '+str(len(data['news']))+' news/source updates.')
if __name__=='__main__':main()
