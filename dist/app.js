'use strict';
let data=window.PORTFOLIO_DATA || {publications:[],news:[],sources:[]};
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?esc(u.href):'#';}catch{return '#';}};
const date=s=>s&&!isNaN(Date.parse(s))?new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Date unavailable';
// EDIT PROJECT TEXT HERE: period, title, summary, tags, preview, and art key.
const projects=[
 {period:"2026–PRESENT · UHASSELT",title:"e-SAF Pathways: Economics, Sustainability & Policy",summary:"Assessing next-generation aviation fuel pathways built around green hydrogen, captured CO₂, synthesis, and upgrading. My PhD examines production costs, lifecycle impacts, environmental-economic trade-offs, and policy implications for e-SAF deployment.",tags:["FWO-SBO e-SAF","Power-to-X","TEA & LCA"],preview:"Evaluating the economics and sustainability of synthetic aviation fuels.",art:"esaf"},
 {period:"2025–2026 · SULTAN QABOOS UNIVERSITY",title:"Green Hydrogen Networks for Freight Transport",summary:"Developed a Python model linking green hydrogen production, transmission, storage, distribution, and refuelling. Hourly renewable-energy simulation and infrastructure optimization were used to assess cost-effective supply configurations for freight transport in Oman.",tags:["Infrastructure optimization","Python","Hourly simulation"],preview:"Connecting green hydrogen production with distribution networks and freight refuelling.",art:"hydrogen-network"},
 {period:"2025 · SULTAN QABOOS UNIVERSITY",title:"Renewable Hydrogen Supply Chains & Export Pathways",summary:"Compared hydrogen carrier pathways for international export of hydrogen from Oman to East Asia and the European Union. The analysis examined green hydrogen production, carrier conversion, intercontinental distribution using liquid hydrogen, methanol and ammonia, and delivery to end users through cost, lifecycle and sensitivity analyses.",tags:["Ammonia & methanol","Supply-chain modelling","TEA & LCA"],preview:"Comparing hydrogen carriers for international export from Oman.",art:"export"},
 {period:"2023–2024 · CORNELL UNIVERSITY",title:"Bitcoin Mining: Water, Land & Carbon Footprints",summary:"Led a four-member research team analyzing Bitcoin mining across 59 countries. The work combined life cycle assessment with mathematical modelling to quantify electricity-related water, land and carbon footprints and compare geographic differences.",tags:["59 countries","Life cycle assessment","Geospatial comparison"],preview:"Assessing Bitcoin mining infrastructure and environmental footprints across 59 countries.",art:"footprint"},
 {period:"2024 · AL-HAZM ENGINEERING SOLUTIONS",title:"Novel LNG Process with Vortex Tube Integration",summary:"Designed process simulations to investigate vortex-tube integration in LNG production. Identified integration opportunities, developed a successful project proposal, and co-developed a patent application for the process concept.",tags:["Patent development","Process integration","Energy efficiency"],preview:"Exploring vortex-tube integration for lower-energy natural gas liquefaction.",art:"lng"},
 {period:"2022–2023 · SULTAN QABOOS UNIVERSITY",title:"Sur Hydrogen Energy Transition Cluster",summary:"Assessed green hydrogen integration and decarbonization pathways for the Sur industrial cluster, including Oman LNG, Sur IPP and OMIFCO. The work also examined hydrogen transportation to supply Sohar Port and pathways to convert green hydrogen into export-oriented products such as ammonia and methanol, alongside infrastructure, risk and deployment considerations.",tags:["Industrial decarbonization","NH₃ & methanol","Transport assessment"],preview:"Assessing green hydrogen integration, industrial decarbonization and export pathways around Sur.",art:"cluster"},
 {period:"2023 · SULTAN QABOOS UNIVERSITY",title:"Mapping Green Hydrogen Potential in North-West Oman",summary:"Assessed the green hydrogen potential of Oman’s north-west region and opportunities for regional integration. The study combined renewable-resource assessment, hydrogen production modelling, techno-economic analysis and infrastructure considerations to identify pathways for regional development.",tags:["Regional feasibility","Techno-economics","Infrastructure planning"],preview:"Assessing renewable energy, green hydrogen production and regional integration opportunities.",art:"map"},
 {period:"2021–2023 · YEUNGNAM UNIVERSITY",title:"Hydrogen Liquefaction Process Design & Optimization",summary:"Applied process systems engineering to hydrogen liquefaction for storage and long-distance transport. Simulated and optimized liquefaction processes to improve energy and economic performance without increasing process complexity.",tags:["Process optimization","Energy efficiency","Complexity control"],preview:"Improving hydrogen liquefaction performance without increasing complexity.",art:"h2-liquefaction"},
 {period:"2021–2023 · YEUNGNAM UNIVERSITY",title:"LNG Process Design & Optimization",summary:"Modelled and optimized natural gas liquefaction systems for efficient LNG production and transport, with emphasis on energy, exergy, economic performance and process configuration.",tags:["Energy & exergy","Process systems engineering","Economic optimization"],preview:"Optimizing natural gas liquefaction cycles for energy and economic performance.",art:"lng-cycle"}
]
// EDIT PROJECT ANIMATION WORDS HERE: keep each stage concise.
function projectArt(kind){
 const scenes={
  "hydrogen-network":["Hydrogen","Network","Refueling"],
  "esaf":["Feedstock","Synthesis","e-SAF"],
  "export":["Hydrogen","Carrier","User"],
  "footprint":["Power","Mining","LCA"],
  "lng":["Gas","Vortex","LNG"],
  "cluster":["Hydrogen","Cluster","Decarbonization"],
  "map":["Renewables","Hydrogen","Network"],
  "h2-liquefaction":["Hydrogen","Liquefaction","LH₂"],
  "lng-cycle":["Gas","Liquefaction","LNG"]
 };
 const labels=scenes[kind]||["Source","Process","Use"];
 return `<span class="project-art project-scene scene-${esc(kind)}" aria-hidden="true"><span class="morph-core"></span><span class="scene-track"><i></i><i></i><i></i></span><span class="scene-nodes">${labels.map((label,i)=>`<b style="--node:${i}"><span>${i===0?'◇':i===1?'◌':'⌂'}</span>${esc(label)}</b>`).join('')}</span></span>`;
}
$('#projects').innerHTML=projects.map((p,i)=>`<button type="button" class="project-card" data-project="${i}" aria-haspopup="dialog" aria-label="Open ${esc(p.title)} project details"><span class="project-period">${esc(p.period)}</span>${projectArt(p.art)}<h3>${esc(p.title)}</h3><span class="project-preview">${esc(p.preview)}</span></button>`).join('');
let projectOpener=null;
const projectDialog=$('#project-dialog'), projectRail=$('#projects');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[Number(button.dataset.project)];projectOpener=button;
 $('#project-dialog-period').textContent=p.period;$('#project-dialog-title').textContent=p.title;$('#project-dialog-summary').textContent=p.summary;$('#project-dialog-tags').innerHTML=p.tags.map(t=>`<span>${esc(t)}</span>`).join('');projectDialog.showModal();
}));
$('#project-close').addEventListener('click',()=>projectDialog.close());
projectDialog.addEventListener('close',()=>projectOpener?.focus({preventScroll:true}));
projectDialog.addEventListener('click',e=>{const r=projectDialog.getBoundingClientRect();if(e.target===projectDialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))projectDialog.close();});
$('#project-publications').addEventListener('click',()=>projectDialog.close());
function moveProjects(direction){projectRail.scrollBy({left:direction*(projectRail.querySelector('.project-card').getBoundingClientRect().width+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
$('#project-prev').addEventListener('click',()=>moveProjects(-1));$('#project-next').addEventListener('click',()=>moveProjects(1));
projectRail.addEventListener('keydown',e=>{if(e.target===projectRail&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveProjects(e.key==='ArrowRight'?1:-1);}});
function updateProjectPosition(){const w=projectRail.querySelector('.project-card').getBoundingClientRect().width+24;const n=Math.min(projects.length,Math.round(projectRail.scrollLeft/w)+1);$('#project-position').textContent=`${n} / ${projects.length} projects`;
$('#project-prev').disabled=projectRail.scrollLeft<2;$('#project-next').disabled=projectRail.scrollLeft+projectRail.clientWidth>=projectRail.scrollWidth-2;}
projectRail.addEventListener('scroll',updateProjectPosition,{passive:true});addEventListener('resize',updateProjectPosition);requestAnimationFrame(updateProjectPosition);
const roles=[
 ["FEB 2026–PRESENT","Hasselt University","Hasselt, Belgium","e-SAF, environmental economics, TEA & LCA"],
 ["JAN 2025–JAN 2026","Sultan Qaboos University","Muscat, Oman","Green hydrogen systems & supply chains"],
 ["JAN 2024–DEC 2024","Al-Hazm Engineering Solutions LLC","Muscat, Oman","LNG systems & process integration"],
 ["DEC 2023–MAY 2024","Cornell University","Ithaca, USA","Environmental footprint modelling & LCA"],
 ["JAN 2022–NOV 2023","Sultan Qaboos University","Muscat, Oman","Green hydrogen systems & industrial decarbonization"],
 ["MAR 2021–FEB 2023","Yeungnam University","Gyeongsan, South Korea","Hydrogen liquefaction & LNG systems"]
];
$('#timeline').innerHTML=roles.map(r=>`<article class="timeline-item"><small>${r[0]}</small><h3>${r[1]}</h3><p>${r[2]}<br><span class="timeline-focus">${r[3]}</span></p></article>`).join('');
let filter='all',visiblePubs=[],newsLimit=12;
function normalizedNews(){const curated=window.SAF_CURATED||[];const feed=(data.news||[]).map(n=>({...n,region:n.region||(n.category==='EU policy'?'EU':n.category==='US SAF'?'US':'Global')}));const byUrl=new Map();[...feed,...curated].forEach(n=>{if(n?.url&&n?.date)byUrl.set(n.url,n);});return [...byUrl.values()];}
function renderMetrics(){const m=data.scholar?.metrics||data.metrics, provider=m?.provider||'Awaiting source';const values=[[data.publications.length,'Publication records','Connected public records'],[m?.citations,'Citations',provider],[m?.hIndex,'h-index',provider],[m?.i10Index,'i10-index',provider]];$('#metrics').innerHTML=values.map(v=>`<div class="metric"><span class="metric-value">${typeof v[0]==='number'?v[0].toLocaleString():'–'}</span><label>${v[1]}</label><small>${esc(v[2])}</small></div>`).join('');$('#metric-note').innerHTML=`ORCID retrieved ${date(data.orcidUpdatedAt)}${m?` · ${esc(provider)} metrics retrieved ${date(m.updatedAt)}`:''}. ${data.scholar?.metrics?'':'Google Scholar metrics are not connected.'}`;$('#metric-extra').innerHTML=m?`<p><a class="text-link" target="_blank" rel="noopener" href="${url(m.url)}">View ${esc(provider)} source ↗</a></p>`:'';if(data.scholar?.recent)$('#metric-extra').innerHTML+=`<p>Scholar recent window: ${esc(data.scholar.recent.label)} · Citations ${esc(data.scholar.recent.citations??'–')} · h-index ${esc(data.scholar.recent.hIndex??'–')} · i10-index ${esc(data.scholar.recent.i10Index??'–')}</p>`;if(m?.countsByYear?.length)$('#metric-extra').innerHTML+=`<p>Annual citation counts (${esc(provider)}): ${m.countsByYear.map(r=>`${r.year}: ${r.cited_by_count}`).join(' · ')}</p>`;}
// Journal profiles are keyed once by journal title. Quartile COUNTS are generated automatically
// from the live publication list, so adding/removing an article updates the chart without editing counts.
const normalizeJournal=s=>String(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
const journalProfiles={
 "international journal of thermofluids":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/international-journal-of-thermofluids"},
 "energy":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/energy"},
 "acs sustainable chemistry and engineering":{quartile:"Q1",publisher:"ACS",url:"https://pubs.acs.org/journal/ascecg"},
 "sustainable cities and society":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/sustainable-cities-and-society"},
 "international journal of hydrogen energy":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/international-journal-of-hydrogen-energy"},
 "chemosphere":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/chemosphere"},
 "energy conversion and management":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/energy-conversion-and-management"},
 "separation and purification technology":{quartile:"Q1",publisher:"Elsevier",url:"https://www.sciencedirect.com/journal/separation-and-purification-technology"},
 "energy proceedings volume 24 2021":{quartile:null,publisher:"Energy Proceedings",url:"https://www.energy-proceedings.org/"}
};
const journalPublisherTheme=publisher=>({
  "elsevier":{label:"Elsevier",className:"publisher-elsevier",accent:"EL"},
  "acs":{label:"ACS",className:"publisher-acs",accent:"ACS"},
  "rsc":{label:"RSC",className:"publisher-rsc",accent:"RSC"}
}[String(publisher||'').toLowerCase()]||{label:String(publisher||'Journal'),className:"publisher-generic",accent:"JR"});
const journalMonogram=name=>String(name||'').split(/[^A-Za-z0-9]+/).filter(Boolean).slice(0,4).map(w=>w[0].toUpperCase()).join('');
function publicationQuartile(p){
 const explicit=String(p.quartile||p.journalQuartile||'').toUpperCase().match(/Q[1-4]/)?.[0];
 if(explicit)return explicit;
 return journalProfiles[normalizeJournal(p.journal)]?.quartile||null;
}
function renderQuartiles(){
 const counts={Q1:0,Q2:0,Q3:0,Q4:0};
 data.publications.forEach(p=>{const q=publicationQuartile(p);if(q&&counts[q]!=null)counts[q]++;});
 const max=Math.max(1,...Object.values(counts));
 $('#quartile-chart').innerHTML=Object.entries(counts).map(([q,n])=>`<div class="quartile-row"><strong>${q}</strong><span class="quartile-bar"><i style="--bar:${(n/max)*100}%"></i></span><b>${n}</b></div>`).join('');
 $('#quartile-chart').setAttribute('aria-label',Object.entries(counts).map(([q,n])=>`${q}: ${n}`).join(', '));
}
function renderJournals(){
  const gallery = $('#journal-gallery');
  if(!gallery) return;

  const names = [...new Set(
    data.publications
      .map(p => String(p.journal || '').trim())
      .filter(j => j && !/^journal not supplied$/i.test(j))
  )];

  const fallbackNames = [
    "International Journal of Thermofluids",
    "Energy",
    "ACS Sustainable Chemistry & Engineering",
    "Sustainable Cities and Society",
    "International Journal of Hydrogen Energy",
    "Chemosphere",
    "Energy Conversion and Management",
    "Energy Proceedings, Volume 24 (2021)"
  ];

  const coverMap = window.JOURNAL_COVERS || {};

  const rows = (names.length ? names : fallbackNames).map(name => {
    const normalized = normalizeJournal(name);
    const profile = journalProfiles[normalized] || {};
    const cover = coverMap[normalized] || null;

    return {
      name,
      profile,
      cover
    };
  });

  gallery.innerHTML = rows.map(({name, profile, cover}, i) => {

    const theme = journalPublisherTheme(
      cover?.publisher || profile.publisher
    );

    const q = publicationQuartile({journal:name}) || '';

    const displayName = cover?.caption || name;

    const destination =
      cover?.url ||
      profile.url ||
      '';

    if(cover?.image){
      return `
        <a
          class="journal-card journal-cover-card"
          style="--jtilt:${((i % 5) - 2) * .7}deg"
          ${destination ? `href="${url(destination)}" target="_blank" rel="noopener"` : ''}
          title="${esc(displayName)}"
        >
          <div class="journal-brand">
            <span class="brand-badge">${esc(cover.publisher || theme.label)}</span>
            ${q ? `<span class="journal-q">${q}</span>` : ''}
          </div>

          <div class="journal-cover-wrap">
            <img
              src="${esc(cover.image)}"
              alt="${esc(displayName)} cover"
              loading="lazy"
            >
          </div>

          <small class="journal-foot">
            ${esc(displayName)}
          </small>
        </a>
      `;
    }

    return `
      <a
        class="journal-card ${theme.className}"
        style="--jtilt:${((i % 5) - 2) * .7}deg"
        ${destination ? `href="${url(destination)}" target="_blank" rel="noopener"` : ''}
        title="${esc(displayName)}"
      >
        <div class="journal-brand">
          <span class="brand-badge">${esc(theme.label)}</span>
          ${q ? `<span class="journal-q">${q}</span>` : ''}
        </div>

        <div class="journal-art">
          <i class="journal-lines"></i>
          <b class="journal-mark">
            ${esc(journalMonogram(displayName) || theme.accent)}
          </b>
        </div>

        <small class="journal-foot">
          ${esc(displayName)}
        </small>
      </a>
    `;
  }).join('');
}
function renderPubs(){const query=$('#publication-search').value.toLowerCase(),year=$('#publication-year').value;visiblePubs=data.publications.filter(p=>(year==='all'||String(p.year)===year)&&[p.title,p.journal,p.doi,p.authors].join(' ').toLowerCase().includes(query)).sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0)||a.title.localeCompare(b.title));$('#publication-count').textContent=`${visiblePubs.length} of ${data.publications.length} publication records`;$('#publication-list').innerHTML=visiblePubs.map(p=>`<article class="publication"><span class="pub-year">${esc(p.year||'–')}</span><div><h3><a href="${url(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>${p.citations!=null?`<span class="citation-badge" title="Citation count from ${esc(p.citationSource||'connected source')}">${esc(p.citations)} citations</span>`:''}${/environmental footprint of bitcoin/i.test(p.title||'')?`<span class="cover-badge">Journal cover feature</span>`:''}</h3><p>${esc(p.journal||'Journal not supplied')} · ${esc(p.source)}${publicationQuartile(p)?` · ${publicationQuartile(p)}`:''}</p>${p.authors?`<p>${esc(p.authors)}</p>`:''}${p.doi?`<p class="pub-doi">doi: ${esc(p.doi)}</p>`:''}</div><a class="pub-arrow" href="${url(p.url)}" target="_blank" rel="noopener" aria-label="Read ${esc(p.title)}">↗</a></article>`).join('')||'<p class="empty">No publications match your search. Try another term or year.</p>';}
function renderNews(){const allRows=normalizedNews().filter(n=>filter==='all'||n.region===filter).filter(n=>n.date).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));const rows=allRows.slice(0,newsLimit);$('#news-more').hidden=allRows.length<=newsLimit;$('#news-list').innerHTML=rows.map(n=>`<article class="news-card"><div class="news-meta"><b>${esc(n.source)}</b><span>${date(n.date)}</span></div><h3><a href="${url(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a></h3>${n.summary?`<p>${esc(n.summary)}</p>`:''}<div class="news-bottom"><span>${esc(n.region||'Global')}${n.kind?' · '+esc(n.kind):''}</span><a href="${url(n.url)}" target="_blank" rel="noopener" aria-label="Read ${esc(n.title)}">Read source ↗</a></div></article>`).join('')||'<p class="empty">No dated updates match the current filter.</p>';$('#news-updated').textContent=`${allRows.length} dated items · ordered by publication date`;$('#source-list').innerHTML=(data.sources||[]).map(s=>`<div class="source-item"><a href="${url(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a><small>${esc(s.status||'Not checked')} ${s.lastSuccess?'· Last success '+date(s.lastSuccess):''}</small></div>`).join('');}
function render(){const selected=$('#publication-year').value;$('#publication-year').innerHTML='<option value="all">All years</option>'+[...new Set(data.publications.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a).map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('');if([...$('#publication-year').options].some(o=>o.value===selected))$('#publication-year').value=selected;renderMetrics();renderQuartiles();renderJournals();renderPubs();renderNews();}
render();if(location.protocol!=='file:')fetch(window.PORTFOLIO_SETTINGS?.researchFeedUrl || 'data/research.json',{cache:'no-cache',signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>{if(Array.isArray(d.publications)){data=d;render();}}).catch(()=>{});
$('#news-more').addEventListener('click',()=>{newsLimit+=12;renderNews();});
$('#publication-search').addEventListener('input',renderPubs);$('#publication-year').addEventListener('change',renderPubs);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;newsLimit=12;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderNews();}));
$('#export-bib').addEventListener('click',()=>{const clean=s=>String(s||'').replace(/[{}\\]/g,'');const content=visiblePubs.map((p,i)=>`@article{sial${p.year||'undated'}_${i+1},\n  title = {${clean(p.title)}},\n${p.authors?`  author = {${clean(p.authors)}},\n`:''}${p.year?`  year = {${p.year}},\n`:''}  journal = {${clean(p.journal)}},\n  doi = {${clean(p.doi)}},\n  url = {${clean(p.url)}}\n}`).join('\n\n');const blob=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=blob;a.download='noman-raza-sial-publications.bib';a.click();setTimeout(()=>URL.revokeObjectURL(blob),1000);});
$('.menu-button').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',String(open));$('.menu-button').textContent=open?'Close −':'Menu +';});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-button').setAttribute('aria-expanded','false');$('.menu-button').textContent='Menu +';}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-button').setAttribute('aria-expanded','false');$('.menu-button').textContent='Menu +';}});
$('#copyright-year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.section-heading,.project,.timeline-item,.contact').forEach(e=>{e.classList.add('reveal');observer.observe(e);});}
let scheduled=false;addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false;});scheduled=true;}},{passive:true});

