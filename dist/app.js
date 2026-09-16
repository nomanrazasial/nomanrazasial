'use strict';
let data=window.PORTFOLIO_DATA || {publications:[],news:[],sources:[]};
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==='https:'?esc(u.href):'#';}catch{return '#';}};
const date=s=>s&&!isNaN(Date.parse(s))?new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Date unavailable';
const projects=[
  [
    "2026–PRESENT · UHASSELT",
    "e-SAF Pathways: Economics, Sustainability & Policy",
    "Assessing next-generation aviation fuel pathways from captured CO₂, water, and renewable electricity. My PhD examines the drivers of production costs and lifecycle emissions, and their implications for policy.",
    [
      "FWO-SBO e-SAF",
      "Power-to-X",
      "TEA & LCA"
    ]
  ],
  [
    "2025–2026 · SULTAN QABOOS UNIVERSITY",
    "Green Hydrogen Networks for Freight Transport",
    "Developed a Python model linking hydrogen production, transmission, storage, and refuelling. Evaluated 21 supply pathways using hourly renewable-energy simulation and infrastructure optimization for freight transport in Oman.",
    [
      "21 supply pathways",
      "Infrastructure optimization",
      "Python"
    ]
  ],
  [
    "2025 · SULTAN QABOOS UNIVERSITY",
    "Renewable Hydrogen Supply Chains & Export Pathways",
    "Modelled domestic supply and international export routes, from renewable hydrogen production to storage, transport, and conversion. Compared liquid hydrogen, ammonia, and methanol pathways through cost, lifecycle, and sensitivity analyses.",
    [
      "LH₂",
      "Ammonia & methanol",
      "Supply-chain modelling"
    ]
  ],
  [
    "2023–2024 · CORNELL UNIVERSITY",
    "Bitcoin Mining: Water, Land & Carbon Footprints",
    "Led a four-member research team investigating the environmental footprint of Bitcoin mining. Combined life cycle assessment with mathematical models of direct resource use to quantify water, land, and carbon impacts.",
    [
      "Bitcoin mining",
      "Environmental footprints",
      "LCA"
    ]
  ],
  [
    "2024 · AL-HAZM ENGINEERING SOLUTIONS",
    "Novel LNG Processes with Vortex Tube Integration",
    "Designed process simulations to investigate vortex tube integration in LNG production. Identified integration opportunities, developed a successful project proposal, and co-developed a patent application for the process concept.",
    [
      "LNG systems",
      "Vortex tubes",
      "Process integration"
    ]
  ],
  [
    "2022–2023 · SULTAN QABOOS UNIVERSITY",
    "Sur Hydrogen Energy Transition Cluster",
    "Assessed the feasibility of the Sur industrial hydrogen cluster with project partners and regional stakeholders. Modelled hydrogen–natural gas blends and intercity hydrogen transport, assessed risks, and contributed to a deployment roadmap.",
    [
      "Sur Industrial City",
      "Hydrogen blending",
      "Cluster development"
    ]
  ],
  [
    "2023 · SULTAN QABOOS UNIVERSITY",
    "Mapping Green Hydrogen Potential in North-West Oman",
    "Led a four-member feasibility study of renewable hydrogen production in an underexplored, landlocked region. Developed techno-economic models and policy recommendations to inform infrastructure planning and Oman’s energy transition.",
    [
      "Regional feasibility",
      "Green hydrogen",
      "Technology & policy"
    ]
  ],
  [
    "2021–2023 · YEUNGNAM UNIVERSITY",
    "Hydrogen & Natural Gas Storage and Transport",
    "Applied process systems engineering to hydrogen liquefaction and LNG systems for storage and long-distance transport. Simulated and optimized refrigeration processes to improve energy and economic performance while limiting process complexity.",
    [
      "Process systems engineering",
      "Hydrogen liquefaction",
      "LNG systems"
    ]
  ]
];
const projectSymbols=['CO₂ → SAF','H₂ → km','H₂ → NH₃','CO₂ · H₂O','CH₄ ↔ LNG','H₂ + CH₄','☀ → H₂','H₂ ⇄ LNG'];
const projectPreviews=['Evaluating the economics and sustainability of synthetic aviation fuels.','Connecting renewable hydrogen to freight refuelling infrastructure.','Comparing hydrogen carriers for domestic supply and export.','Understanding the resource demands of digital infrastructure.','Exploring new configurations for natural gas liquefaction.','Planning an industrial hydrogen transition in Sur, Oman.','Assessing regional opportunities for renewable hydrogen.','Optimizing liquefaction for fuel storage and transport.'];
$('#projects').innerHTML=projects.map((p,i)=>`<button type="button" class="project-card" data-project="${i}" aria-haspopup="dialog"><span class="project-period">${esc(p[0])}</span><span class="project-art art-${i%4}" aria-hidden="true"><span>${projectSymbols[i]}</span><i></i><i></i><i></i></span><h3>${esc(p[1])}</h3><span class="project-preview">${esc(projectPreviews[i])}</span><span class="project-card-footer">${esc(p[3][0])}<b>Explore ↗</b></span></button>`).join('');
let projectOpener=null;
const projectDialog=$('#project-dialog'), projectRail=$('#projects');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[Number(button.dataset.project)];projectOpener=button;
 $('#project-dialog-period').textContent=p[0];$('#project-dialog-title').textContent=p[1];$('#project-dialog-summary').textContent=p[2];$('#project-dialog-tags').innerHTML=p[3].map(t=>`<span>${esc(t)}</span>`).join('');projectDialog.showModal();
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
  [
    "FEB 2026–PRESENT",
    "Hasselt University",
    "Doctoral Researcher",
    "Hasselt, Belgium · e-SAF: economics, sustainability & policy"
  ],
  [
    "JAN 2025–JAN 2026",
    "Sultan Qaboos University",
    "Senior Researcher",
    "Muscat, Oman · Green hydrogen systems & supply chains"
  ],
  [
    "JAN–DEC 2024",
    "Al-Hazm Engineering Solutions",
    "Process Engineering Consultant",
    "Muscat, Oman · LNG systems & vortex tube integration"
  ],
  [
    "DEC 2023–MAY 2024",
    "Cornell University",
    "Visiting Graduate Researcher",
    "Ithaca, USA · Bitcoin mining systems & LCA"
  ],
  [
    "JAN 2022–NOV 2023",
    "Sultan Qaboos University",
    "Research Assistant → Senior Researcher",
    "Muscat, Oman · Green hydrogen infrastructure: technology, economics & policy"
  ],
  [
    "MAR 2021–FEB 2023",
    "Yeungnam University",
    "Graduate Research Student",
    "Gyeongsan, South Korea · Hydrogen liquefaction & LNG systems"
  ]
];
$('#timeline').innerHTML=roles.map(r=>`<article class="timeline-item"><small>${r[0]}</small><h3>${r[1]}</h3><p class="role">${r[2]}</p><p>${r[3]}</p></article>`).join('');
let filter='all',visiblePubs=[],newsLimit=9;
function renderMetrics(){const m=data.scholar?.metrics||data.metrics, provider=m?.provider||'Awaiting source';const values=[[data.publications.length,'Publication records','Connected public records'],[m?.citations,'Citations',provider],[m?.hIndex,'h-index',provider],[m?.i10Index,'i10-index',provider]];$('#metrics').innerHTML=values.map(v=>`<div class="metric"><span class="metric-value">${typeof v[0]==='number'?v[0].toLocaleString():'–'}</span><label>${v[1]}</label><small>${esc(v[2])}</small></div>`).join('');$('#metric-note').innerHTML=`ORCID retrieved ${date(data.orcidUpdatedAt)}${m?` · ${esc(provider)} metrics retrieved ${date(m.updatedAt)}`:''}. ${data.scholar?.metrics?'':'Google Scholar metrics are not connected.'}`;$('#metric-extra').innerHTML=m?`<p><a class="text-link" target="_blank" rel="noopener" href="${url(m.url)}">View ${esc(provider)} source ↗</a></p>`:'';if(data.scholar?.recent)$('#metric-extra').innerHTML+=`<p>Scholar recent window: ${esc(data.scholar.recent.label)} · Citations ${esc(data.scholar.recent.citations??'–')} · h-index ${esc(data.scholar.recent.hIndex??'–')} · i10-index ${esc(data.scholar.recent.i10Index??'–')}</p>`;if(m?.countsByYear?.length)$('#metric-extra').innerHTML+=`<p>Annual citation counts (${esc(provider)}): ${m.countsByYear.map(r=>`${r.year}: ${r.cited_by_count}`).join(' · ')}</p>`;}
function renderPubs(){const query=$('#publication-search').value.toLowerCase(),year=$('#publication-year').value;visiblePubs=data.publications.filter(p=>(year==='all'||String(p.year)===year)&&[p.title,p.journal,p.doi,p.authors].join(' ').toLowerCase().includes(query)).sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0)||a.title.localeCompare(b.title));$('#publication-count').textContent=`${visiblePubs.length} of ${data.publications.length} publication records`;$('#publication-list').innerHTML=visiblePubs.map(p=>`<article class="publication"><span class="pub-year">${esc(p.year||'–')}</span><div><h3><a href="${url(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a></h3><p>${esc(p.journal||'Journal not supplied')} · ${esc(p.source)}${p.citations!=null?` · ${esc(p.citations)} citations (${esc(p.citationSource||'source')})`:''}</p>${p.authors?`<p>${esc(p.authors)}</p>`:''}${p.doi?`<p class="pub-doi">doi: ${esc(p.doi)}</p>`:''}</div><a class="pub-arrow" href="${url(p.url)}" target="_blank" rel="noopener" aria-label="Read ${esc(p.title)}">↗</a></article>`).join('')||'<p class="empty">No publications match your search. Try another term or year.</p>';}
function renderNews(){const allRows=(data.news||[]).filter(n=>filter==='all'||n.category===filter).sort((a,b)=>{const rank=n=>n.kind==='Source discovery'?0:1;return rank(b)-rank(a)||Date.parse(b.date||b.discoveredAt||0)-Date.parse(a.date||a.discoveredAt||0);});const rows=allRows.slice(0,newsLimit);$('#news-more').hidden=allRows.length<=newsLimit;$('#news-list').innerHTML=rows.map(n=>`<article class="news-card"><div class="news-meta"><b>${esc(n.source)}</b><span>${n.date?date(n.date):'Found '+date(n.discoveredAt)}</span></div><h3><a href="${url(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a></h3>${n.summary?`<p>${esc(n.summary)}</p>`:''}<div class="news-bottom"><span>${esc(n.category)}${n.kind?' · '+esc(n.kind):''}</span><a href="${url(n.url)}" target="_blank" rel="noopener" aria-label="Read ${esc(n.title)}">Read source ↗</a></div></article>`).join('')||'<p class="empty">No matching updates in the current snapshot.</p>';$('#news-updated').textContent=data.newsUpdatedAt?'Last successful collection · '+date(data.newsUpdatedAt):'Curated source snapshot';$('#source-list').innerHTML=(data.sources||[]).map(s=>`<div class="source-item"><a href="${url(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a><small>${esc(s.status||'Not checked')} ${s.lastSuccess?'· Last success '+date(s.lastSuccess):''}</small></div>`).join('');}
function render(){const selected=$('#publication-year').value;$('#publication-year').innerHTML='<option value="all">All years</option>'+[...new Set(data.publications.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a).map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('');if([...$('#publication-year').options].some(o=>o.value===selected))$('#publication-year').value=selected;renderMetrics();renderPubs();renderNews();}
render();if(location.protocol!=='file:')fetch(window.PORTFOLIO_SETTINGS?.researchFeedUrl || 'data/research.json',{cache:'no-cache',signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>{if(Array.isArray(d.publications)){data=d;render();}}).catch(()=>{});
$('#news-more').addEventListener('click',()=>{newsLimit+=9;renderNews();});
$('#publication-search').addEventListener('input',renderPubs);$('#publication-year').addEventListener('change',renderPubs);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;newsLimit=9;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderNews();}));
$('#export-bib').addEventListener('click',()=>{const clean=s=>String(s||'').replace(/[{}\\]/g,'');const content=visiblePubs.map((p,i)=>`@article{sial${p.year||'undated'}_${i+1},\n  title = {${clean(p.title)}},\n${p.authors?`  author = {${clean(p.authors)}},\n`:''}${p.year?`  year = {${p.year}},\n`:''}  journal = {${clean(p.journal)}},\n  doi = {${clean(p.doi)}},\n  url = {${clean(p.url)}}\n}`).join('\n\n');const blob=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=blob;a.download='noman-raza-sial-publications.bib';a.click();setTimeout(()=>URL.revokeObjectURL(blob),1000);});
$('.menu-button').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',String(open));$('.menu-button').textContent=open?'Close −':'Menu +';});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-button').setAttribute('aria-expanded','false');$('.menu-button').textContent='Menu +';}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-button').setAttribute('aria-expanded','false');$('.menu-button').textContent='Menu +';}});
$('#copyright-year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.section-heading,.project,.timeline-item,.contact').forEach(e=>{e.classList.add('reveal');observer.observe(e);});}
let scheduled=false;addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false;});scheduled=true;}},{passive:true});

