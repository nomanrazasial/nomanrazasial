"""Static delivery checks: asset paths, source integrity and snapshot consistency."""
import json,re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'dist'
class Audit(HTMLParser):
    def __init__(self):super().__init__();self.ids=set();self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):
            assert a['id'] not in self.ids,'Duplicate id: '+a['id']
            self.ids.add(a['id'])
        for name in ('href','src'):
            if name in a:self.refs.append(a[name])
audit=Audit();audit.feed((SITE/'index.html').read_text())
for ref in audit.refs:
    u=urlsplit(ref)
    if u.scheme or u.netloc:continue
    if u.path:assert (SITE/unquote(u.path)).is_file(),'Missing asset: '+u.path
    elif u.fragment:assert u.fragment in audit.ids,'Missing anchor: '+u.fragment
data=json.loads((SITE/'data/research.json').read_text())
raw=(SITE/'data/snapshot.js').read_text().removeprefix('window.PORTFOLIO_DATA = ').rstrip().removesuffix(';')
assert json.loads(raw)==data,'Snapshot out of sync'
assert data['publications'],'No publication records'
for p in data['publications']:
    assert p['title'] and p['url'].startswith('https://')
    if p.get('year'):assert re.fullmatch(r'\d{4}',str(p['year']))
config=json.loads((ROOT/'config.json').read_text())
for n in data['news']:
    u=urlsplit(n['url']);host=u.hostname or ''
    assert u.scheme=='https' and any(host==x or host.endswith('.'+x) for x in config['allowedDomains']),n['url']
for m in (data.get('metrics'),(data.get('scholar') or {}).get('metrics')):
    if m:
        assert m['provider'] and m['updatedAt']
        for k in ('citations','hIndex','i10Index'):
            assert m.get(k) is None or isinstance(m[k],(int,float)) and m[k]>=0
assert not any(p.name.startswith('.env') for p in SITE.rglob('*'))
print(f'PASS: assets, anchors, snapshots, {len(data["publications"])} publications, {len(data["news"])} approved-source items.')