// Research interests support mouse hover, keyboard focus, and touch/click.
const interests = [
 ["Environmental economics","Making environmental trade-offs visible.","Environmental economics examines how costs, impacts, incentives, and policy influence decisions. Valuation and economic assessment help compare pathways with different benefits and environmental burdens.",["Valuation","Policy incentives","Trade-offs"],["Costs & impacts","Policy choices","Decisions"]],
 ["Techno-economic analysis","What makes a promising process viable?","Techno-economic analysis connects process performance with investment and operating costs. Sensitivity and scenario analysis reveal which assumptions have the strongest influence on viability.",["Capital cost","Operating cost","Sensitivity"],["Process model","Cost model","Scenarios"]],
 ["Life cycle assessment","Follow the impacts beyond the plant.","Life cycle assessment tracks environmental burdens from resource extraction through production, use, and end of life. Clear system boundaries enable meaningful comparisons and reveal burden shifting.",["System boundaries","Resource use","Environmental impacts"],["Resources","Production & use","End of life"]],
 ["Process systems engineering","Every connection changes the system.","Simulation, optimization, and process integration reveal how technologies work together. Balancing material, energy, and economic constraints helps identify efficient system configurations.",["Simulation","Optimization","Integration"],["Model","Optimize","Integrate"]],
 ["Power-to-X","Energy, transformed.","Power-to-X uses an energy source to generate electricity and convert it into fuels and chemicals. Conversion efficiency, carbon sources, and end-use requirements shape the best pathway.",["Energy source","Electricity","Fuels & chemicals"],["Source of energy","Electricity","Fuels & chemicals"]],
 ["Sustainable aviation fuels","Cleaner flight starts with the fuel pathway.","Synthetic aviation fuels can combine captured carbon with renewable hydrogen. Their sustainability depends on electricity sources, feedstocks, production efficiency, and lifecycle emissions.",["Captured CO₂","Renewable hydrogen","Fuel synthesis"],["Captured carbon","Synthesis","Aviation fuel"]],
 ["Green hydrogen systems","From renewable power to a hydrogen network.","Renewable electricity powers electrolysis to produce hydrogen. Storage, transport, and end-use infrastructure determine how resources reach demand and shape the cost of the complete supply chain.",["Electrolysis","Storage","Infrastructure"],["Renewable power","Electrolysis","Hydrogen"]],
 ["LNG systems","Liquefying natural gas. Connecting an energy system.","Natural gas liquefaction reduces volume for storage and transport. Liquefaction cycles, heat integration, and process design determine energy demand and economic performance.",["Liquefaction","Thermodynamics","Process design"],["Natural gas","Liquefaction","LNG"]]
];
function selectInterest(index) {
  const item=interests[index];
  if(!item)return;
  document.querySelectorAll('[data-interest]').forEach(button=>{
    const active=Number(button.dataset.interest)===index;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  $('#interest-kicker').textContent=item[0].toUpperCase();
  $('#interest-title').textContent=item[1];
  $('#interest-graphic').innerHTML='<div class="concept-flow">'+item[4].map((label,i)=>`<div class="concept-node" style="--step:${i}"><span class="concept-orb" aria-hidden="true">${['✧','◈','◎'][i]}</span><strong>${esc(label)}</strong></div>`).join('')+'</div><small>Conceptual pathway</small>';
  $('#interest-description').textContent=item[2];
  $('#interest-tags').innerHTML=item[3].map(t=>`<span>${esc(t)}</span>`).join('');
}
const interestButtons=[...document.querySelectorAll('[data-interest]')];
interestButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>selectInterest(index));
  button.addEventListener('focus',()=>selectInterest(index));
  button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectInterest(index);});
  button.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%interestButtons.length;
    else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+interestButtons.length)%interestButtons.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=interestButtons.length-1;
    else return;
    event.preventDefault();interestButtons[next].focus();
  });
});

