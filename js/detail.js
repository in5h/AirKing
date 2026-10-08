// Detail pages for equipment (detail.html?eq=...) and industries (detail.html?ind=...).
// Edit the text for each item in EQUIPMENT / INDUSTRIES below.
(function () {
  const DIVISIONS = {
    automation: { name: 'Automation & Controls', anchor: 'div-automation', interest: 'controls' },
    airhandling: { name: 'Air Distribution', anchor: 'div-airhandling', interest: 'fans' },
    filtration: { name: 'Filtration & Dust Handling', anchor: 'div-filtration', interest: 'filtration' },
  };
  const SERVICES = {
    design: 'New HVAC Plant', upgrade: 'HVAC Plant Upgrade', control: 'Automation & Control Systems',
    installation: 'Installation Support', commissioning: 'Testing & Commissioning',
  };

  // id = the card id on the home page without "eq-"; photos are in assets/equipment/photos/
  const EQUIPMENT = [
    {
      id: 'panels', div: 'automation', title: 'Electric Panels',
      tagline: 'Rittal-equivalent quality enclosures for every AirKing plant.',
      photos: [['electric-panels-1', 'Installed AirKing control panel line-up'], ['electric-panels-2', 'Panel interior: neatly wired DIN rails and components']],
      intro: [
        'Every AirKing plant is controlled from electric panels built to Rittal-equivalent quality. Rittal GmbH & Co. KG (Germany) is the world\'s largest maker of industrial electrical enclosures.',
        'Inside, the ABB inverters, the Beckhoff automation system and ABB or Schneider components are neatly wired on DIN rails, ready for the AirKing automation & control system.',
      ],
      points: ['Rittal-equivalent quality enclosures', 'House the ABB inverters and Beckhoff automation', 'ABB or Schneider electrical components', 'Indicator lamps, push buttons and HMI on the doors', 'Neat, labelled wiring for easy maintenance'],
      services: ['control', 'installation'],
    },
    {
      id: 'inverters', div: 'automation', title: 'Inverters & Automation System',
      tagline: 'ABB inverters with original Beckhoff (Germany) automation.',
      photos: [['inverters-1', 'ABB inverters (VFDs) installed in the panel'], ['inverters-2', 'Beckhoff (Germany) PLC and I/O modules']],
      intro: [
        'ABB inverters (variable frequency drives) run the fans and pumps at the speed the process actually needs instead of full speed all the time — one of the main sources of AirKing\'s energy savings.',
        'They are controlled by original Beckhoff automation from Germany, the platform behind the AirKing Automation & Control System.',
      ],
      points: ['ABB inverters on fans and pumps', 'Original Beckhoff (Germany) PLC and I/O modules', 'Speed follows the real demand, saving energy', 'Centralized reporting and monitoring', 'Developed for industrial use'],
      services: ['control', 'upgrade'],
    },
    {
      id: 'components', div: 'automation', title: 'Electrical Components',
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
      id: 'sensors', div: 'automation', title: 'Temperature & Humidity Sensors',
      tagline: 'Beckhoff (Germany) sensors that measure what the plant controls.',
      photos: [['sensors-1', 'Temperature sensor reading in a spinning hall'], ['sensors-2', 'Humidity sensor reading in a spinning hall']],
      intro: [
        'Temperature and humidity sensors from Beckhoff (Germany) give the control system accurate, real-time readings from the production halls.',
        'With precise measurements the plant can hold narrow tolerances for the best production conditions.',
      ],
      points: ['Beckhoff (Germany) temperature & humidity sensors', 'Real-time readings on the control dashboard', 'Temperature and humidity curves recorded', 'The basis of precise temperature & RH control'],
      services: ['control', 'commissioning'],
    },
    {
      id: 'axial-fan', div: 'airhandling', title: 'Axial Fan',
      tagline: 'Energy-saving axial fans developed by AirKing, for supply and return air.',
      photos: [['axial-fan-1', 'AirKing energy-saving axial fan'], ['axial-fan-2', 'Axial fans installed in a plant room'], ['axial-fan-3', 'Axial fan with ABB motor'], ['axial-fan-4', 'Axial fans installed in the plant wall'], ['supply-return-fan-1', 'Axial fan with nose cone'], ['supply-return-fan-2', 'Energy-saving axial fan — rotor and nose cone'], ['return-air-fan-1', 'Axial fan installed in a plant wall'], ['return-air-fan-2', 'Axial fan with safety guard']],
      intro: [
        'In 2010 AirKing developed its new aerodynamic energy-saving fans. They move the large air volumes a textile mill needs while using less power.',
        'The same fans supply conditioned air to the production hall and bring return air back to the plant for filtering. Together with ABB inverters, the fan speed follows the real demand of the hall.',
      ],
      points: ['Energy-saving axial fan', 'Aerodynamic blades developed by AirKing (2010)', 'Used for supply air and return air', 'Speed control with ABB inverters'],
      services: ['design', 'upgrade'],
    },
    {
      id: 'air-washer', div: 'airhandling', title: 'Air Washer',
      tagline: 'Humidifies, cools and cleans the air before it reaches the production hall.',
      photos: [['air-washer-1', 'AirKing water spray nozzles in operation'], ['air-washer-2', 'Spray risers fitted with AirKing nozzles'], ['air-washer-3', 'Eliminator plates — close view'], ['air-washer-4', 'Air washer screen with access door'], ['air-washer-5', 'Air washer chamber during construction']],
      intro: [
        'The air washer is the heart of a textile HVAC plant. In the showering area, rows of spray risers fill the chamber with a fine water spray, so the air passing through is humidified and evaporatively cooled.',
        'AirKing designs its own water spray nozzles for an even, efficient spray pattern. At the end of the washer, eliminator plates catch the water droplets so that only conditioned air — not water — reaches the production hall.',
      ],
      points: ['Showering area built by AirKing', 'AirKing-designed water spray nozzles', 'Eliminator plates keep water out of the hall', 'Humidification and evaporative cooling'],
      services: ['design', 'installation', 'upgrade'],
    },
    {
      id: 'dampers', div: 'airhandling', title: 'Air Control Dampers',
      tagline: 'Dampers with auto drive motors, positioned by the control system.',
      photos: [['dampers-1', 'Air control damper'], ['dampers-2', 'Auto drive motor (actuator) mounted on a damper']],
      intro: [
        'Air control dampers set how much fresh and return air the plant uses. Each damper has an auto drive motor, so the control system can position it automatically.',
      ],
      points: ['Auto drive motor (actuator)', 'Positioned automatically by the control system', 'Mixes fresh and return air'],
      services: ['control', 'installation'],
    },
    {
      id: 'louvre', div: 'airhandling', title: 'Rainproof Louvers',
      tagline: 'Fresh air in — rain and debris out.',
      photos: [['weather-louvre-1', 'Rainproof louvers installed on a plant room'], ['weather-louvre-2', 'Louver blades — close-up'], ['weather-louvre-3', 'Rainproof louver, full height']],
      intro: [
        'Rainproof louvers are installed at the fresh-air intake of the plant room. Their angled blades let air in while keeping rain and debris out.',
      ],
      points: ['Angled weather blades', 'Keep rain and debris out of the plant', 'Full-height installations'],
      services: ['installation', 'design'],
    },
    {
      id: 'rotary-filter', div: 'filtration', title: 'Rotary Air Filter System',
      tagline: 'The LDF rotary air filter.',
      photos: [['rotary-filter-1', 'LDF rotary air filter — inside the drum'], ['rotary-filter-2', 'LDF rotary air filter drum and frame']],
      intro: [
        'The LDF rotary air filter is a large rotating drum covered with filter media. Return air passes through it and fibre and dust are caught continuously.',
        'The collected waste goes on to the dust collection system.',
      ],
      points: ['LDF rotary air filter', 'Continuous filtration of the return air', 'Large drum for big air volumes', 'Works with the dust collection system'],
      services: ['design', 'installation'],
    },
    {
      id: 'dust', div: 'filtration', title: 'Dust Collection System',
      tagline: 'Centralized collection, filtration and bailing.',
      photos: [['dust-collection-1', 'Dust collector'], ['dust-collection-2', 'Dust collector filter bags'], ['dust-collection-3', 'Dust collector fan with collection hopper'], ['dust-collection-4', 'Dust collector fan']],
      intro: [
        'The dust collection system gathers fibre and dust in one place. Dust collectors with filter bags separate the dust, and dust collector fans move the air.',
        'The waste can then be baled for easy removal.',
      ],
      points: ['Dust collector with filter bags', 'Dust collector fan', 'Centralized collection', 'Filtration and bailing'],
      services: ['design', 'installation'],
    },
    {
      id: 'centrifugal-fan', div: 'filtration', title: 'Centrifugal Fan',
      tagline: 'Strong suction for dust collection and waste transport.',
      photos: [['dust-collection-4', 'Centrifugal fan with scroll housing'], ['dust-collection-3', 'Centrifugal fan with dust collection hopper']],
      intro: [
        'Centrifugal fans give the high suction pressure that dust collection needs. They draw fibre and dust from the rotary filters and move it through the ducting to the dust collectors.',
        'The fan wheel turns inside a scroll housing, which builds up pressure and sends the air out at a right angle to the inlet.',
      ],
      points: ['High suction pressure', 'Scroll housing with side inlet', 'Moves fibre and dust to the collectors', 'Works with the rotary air filter and dust collection system'],
      services: ['design', 'installation'],
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
  const OLD_IDS = { 'supply-fan': 'axial-fan', 'return-fan': 'axial-fan', showering: 'air-washer', nozzles: 'air-washer', eliminators: 'air-washer' };
  const want = params.get(kind);
  const idx = Math.max(0, list.findIndex(x => x.id === (OLD_IDS[want] || want)));
  const item = list[idx];
  const link = x => `detail.html?${kind}=${x.id}`;

  // shared bits of the layout
  const photos = kind === 'eq'
    ? item.photos.map(([f, c]) => [`assets/equipment/photos/${f}.jpg`, c])
    : [[`assets/industries/${item.id}.jpg`, item.title]];

  document.title = `${item.title} | AirKing ${kind === 'eq' ? 'Products' : 'Industries'}`;
  document.querySelector('meta[name="description"]').setAttribute('content', `${item.title} — ${item.tagline}`);
  $('dCrumbSection').textContent = kind === 'eq' ? 'Products' : 'Industries';
  $('dCrumbSection').href = kind === 'eq' ? 'index.html#products' : 'index.html#industries';
  $('dCrumb').textContent = item.title;
  $('dBadge').innerHTML = kind === 'eq' ? `Product · <strong>${esc(DIVISIONS[item.div].name)}</strong>` : `Industry <strong>${String(idx + 1).padStart(2, '0')}</strong>`;
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
      `<a href="index.html#${DIVISIONS[item.div].anchor}" class="all-link">All products →</a>`;
    const rel = [...sameDiv.filter(e => e !== item), ...EQUIPMENT.filter(e => e.div !== item.div && e.services.some(s => item.services.includes(s)))].slice(0, 4);
    $('dRelatedTitle').textContent = 'Related products';
    $('dRelated').innerHTML = rel.map(e => `<a class="card product rel-card" href="${link(e)}">
      <div class="product-img"><img src="assets/equipment/photos/${e.photos[0][0]}.jpg" alt="${esc(e.title)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(e.title)}</h3><span class="rel-more">View details →</span></div></a>`).join('');
  } else {
    $('dIntro').innerHTML = `<p>${esc(item.tagline)}</p><p>AirKing designs, supplies, installs and commissions complete air conditioning, automation and dust handling for ${esc(item.title.toLowerCase())} — and upgrades existing plants to save energy.</p>`;
    $('dPointsTitle').textContent = 'How we help';
    $('dPoints').innerHTML = ['Precision temperature & humidity control', 'Intelligent energy-saving automation (Beckhoff, ABB)', 'Return-air filtration and dust handling', 'Complete turnkey delivery — design to commissioning'].map(p => `<li>${esc(p)}</li>`).join('');
    $('dServices').innerHTML = Object.entries(SERVICES).map(([s, t]) => `<a class="chip-link" href="service.html?s=${s}">${esc(t)} →</a>`).join('');
    $('dAllTitle').textContent = 'All industries';
    $('dAll').innerHTML = INDUSTRIES.map(x => `<a href="${link(x)}" class="${x === item ? 'active' : ''}"${x === item ? ' aria-current="page"' : ''}>${esc(x.title)}</a>`).join('');
    $('dRelatedTitle').textContent = 'Products we use';
    const pick = ['air-washer', 'axial-fan', 'rotary-filter', 'inverters'];
    $('dRelated').innerHTML = pick.map(id => EQUIPMENT.find(e => e.id === id)).map(e => `<a class="card product rel-card" href="detail.html?eq=${e.id}">
      <div class="product-img"><img src="assets/equipment/photos/${e.photos[0][0]}.jpg" alt="${esc(e.title)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(e.title)}</h3><span class="rel-more">View details →</span></div></a>`).join('');
  }

  const prev = list[(idx + list.length - 1) % list.length], next = list[(idx + 1) % list.length];
  const noun = kind === 'eq' ? 'product' : 'industry';
  $('dPrev').href = link(prev); $('dPrevLabel').textContent = `← Previous ${noun}`; $('dPrevTitle').textContent = prev.title;
  $('dNext').href = link(next); $('dNextLabel').textContent = `Next ${noun} →`; $('dNextTitle').textContent = next.title;

  window.initPageChrome({ heroId: 'dHero', activeHref: kind === 'eq' ? 'index.html#products' : 'index.html#industries' });
})();
