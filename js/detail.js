// Detail pages for equipment (detail.html?eq=...) and industries (detail.html?ind=...).
// Edit the text for each item in EQUIPMENT / INDUSTRIES below.
(function () {
  const DIVISIONS = {
    automation: { name: 'Automation & Controls', anchor: 'div-automation', interest: 'controls' },
    washer: { name: 'Air Washer', anchor: 'div-washer', interest: 'washer' },
    airhandling: { name: 'Air Distribution', anchor: 'div-airhandling', interest: 'fans' },
    filtration: { name: 'Filtration & Dust Handling', anchor: 'div-filtration', interest: 'filtration' },
  };
  const SERVICES = {
    design: 'Design & Engineering', installation: 'Installation', commissioning: 'Commissioning',
    control: 'Automation & Control', dust: 'Dust Handling', upgrade: 'AC Plant Upgrade',
  };

  // id = the card id on the home page without "eq-"; render = 3D image in assets/equipment/
  const EQUIPMENT = [
    {
      id: 'panels', div: 'automation', title: 'Electric Panels', render: 'electric-panels',
      tagline: 'Rittal-equivalent quality enclosures for every AirKing plant.',
      photos: [['electric-panels-1', 'Installed AirKing control panel line-up'], ['electric-panels-2', 'Panel interior: neatly wired DIN rails and components']],
      intro: [
        'Every AirKing plant is controlled from electric panels built to Rittal-equivalent quality. Rittal GmbH & Co. KG (Germany) is the world\'s largest maker of industrial electrical enclosures.',
        'Inside, the ABB inverters, the Beckhoff automation system and ABB or Schneider components are neatly wired on DIN rails, ready for the Tex-Auto control system.',
      ],
      points: ['Rittal-equivalent quality enclosures', 'House the ABB inverters and Beckhoff automation', 'ABB or Schneider electrical components', 'Indicator lamps, push buttons and HMI on the doors', 'Neat, labelled wiring for easy maintenance'],
      services: ['control', 'installation'],
    },
    {
      id: 'inverters', div: 'automation', title: 'Inverters & Automation System', render: 'inverters',
      tagline: 'ABB inverters with original Beckhoff (Germany) automation.',
      photos: [['inverters-1', 'ABB inverters (VFDs) installed in the panel'], ['inverters-2', 'Beckhoff (Germany) PLC and I/O modules']],
      intro: [
        'ABB inverters (variable frequency drives) run the fans and pumps at the speed the process actually needs instead of full speed all the time — one of the main sources of AirKing\'s energy savings.',
        'They are controlled by original Beckhoff automation from Germany, the platform behind the Tex-Auto AirKing Automation System.',
      ],
      points: ['ABB inverters on fans and pumps', 'Original Beckhoff (Germany) PLC and I/O modules', 'Speed follows the real demand, saving energy', 'Centralized reporting and monitoring', 'Developed for industrial use'],
      services: ['control', 'upgrade'],
    },
    {
      id: 'components', div: 'automation', title: 'Electrical Components', render: 'components',
      tagline: 'ABB or Schneider components for dependable, long-life panels.',
      photos: [['components-1', 'ABB / Schneider motor protection breakers'], ['components-2', 'Panel indicator lamps and wiring']],
      intro: [
        'The switchgear in AirKing panels — motor protection breakers, contactors and indicator lamps — comes from ABB or Schneider.',
        'Using these trusted brands keeps the plant reliable and spare parts easy to find.',
      ],
      points: ['ABB or Schneider switchgear', 'Motor protection for fans and pumps', 'Clearly labelled circuits', 'Widely available spare parts'],
      services: ['control', 'installation'],
    },
    {
      id: 'sensors', div: 'automation', title: 'Temperature & Humidity Sensors', render: 'sensors',
      tagline: 'Beckhoff (Germany) sensors that measure what the plant controls.',
      photos: [['sensors-1', 'Temperature sensor reading in a spinning hall'], ['sensors-2', 'Humidity sensor reading in a spinning hall']],
      intro: [
        'Temperature and humidity sensors from Beckhoff (Germany) give the Tex-Auto system accurate, real-time readings from the production halls.',
        'With precise measurements the plant can hold narrow tolerances for the best production conditions.',
      ],
      points: ['Beckhoff (Germany) temperature & humidity sensors', 'Real-time readings on the Tex-Auto dashboard', 'Temperature and humidity curves recorded', 'The basis of precise temperature & RH control'],
      services: ['control', 'commissioning'],
    },
    {
      id: 'showering', div: 'washer', title: 'Showering Area', render: 'showering-area',
      tagline: 'The heart of the air washer, built by AirKing.',
      photos: [['showering-area-1', 'Showering area by AirKing — risers and nozzles spraying'], ['showering-area-2', 'Showering area — spray headers in operation']],
      intro: [
        'In the showering area, rows of spray risers fill the air washer with a fine water spray. The air passing through is humidified and cooled before it goes to the production hall.',
      ],
      points: ['Built by AirKing', 'Vertical spray risers with AirKing nozzles', 'Even spray across the whole chamber', 'Humidification and evaporative cooling'],
      services: ['design', 'installation', 'upgrade'],
    },
    {
      id: 'nozzles', div: 'washer', title: 'Water Spray Nozzles', render: 'spray-nozzle',
      tagline: 'Water spray nozzles designed by AirKing.',
      photos: [['spray-nozzle-1', 'AirKing-designed water spray nozzle'], ['spray-nozzle-2', 'Nozzle parts with sealing ring'], ['spray-nozzle-3', 'Nozzle with mounting clip'], ['spray-nozzle-4', 'Nozzle — side view']],
      intro: [
        'AirKing designs its own water spray nozzles for an even, efficient spray pattern in the air washer.',
        'Each nozzle has a sealing ring and clips onto the spray risers.',
      ],
      points: ['Designed by AirKing', 'Even, efficient spray pattern', 'Sealing ring', 'Clip-on mounting on the risers'],
      services: ['installation', 'upgrade'],
    },
    {
      id: 'eliminators', div: 'washer', title: 'Eliminator Plates', render: 'eliminator-plates',
      tagline: 'Conditioned air goes to the hall — the water stays in the washer.',
      photos: [['eliminator-plates-1', 'Eliminator plates installed in an air washer'], ['eliminator-plates-2', 'Eliminator plate wall — close view']],
      intro: [
        'After the showering area, eliminator plates catch the water droplets so that only conditioned air — not water — reaches the production hall.',
      ],
      points: ['Separate water droplets from the conditioned air', 'Full-height plate walls', 'Installed at the end of the air washer', 'Keep the production hall dry'],
      services: ['installation', 'upgrade'],
    },
    {
      id: 'axial-fan', div: 'airhandling', title: 'Axial Fan', render: 'supply-return-fan',
      tagline: 'Energy-saving axial fans developed by AirKing, for supply and return air.',
      photos: [['supply-return-fan-1', 'AirKing energy-saving axial fan'], ['supply-return-fan-2', 'Energy-saving axial fan — rotor and nose cone'], ['return-air-fan-1', 'Axial fan installed in a plant wall'], ['return-air-fan-2', 'Axial fan with safety guard']],
      intro: [
        'In 2010 AirKing developed its new aerodynamic energy-saving fans. They move the large air volumes a textile mill needs while using less power.',
        'The same fans supply conditioned air to the production hall and bring return air back to the plant for filtering. Together with ABB inverters, the fan speed follows the real demand of the hall.',
      ],
      points: ['Energy-saving axial fan', 'Aerodynamic blades developed by AirKing (2010)', 'Used for supply air and return air', 'Speed control with ABB inverters'],
      services: ['design', 'upgrade', 'dust'],
    },
    {
      id: 'dampers', div: 'airhandling', title: 'Air Control Dampers', render: 'dampers',
      tagline: 'Dampers with auto drive motors, positioned by the control system.',
      photos: [['dampers-1', 'Air control damper'], ['dampers-2', 'Auto drive motor (actuator) mounted on a damper']],
      intro: [
        'Air control dampers set how much fresh and return air the plant uses. Each damper has an auto drive motor, so the Tex-Auto system can position it automatically.',
      ],
      points: ['Auto drive motor (actuator)', 'Positioned automatically by the control system', 'Mixes fresh and return air'],
      services: ['control', 'installation'],
    },
    {
      id: 'louvre', div: 'airhandling', title: 'Weather Control Louvre', render: 'weather-louvre',
      tagline: 'Fresh air in — rain and debris out.',
      photos: [['weather-louvre-1', 'Weather control louvres installed on a plant room'], ['weather-louvre-2', 'Louvre blades — close-up'], ['weather-louvre-3', 'Weather control louvre, full height']],
      intro: [
        'Weather control louvres are installed at the fresh-air intake of the plant room. Their angled blades let air in while keeping rain and debris out.',
      ],
      points: ['Angled weather blades', 'Keep rain and debris out of the plant', 'Full-height installations'],
      services: ['installation', 'design'],
    },
    {
      id: 'rotary-filter', div: 'filtration', title: 'Rotary Air Filtration System', render: 'rotary-filter',
      tagline: 'The LDF rotary air filter.',
      photos: [['rotary-filter-1', 'LDF rotary air filter — inside the drum'], ['rotary-filter-2', 'LDF rotary air filter drum and frame']],
      intro: [
        'The LDF rotary air filter is a large rotating drum covered with filter media. Return air passes through it and fibre and dust are caught continuously.',
        'The collected waste goes on to the dust collection system.',
      ],
      points: ['LDF rotary air filter', 'Continuous filtration of the return air', 'Large drum for big air volumes', 'Works with the dust collection system'],
      services: ['dust'],
    },
    {
      id: 'dust', div: 'filtration', title: 'Dust Collection System', render: 'dust-collection',
      tagline: 'Centralized collection, filtration and bailing.',
      photos: [['dust-collection-1', 'Dust collector'], ['dust-collection-2', 'Dust collector filter bags'], ['dust-collection-3', 'Dust collector fan with collection hopper'], ['dust-collection-4', 'Dust collector fan']],
      intro: [
        'The dust collection system gathers fibre and dust in one place. Dust collectors with filter bags separate the dust, and dust collector fans move the air.',
        'The waste can then be baled for easy removal.',
      ],
      points: ['Dust collector with filter bags', 'Dust collector fan', 'Centralized collection', 'Filtration and bailing'],
      services: ['dust'],
    },
  ];

  const INDUSTRIES = [
    { id: 'spinning', title: 'Spinning', icon: '🧵', tagline: 'Ring spinning, air-jet spinning, compact spinning and vortex spinning.' },
    { id: 'weaving', title: 'Weaving', icon: '🪡', tagline: 'Dual-dewpoint air supply for large and small weaving halls — yarn-dyed and raw white fabric.' },
    { id: 'synthetic-fibre', title: 'Synthetic Fibre', icon: '🧪', tagline: 'Constant airflow and cooling capacity for each process section to hold temperature steady.' },
    { id: 'knitting', title: 'Knitted Fabric', icon: '🧶', tagline: 'Air conditioning, refrigeration and direct-air-delivery systems for warp and weft knitting.' },
    { id: 'nonwoven', title: 'Non-woven Fabric', icon: '🧻', tagline: 'Air conditioning systems for non-woven fabric workshops across their various processes.' },
    { id: 'other', title: 'Other Industries', icon: '🏭', tagline: 'Medical dressings (preheating and analytical rooms), papermaking, fibre glass, tyre and cigarette factories.' },
  ];


  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const kind = params.has('ind') ? 'ind' : 'eq';
  const list = kind === 'eq' ? EQUIPMENT : INDUSTRIES;
  const OLD_IDS = { 'supply-fan': 'axial-fan', 'return-fan': 'axial-fan' };
  const want = params.get(kind);
  const idx = Math.max(0, list.findIndex(x => x.id === (OLD_IDS[want] || want)));
  const item = list[idx];
  const link = x => `detail.html?${kind}=${x.id}`;

  // shared bits of the layout
  const photos = kind === 'eq'
    ? [...item.photos.map(([f, c]) => [`assets/equipment/photos/${f}.jpg`, c]), [`assets/equipment/${item.render}.jpg`, '3D model']]
    : [[`assets/industries/${item.id}.jpg`, item.title]];

  document.title = `${item.title} | AirKing ${kind === 'eq' ? 'Equipment' : 'Industries'}`;
  document.querySelector('meta[name="description"]').setAttribute('content', `${item.title} — ${item.tagline}`);
  $('dCrumbSection').textContent = kind === 'eq' ? 'Equipment' : 'Industries';
  $('dCrumbSection').href = kind === 'eq' ? 'index.html#equipment' : 'index.html#industries';
  $('dCrumb').textContent = item.title;
  $('dBadge').innerHTML = kind === 'eq' ? `Equipment · <strong>${esc(DIVISIONS[item.div].name)}</strong>` : `Industry <strong>${String(idx + 1).padStart(2, '0')}</strong>`;
  $('dTitle').textContent = item.title;
  $('dTagline').textContent = item.tagline;

  // gallery (hero image opens the first photo)
  $('dGallery').dataset.gallery = item.title;
  $('dGallery').innerHTML = photos.map(([src, cap], i) => `
    <figure class="d-thumb${i === 0 ? ' active' : ''}">
      <button type="button" class="g-open" aria-label="View larger: ${esc(cap)}"><img src="${esc(src)}" alt="${esc(cap)}" loading="lazy"></button>
      <figcaption><strong>${esc(item.title)}</strong><span>${esc(cap)}</span></figcaption>
    </figure>`).join('');
  $('dPhotosWrap').hidden = photos.length < 2;
  $('dHeroImg').src = photos[0][0]; $('dHeroImg').alt = photos[0][1];
  $('dHeroOpen').addEventListener('click', () => $('dGallery').querySelector('.g-open').click());

  if (kind === 'eq') {
    $('dIntro').innerHTML = item.intro.map(p => `<p>${esc(p)}</p>`).join('');
    $('dPointsTitle').textContent = 'Key points';
    $('dPoints').innerHTML = item.points.map(p => `<li>${esc(p)}</li>`).join('');
    $('dServices').innerHTML = item.services.map(s => `<a class="chip-link" href="service.html?s=${s}">${esc(SERVICES[s])} →</a>`).join('');
    $('dAllTitle').textContent = DIVISIONS[item.div].name;
    const sameDiv = EQUIPMENT.filter(e => e.div === item.div);
    $('dAll').innerHTML = sameDiv.map(e => `<a href="${link(e)}" class="${e === item ? 'active' : ''}"${e === item ? ' aria-current="page"' : ''}>${esc(e.title)}</a>`).join('') +
      `<a href="index.html#${DIVISIONS[item.div].anchor}" class="all-link">All equipment →</a>`;
    const rel = [...sameDiv.filter(e => e !== item), ...EQUIPMENT.filter(e => e.div !== item.div && e.services.some(s => item.services.includes(s)))].slice(0, 4);
    $('dRelatedTitle').textContent = 'Related equipment';
    $('dRelated').innerHTML = rel.map(e => `<a class="card product rel-card" href="${link(e)}">
      <div class="product-img"><img src="assets/equipment/photos/${e.photos[0][0]}.jpg" alt="${esc(e.title)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(e.title)}</h3><span class="rel-more">View details →</span></div></a>`).join('');
  } else {
    $('dIntro').innerHTML = `<p>${esc(item.tagline)}</p><p>AirKing designs, supplies, installs and commissions complete air conditioning, automation and dust handling for ${esc(item.title.toLowerCase())} — and upgrades existing plants to save energy.</p>`;
    $('dPointsTitle').textContent = 'How we help';
    $('dPoints').innerHTML = ['Precision temperature & humidity control', 'Intelligent energy-saving automation (Tex-Auto, Beckhoff)', 'Return-air filtration and dust handling', 'Complete turnkey delivery — design to commissioning'].map(p => `<li>${esc(p)}</li>`).join('');
    $('dServices').innerHTML = Object.entries(SERVICES).map(([s, t]) => `<a class="chip-link" href="service.html?s=${s}">${esc(t)} →</a>`).join('');
    $('dAllTitle').textContent = 'All industries';
    $('dAll').innerHTML = INDUSTRIES.map(x => `<a href="${link(x)}" class="${x === item ? 'active' : ''}"${x === item ? ' aria-current="page"' : ''}>${esc(x.title)}</a>`).join('');
    $('dRelatedTitle').textContent = 'Equipment we use';
    const pick = ['showering', 'axial-fan', 'rotary-filter', 'inverters'];
    $('dRelated').innerHTML = pick.map(id => EQUIPMENT.find(e => e.id === id)).map(e => `<a class="card product rel-card" href="detail.html?eq=${e.id}">
      <div class="product-img"><img src="assets/equipment/photos/${e.photos[0][0]}.jpg" alt="${esc(e.title)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(e.title)}</h3><span class="rel-more">View details →</span></div></a>`).join('');
  }

  const prev = list[(idx + list.length - 1) % list.length], next = list[(idx + 1) % list.length];
  const noun = kind === 'eq' ? 'equipment' : 'industry';
  $('dPrev').href = link(prev); $('dPrevLabel').textContent = `← Previous ${noun}`; $('dPrevTitle').textContent = prev.title;
  $('dNext').href = link(next); $('dNextLabel').textContent = `Next ${noun} →`; $('dNextTitle').textContent = next.title;

  window.initPageChrome({ heroId: 'dHero', activeHref: kind === 'eq' ? 'index.html#equipment' : 'index.html#industries' });
})();