selectInterest(0);
// Load the replacement only when available; retain the existing portrait otherwise.
const replacementPhoto=new Image();replacementPhoto.onload=()=>{$('#profile-photo').src=replacementPhoto.src;};replacementPhoto.src='assets/NRS07301.jpeg';
$('#software-grid').innerHTML=(window.TOOLKIT||[]).map((t,i)=>{
 const rating=Number.isFinite(Number(t.proficiency))&&Number(t.proficiency)>=0&&Number(t.proficiency)<=5?Number(t.proficiency):null;
 return `<article class="software-card"><button class="software-trigger" aria-expanded="false" aria-controls="software-detail-${i}"><span class="software-logo"><img src="assets/software/${esc(t.icon)}" alt="" loading="lazy">${t.extraIcon?`<img class="secondary-icon" src="assets/software/${esc(t.extraIcon)}" alt="">`:''}</span><strong>${esc(t.name)}</strong><span class="tool-purpose">${esc(t.purpose)}</span><span class="tool-hint">Explore tool +</span></button><div class="software-detail" id="software-detail-${i}" hidden><p>${esc(t.description)}</p><div class="proficiency-chart" role="img" aria-label="Proficiency bar">${[1,2,3,4,5].map(n=>{const fill=rating==null?0:Math.max(0,Math.min(1,rating-(n-1)));return `<span style="--fill:${fill*100}%"></span>`;}).join('')}</div></div></article>`;
}).join('');
document.querySelectorAll('.software-card').forEach(card=>{const button=card.querySelector('button'),panel=card.querySelector('.software-detail');let pinned=false;
 const setOpen=open=>{panel.hidden=!open;button.setAttribute('aria-expanded',String(open));};
 button.addEventListener('click',()=>{pinned=!pinned;setOpen(pinned);});
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setOpen(true);});card.addEventListener('pointerleave',()=>{if(!pinned&&!card.contains(document.activeElement))setOpen(false);});
 card.addEventListener('focusin',()=>setOpen(true));card.addEventListener('focusout',e=>{if(!pinned&&!card.contains(e.relatedTarget))setOpen(false);});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;setOpen(false);}});
});



