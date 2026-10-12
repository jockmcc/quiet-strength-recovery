(() => {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = {
    read:'<path d="M4 5h6c2 0 2 1 2 1s0-1 2-1h6v14h-6c-2 0-2 1-2 1s0-1-2-1H4z"/><path d="M12 6v14"/>',
    write:'<path d="m15 4 5 5-11 11H4v-5z"/><path d="m12 7 5 5"/>',
    watch:'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    coffee:'<path d="M4 9h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a3 3 0 0 1 0 6h-2M6 3v3M10 2v4M14 3v3"/>',
    people:'<circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5"/>',
    tool:'<path d="m13 3-3 7H4l6 4-2 7 12-12h-7z"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.tool}</svg>`;
  let family = false, readings = {}, videos = [], readingFailed = false, videoFailed = false;
  let videoFilter = 'all', videoSearch = '';
  function configure(options) {
    family = !!options.family;
    fetch(family ? 'family_daily_readings.json' : 'daily_readings.json')
      .then(r => { if (!r.ok) throw new Error('reading'); return r.json(); })
      .then(data => { readings = data; window.dispatchEvent(new Event('qsr-explore-ready')); })
      .catch(() => { readingFailed = true; window.dispatchEvent(new Event('qsr-explore-ready')); });
    if (!family) fetch('video_library.json')
      .then(r => { if (!r.ok) throw new Error('video'); return r.json(); })
      .then(data => { videos = data.videos; window.dispatchEvent(new Event('qsr-explore-ready')); })
      .catch(() => { videoFailed = true; window.dispatchEvent(new Event('qsr-explore-ready')); });
  }
  function shortcuts() {
    return `<section class="explore-start" aria-labelledby="exploreStartTitle"><div class="explore-section-heading"><h2 id="exploreStartTitle">What would help today?</h2><span>Choose one thing</span></div><div class="explore-shortcuts">
      <a class="explore-tile read" href="#reflection">${icon('read')}<strong>Daily readings</strong><span>${family?'365 family reflections':'365 reflections · AA & ACOA'}</span><small>Read today ${icon('arrow')}</small></a>
      <a class="explore-tile write" href="#daily">${icon('write')}<strong>${family?'My daily reset':'My daily check-in'}</strong><span>Feelings, gratitude & one next step</span><small>Write or look back ${icon('arrow')}</small></a>
      <a class="explore-tile watch" href="#watch">${icon('watch')}<strong>Watch & listen</strong><span>${family?'Family talks & calming meditations':'20 recovery talks & meditations'}</span><small>Choose a video ${icon('arrow')}</small></a>
      <a class="explore-tile coffee" href="#places">${icon('coffee')}<strong>Find a coffee shop</strong><span>A public place to meet or take a break</span><small>Open the finder ${icon('arrow')}</small></a>
    </div></section>`;
  }
  function tabs(current) {
    return `<nav class="explore-day-tabs" aria-label="Daily pages"><a href="#reflection" ${current==='reflection'?'aria-current="page"':''}>${icon('read')}Read</a><a href="#daily" ${current==='daily'?'aria-current="page"':''}>${icon('write')}${family?'Daily reset':'Check-in'}</a><a href="#history" ${current==='history'?'aria-current="page"':''}>My saved days</a></nav>`;
  }
  function heading(label,title,copy) {
    return `<header class="explore-page-head"><a href="#home" class="explore-back">← Home</a><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1><p>${esc(copy)}</p></header>`;
  }
  function localISO(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function reading(dateISO) {
    const d = new Date(dateISO+'T12:00:00');
    const rawKey = dateISO.slice(5), key = rawKey==='02-29'?'02-28':rawKey;
    const item = readings[key], prev = new Date(d), next = new Date(d);
    prev.setDate(prev.getDate()-1); next.setDate(next.getDate()+1);
    const title = new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(d);
    let body = `<p class="explore-loading" role="status">${readingFailed?'The reading file could not be opened. Connect to the internet and reopen this page.':'Opening your daily reading…'}</p>`;
    if (item) body = `<article class="explore-reading"><p class="explore-reading-label">${family?'QSR family reflection':'Original QSR reflection · recovery & ACOA themes'}</p><h2>${esc(item.title||item.theme)}</h2>${item.quote?`<p class="explore-reading-quote">${esc(item.quote)}</p>`:''}<p>${esc(item.reflection)}</p><div class="explore-action"><h3>One thing for today</h3><p>${esc(item.action_step)}</p></div>${item.prompt?`<p class="explore-prompt"><strong>A question to sit with:</strong> ${esc(item.prompt)}</p>`:''}<a class="btn" href="#daily/${esc(dateISO)}">${family?'Open my daily reset':'Write in my check-in'}</a></article>`;
    const sources = family ? `<a class="explore-official" href="https://adultchildren.org/aca-daily-affirmation/" target="_blank" rel="noopener noreferrer"><strong>ACA / ACOA daily meditation</strong><span>Strengthening My Recovery · official ACA website ↗</span></a>` : `<a class="explore-official" href="https://www.aa.org/daily-reflections" target="_blank" rel="noopener noreferrer"><strong>AA Daily Reflections</strong><span>Read or listen on the official AA website ↗</span></a><a class="explore-official" href="https://adultchildren.org/aca-daily-affirmation/" target="_blank" rel="noopener noreferrer"><strong>ACA / ACOA daily meditation</strong><span>Strengthening My Recovery · official ACA website ↗</span></a>`;
    return `${heading('Daily readings',title,'A short reading, a moment to reflect, and one manageable action.')}${tabs('reflection')}<div class="explore-date-nav"><a href="#reflection/${localISO(prev)}" aria-label="Read the previous day">← Previous</a><label for="exploreReadingDate">Choose a day<input id="exploreReadingDate" type="date" value="${esc(dateISO)}"></label><a href="#reflection/${localISO(next)}" aria-label="Read the next day">Next →</a></div><a class="explore-today" href="#reflection">Back to today</a>${rawKey==='02-29'?'<p class="explore-note">Leap day uses the 28 February reflection.</p>':''}${body}<section class="explore-official-readings" aria-labelledby="officialReadingTitle"><h2 id="officialReadingTitle">Official recovery readings</h2>${sources}<p class="explore-note">The QSR reflection is original app content. AA and ACA literature opens on its publisher’s website and needs an internet connection.</p></section>`;
  }
  function resources() {
    return `${heading('Support & connection','Something useful, within reach.','Find a place, choose a reading or video, and reach people who can help.')}<div class="explore-link-grid"><a href="#places">${icon('coffee')}<strong>Coffee shop finder</strong><span>Cafés, libraries & public places</span></a><a href="#reflection">${icon('read')}<strong>Daily readings</strong><span>Original reflections & official reading links</span></a><a href="#watch">${icon('watch')}<strong>Watch & listen</strong><span>Recovery talks & calming videos</span></a><a href="#help">${icon('people')}<strong>Support now</strong><span>Urgent help & practical support tools</span></a><a href="#support">${icon('people')}<strong>My support map</strong><span>The safe people and groups in my life</span></a><a href="#connection">${icon('people')}<strong>Connection & isolation</strong><span>One small action to reach someone</span></a></div><section class="explore-official-readings"><h2>Find a meeting</h2><a class="explore-official" href="https://www.alcoholics-anonymous.org.uk/find-a-meeting/" target="_blank" rel="noopener noreferrer"><strong>AA meetings in Great Britain</strong><span>Official meeting finder ↗</span></a><a class="explore-official" href="https://adultchildren.org/meeting-search/" target="_blank" rel="noopener noreferrer"><strong>ACA / ACOA meetings</strong><span>Official online and local meeting directory ↗</span></a><a class="explore-official" href="https://smartrecovery.org.uk/meetings/" target="_blank" rel="noopener noreferrer"><strong>SMART Recovery meetings</strong><span>Official UK directory ↗</span></a></section>`;
  }
  function places() {
    return `${heading('Coffee shop finder','A place to pause. A place to connect.','Find a café or another staffed public place in Google Maps.')}<div class="explore-location"><label for="exploreTown">Town or postcode <span>(optional)</span></label><input id="exploreTown" type="search" autocomplete="off" maxlength="100" placeholder="For example, Weymouth"><p>Leave blank for “near me”. QSR does not request, receive or save your location.</p></div><div class="explore-place-grid">${[['coffee shops','coffee','Coffee shops','Meet someone or take a quiet break.'],['public libraries','read','Libraries','Somewhere public, usually with staff nearby.'],['community centres','people','Community centres','Look for local activities and public spaces.'],['cafes open now','coffee','Cafés open now','Check the opening hours and details in Maps.']].map(([query,glyph,title,copy])=>`<a class="explore-place" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(query+' near me')}" data-explore-place="${esc(query)}" target="_blank" rel="noopener noreferrer">${icon(glyph)}<div><h2>${title}</h2><p>${copy}</p><span>Open Google Maps ↗</span></div></a>`).join('')}</div><p class="explore-note">Maps may ask to use your location. Check the place, opening hours and route before travelling. QSR does not check venues or arrange meetings.</p>`;
  }
  function videoCards() {
    const items = videos.filter(v => (videoFilter==='all'||v.category===videoFilter) && `${v.title} ${v.creator} ${v.purpose}`.toLowerCase().includes(videoSearch.toLowerCase()));
    const result = `${items.length} video${items.length===1?'':'s'}`;
    return `<p class="explore-result-count" role="status">${result}</p>${!videos.length?`<p class="explore-loading">${videoFailed?'The video list could not be opened. Connect to the internet and reopen this page.':'Opening the video library…'}</p>`:!items.length?'<p class="explore-empty">No matching videos. Try a creator name or a shorter search.</p>':`<div class="explore-video-grid">${items.map(v=>`<article class="explore-video"><div class="explore-video-top">${icon(v.category==='calm'?'read':'watch')}<span>${esc(v.creator)}</span></div><h2>${esc(v.title)}</h2><p>${esc(v.purpose)}</p><a class="btn" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${esc(v.title)} on YouTube">Watch on YouTube ↗</a></article>`).join('')}</div>`}`;
  }
  function watch() {
    if (family) return `${heading('Watch & listen','Support for your side of the story.','Choose family-support talks or something calming to listen to.')}<div class="explore-link-grid"><a href="#talks">${icon('watch')}<strong>10 family-support talks</strong><span>Enabling, boundaries, CRAFT & connection</span></a><a href="#meditations">${icon('read')}<strong>10 calming meditations</strong><span>Grounding, sleep & detachment</span></a><a href="#partnerTalks">${icon('watch')}<strong>Partners & adult children</strong><span>10 talks about family patterns & relationships</span></a><a href="#partnerMeditations">${icon('read')}<strong>Calm for partners & adult children</strong><span>10 meditation topics for this part of life</span></a></div><p class="explore-note">These family resources open relevant YouTube search results so you can choose a video. YouTube needs an internet connection.</p>`;
    return `${heading('Watch & listen','20 videos. Choose what helps.','Gabor Maté, Father Martin’s Chalk Talks and Lavendaire.')}<div class="explore-media-controls"><label for="exploreVideoSearch">Find a video<input id="exploreVideoSearch" type="search" placeholder="Search a topic or creator" value="${esc(videoSearch)}"></label><div class="explore-filters" aria-label="Video categories">${[['all','All 20'],['talk','Recovery talks'],['calm','Calm & self-care']].map(([value,label])=>`<button type="button" data-explore-filter="${value}" aria-pressed="${videoFilter===value}">${label}</button>`).join('')}</div></div><div id="exploreVideoResults">${videoCards()}</div><p class="explore-note">Videos open directly in YouTube and need an internet connection. They share different perspectives and are not a substitute for professional support. If a meditation makes you feel worse, stop and use a simpler grounding tool.</p>`;
  }
  function toolIndex(items,limit=0) {
    items=items.filter((item,i)=>items.findIndex(other=>other[0]===item[0])===i);
    if(limit){const preferred=family?['#sos','#scripts','#decide','#reality','#brave','#enabling']:['#brave','#urges','#grounding','#feelings','#boundaries','#workbook'];const rank=href=>preferred.includes(href)?preferred.indexOf(href):999;items=[...items].sort((a,b)=>rank(a[0])-rank(b[0]));}
    return `<section class="explore-tool-finder"><label for="exploreToolSearch">Find a tool or workbook page<input id="exploreToolSearch" type="search" placeholder="Try cravings, boundaries or feelings"></label><p id="exploreToolCount" class="explore-result-count" role="status">${limit?'Search all '+items.length+' pages and tools':items.length+' pages and tools'}</p><div class="explore-tool-list" data-explore-limit="${limit}">${items.map(([href,title,copy],i)=>`<a href="${esc(href)}" class="explore-tool-item" data-explore-tool="${esc((title+' '+copy).toLowerCase())}" ${limit&&i>=limit?'hidden':''}><strong>${esc(title)}</strong><span>${esc(copy)}</span>${icon('arrow')}</a>`).join('')}</div><p id="exploreToolEmpty" class="explore-empty" hidden>No matching tools. Try a shorter word.</p></section>`;
  }
  function bind(root) {
    const date = root?.querySelector('#exploreReadingDate');
    date?.addEventListener('change', () => { if (/^\d{4}-\d{2}-\d{2}$/.test(date.value)) location.hash = '#reflection/'+date.value; });
    const town = root?.querySelector('#exploreTown');
    town?.addEventListener('input', () => { const place=town.value.trim(); root.querySelectorAll('[data-explore-place]').forEach(a => { a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a.dataset.explorePlace+(place?' in '+place:' near me')); }); });
    root?.querySelectorAll('[data-explore-filter]').forEach(button=>button.addEventListener('click',()=>{videoFilter=button.dataset.exploreFilter;root.querySelectorAll('[data-explore-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));root.querySelector('#exploreVideoResults').innerHTML=videoCards();}));
    root?.querySelector('#exploreVideoSearch')?.addEventListener('input', e=>{videoSearch=e.target.value;root.querySelector('#exploreVideoResults').innerHTML=videoCards();});
    root?.querySelector('#exploreToolSearch')?.addEventListener('input',e=>{const term=e.target.value.trim().toLowerCase(),limit=Number(root.querySelector('[data-explore-limit]').dataset.exploreLimit);let count=0;root.querySelectorAll('[data-explore-tool]').forEach((a,i)=>{const match=a.dataset.exploreTool.includes(term);if(match)count++;a.hidden=!match||(!term&&limit>0&&i>=limit);});root.querySelector('#exploreToolCount').textContent=term?`${count} matching pages and tools`:`Search all ${count} pages and tools`;root.querySelector('#exploreToolEmpty').hidden=count>0;});
  }
  window.QSRExplore = { configure, shortcuts, tabs, heading, resources, places, watch, reading, toolIndex, bind, icon };
})();