// Research interests support mouse hover, keyboard focus, and touch/click.
const interests = [["Sustainable aviation fuels", "Cleaner flight starts with the fuel pathway.", "Synthetic aviation fuels can combine captured carbon with renewable hydrogen. Their sustainability depends on electricity sources, feedstocks, production efficiency, and lifecycle emissions.", ["Captured CO₂", "Renewable H₂", "Fuel synthesis"], ["CO₂ + H₂", "Synthesis", "Aviation fuel"]], ["Techno-economic analysis", "What makes a promising process viable?", "Techno-economic analysis connects process performance with investment and operating costs. Sensitivity and scenario analysis reveal which assumptions have the strongest influence on viability.", ["Capital cost", "Operating cost", "Sensitivity"], ["Process model", "Cost model", "Scenarios"]], ["Process systems engineering", "Every connection changes the system.", "Simulation, optimization, and process integration reveal how technologies work together. Balancing material, energy, and economic constraints helps identify efficient system configurations.", ["Simulation", "Optimization", "Integration"], ["Model", "Optimize", "Integrate"]], ["Green hydrogen systems", "From renewable power to a hydrogen network.", "Renewable electricity powers electrolysis to produce hydrogen. Storage, transport, and end-use infrastructure determine how resources reach demand and shape the cost of the complete supply chain.", ["Electrolysis", "Storage", "Infrastructure"], ["Renewable power", "Electrolysis", "Hydrogen supply"]], ["LNG systems", "Cooling a gas. Connecting an energy system.", "Natural gas liquefaction reduces volume for storage and transport. Refrigeration cycles, heat integration, and process design determine energy demand and economic performance.", ["Refrigeration", "Thermodynamics", "Process design"], ["Natural gas", "Refrigeration", "LNG"]], ["Life cycle assessment", "Follow the impacts beyond the plant.", "Life cycle assessment tracks environmental burdens from resource extraction through production, use, and end of life. Clear system boundaries enable meaningful comparisons and reveal burden shifting.", ["System boundaries", "Resource use", "Environmental impacts"], ["Resources", "Production & use", "End of life"]], ["Power-to-X", "Renewable electricity, transformed.", "Power-to-X converts electricity into hydrogen and derived products such as ammonia, methanol, and synthetic fuels. Conversion efficiency and end-use requirements shape the best pathway.", ["Electrolysis", "Conversion", "e-fuels"], ["Electricity", "Hydrogen", "Fuels & chemicals"]], ["Environmental economics", "Making environmental trade-offs visible.", "Environmental economics examines how costs, impacts, incentives, and policy influence decisions. Valuation and economic assessment help compare pathways with different benefits and environmental burdens.", ["Valuation", "Policy incentives", "Trade-offs"], ["Costs & impacts", "Policy choices", "Decisions"]]];
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
 const rating=Number.isInteger(t.proficiency)&&t.proficiency>=1&&t.proficiency<=5?t.proficiency:null;
 return `<article class="software-card"><button class="software-trigger" aria-expanded="false" aria-controls="software-detail-${i}"><span class="software-logo"><img src="assets/software/${esc(t.icon)}" alt="" loading="lazy">${t.extraIcon?`<img class="secondary-icon" src="assets/software/${esc(t.extraIcon)}" alt="">`:''}</span><strong>${esc(t.name)}</strong><span class="tool-purpose">${esc(t.purpose)}</span><span class="tool-hint">Explore tool +</span></button><div class="software-detail" id="software-detail-${i}" hidden><p>${esc(t.description)}</p><span class="rating-label">Self-assessed proficiency${rating?` · ${rating}/5`:''}</span><div class="proficiency-chart" role="img" aria-label="${rating?rating+' out of 5':'Proficiency not specified'}">${[1,2,3,4,5].map(n=>`<span class="${rating&&n<=rating?'filled':''}" style="--level:${n}"></span>`).join('')}</div><small>${rating?['','Foundational','Developing','Proficient','Advanced','Expert'][rating]:'Proficiency not specified'}</small></div></article>`;
}).join('');
document.querySelectorAll('.software-card').forEach(card=>{const button=card.querySelector('button'),panel=card.querySelector('.software-detail');let pinned=false;
 const setOpen=open=>{panel.hidden=!open;button.setAttribute('aria-expanded',String(open));};
 button.addEventListener('click',()=>{pinned=!pinned;setOpen(pinned);});
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setOpen(true);});card.addEventListener('pointerleave',()=>{if(!pinned&&!card.contains(document.activeElement))setOpen(false);});
 card.addEventListener('focusin',()=>setOpen(true));card.addEventListener('focusout',e=>{if(!pinned&&!card.contains(e.relatedTarget))setOpen(false);});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;setOpen(false);}});
});