const experienceOrganizations=[
 {name:"Hasselt University",logo:"assets/logos/uhasselt.png",url:"https://www.uhasselt.be/"},
 {name:"Sultan Qaboos University",logo:"assets/logos/sultan-qaboos.png",url:"https://www.squ.edu.om/"},
 {name:"Cornell University",logo:"assets/logos/cornell-red.png",url:"https://www.cornell.edu/"},
 {name:"Al-Hazm Engineering Solutions LLC",logo:"assets/logos/al-hazm.svg",url:"#"},
 {name:"Yeungnam University",logo:"assets/logos/yeungnam.svg",url:"https://www.yu.ac.kr/english/index.do"}
];
const experienceCollage=$('#experience-collage');
if(experienceCollage){experienceCollage.innerHTML=experienceOrganizations.map((org,i)=>`<a class="experience-logo-card" style="--tilt:${[-2.2,1.2,-.8,2.1,-1.4][i]||0}deg;--lift:${[8,0,13,4,10][i]||0}px" href="${url(org.url)}" ${org.url==='#'?'':'target="_blank" rel="noopener"'} aria-label="${esc(org.name)}"><img src="${esc(org.logo)}" alt="${esc(org.name)}" loading="lazy"></a>`).join('');}

const stakeholderGrid=$('#stakeholder-grid');
if(stakeholderGrid){const funders=window.PORTFOLIO_FUNDERS||[];stakeholderGrid.innerHTML=funders.map((f,i)=>`<a class="stakeholder-card collage-item" style="--tilt:${((i%5)-2)*1.3}deg;--lift:${(i%3)*7}px" href="${url(f.url||'#')}" ${f.url?'target="_blank" rel="noopener"':''} aria-label="${esc(f.name||'Project stakeholder')}"><img src="assets/funders/${esc(f.file)}" alt="${esc(f.name||'Project stakeholder logo')}" loading="lazy"></a>`).join('');}

// Short intro animation only on a fresh page load; reduced-motion users skip it.
const loader=$('#page-loader');if(loader){const hideLoader=()=>loader.classList.add('is-hidden');if(matchMedia('(prefers-reduced-motion: reduce)').matches)hideLoader();else setTimeout(hideLoader,3650);}

// Optional organization logos: text fallback remains when the file is absent.
document.querySelectorAll('.optional-logo').forEach(img=>{img.addEventListener('load',()=>{img.style.display='block';const fallback=img.previousElementSibling;if(fallback?.classList.contains('fallback-wordmark'))fallback.hidden=true;});img.addEventListener('error',()=>{img.style.display='none';});if(img.complete&&img.naturalWidth){img.dispatchEvent(new Event('load'));}});
