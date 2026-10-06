// Service detail page: content for each service + the page's nav behaviour.
(function () {
  const SERVICES = [
    {
      slug: 'design', title: 'New HVAC Plant', img: 'assets/services/design.jpg', interest: 'plant',
      tagline: 'A complete new HVAC plant for your mill, designed and built by one team.',
      intro: [
        'We design and build complete new HVAC plants around your mill — its production process, machine heat load, local climate and the room conditions your yarn or fabric needs.',
        'The result is a plant sized correctly from day one: not oversized and wasting power, not undersized and losing control in peak season.',
      ],
      includes: [
        'Site survey of production halls and existing systems',
        'Heat-load and air-volume calculation',
        'Air washer and fan sizing',
        'Supply and return air ducting design',
        'Return-air filtration and dust handling layout',
        'Electrical and control system design',
        'Layout drawings and equipment schedule',
      ],
      steps: [
        ['Survey', 'We study your halls, machines and current plant on site.'],
        ['Calculate', 'Heat load, air volumes and target temperature & RH.'],
        ['Design', 'Plant, ducting, filtration and controls engineered together.'],
        ['Review', 'Drawings and proposal reviewed with your team.'],
      ],
      stats: [['30', 'years of textile AC'], ['1996', 'designing since'], ['10+', 'export countries']],
      related: ['eq-showering', 'eq-axial-fan', 'eq-rotary-filter', 'eq-panels'],
    },
    {
      slug: 'upgrade', title: 'HVAC Plant Upgrade', img: 'assets/services/upgrade.jpg', interest: 'upgrade',
      tagline: 'Measured savings of 60–67% in running power.',
      intro: [
        'Many mills run HVAC plants that use far more power than they need. AirKing modifies existing plants — fans, controls and air washers — to cut running power while improving temperature and RH stability.',
        'In peak season (Jun–Aug 2026) two modified plants in Pakistan dropped from 153.5 to 61.4 kWh and from 145.0 to 48.0 kWh of running power. Annual average savings are expected to be higher still.',
      ],
      includes: [
        'Energy audit of the existing plant',
        'New aerodynamic energy-saving fans',
        'Inverters on fans and pumps',
        'Tex-Auto automation retrofit',
        'Air washer and filtration improvements',
        'Measured before / after results',
      ],
      benefits: ['Reduced power consumption', 'Improved temperature & RH stability', 'Lower maintenance costs', 'Improved production environment',
        'Extended equipment life', 'Improved plant automation', 'Increased overall reliability'],
      steps: [
        ['Audit', 'Measure what the existing plant really uses.'],
        ['Propose', 'Upgrade plan with expected savings.'],
        ['Modify', 'Fans, inverters and controls upgraded.'],
        ['Prove', 'Energy analyzer data before and after.'],
      ],
      stats: [['60.2%', 'saving · Plant A (92 kWh)'], ['66.9%', 'saving · Plant B (97 kWh)'], ['Peak', 'season data, Jun–Aug 2026']],
      related: ['eq-axial-fan', 'eq-inverters', 'eq-sensors', 'eq-showering'],
    },
    {
      slug: 'control', title: 'Automation & Control', img: 'assets/services/control.jpg', interest: 'controls',
      tagline: 'Tex-Auto: precise conditions with the least possible energy.',
      intro: [
        'The Tex-Auto AirKing Automation System runs the plant automatically — adjusting fans, pumps and dampers to the outside conditions so the hall stays on target with the least possible energy.',
        'It is built on original Beckhoff (Germany) automation with ABB inverters, developed for industrial use, with narrow tolerances for the best production conditions.',
      ],
      includes: [
        'Beckhoff PLC and temperature & humidity sensors',
        'ABB inverters on fans and pumps',
        'ABB or Schneider electrical components',
        'Rittal-equivalent electric panels',
        'Central station with printer',
        'Self-explanatory dashboard: plant overview, process values, T & RH curves',
        'Alarm reporting, password protection, online manuals, maintenance information and reporting',
      ],
      steps: [
        ['Measure', 'Sensors read room and outside conditions continuously.'],
        ['Decide', 'Energy-saving logic picks the cheapest way to hit target.'],
        ['Act', 'Inverters, pumps and dampers adjust automatically.'],
        ['Report', 'Everything recorded, visualised and reported centrally.'],
      ],
      stats: [['2003', 'first automation system — No. 1 in China'], ['2018', 'national award for technological progress'], ['Beckhoff', 'original German automation']],
      related: ['eq-inverters', 'eq-sensors', 'eq-components', 'eq-panels'],
    },
    {
      slug: 'installation', title: 'Installation', img: 'assets/services/installation.jpg', interest: 'plant',
      tagline: 'One company responsible — from our factory to your production hall.',
      intro: [
        'AirKing supplies and installs the complete plant with its own teams: air washers, fans, ducting, filtration and electrical systems.',
        'Because the equipment comes from our own 25,000 m² factory, quality and delivery stay under one roof — and so does responsibility.',
      ],
      includes: [
        'Supply of all plant equipment from our own factory',
        'Air washer chamber, spray nozzles and eliminator plates',
        'Axial fans, dampers and louvres',
        'Ducting and air distribution',
        'Rotary filters and dust collection',
        'Electric panels, cabling and sensors',
        'Site supervision by AirKing engineers',
      ],
      steps: [
        ['Manufacture', 'Equipment built in our factory in Jiangsu, China.'],
        ['Deliver', 'Shipped to site and checked on arrival.'],
        ['Install', 'Mechanical and electrical installation by our teams.'],
        ['Hand over', 'Ready for commissioning and start-up.'],
      ],
      stats: [['25,000 m²', 'own factory'], ['150+', 'professional staff'], ['$45M+', 'annual output']],
      related: ['eq-showering', 'eq-eliminators', 'eq-dampers', 'eq-louvre'],
    },
    {
      slug: 'commissioning', title: 'Commissioning', img: 'assets/services/commissioning.jpg', interest: 'plant',
      tagline: 'Tuned until temperature and humidity hold steady in every hall.',
      intro: [
        'A plant is only as good as its tuning. Our engineers start up every system, balance the air flows and fine-tune the control loops.',
        'We stay until temperature and relative humidity hold steady in every hall — and your operators are confident running the plant.',
      ],
      includes: [
        'Pre-start checks of mechanical and electrical work',
        'Start-up of fans, pumps and dampers',
        'Air-flow balancing between halls',
        'Temperature & RH control-loop tuning',
        'Alarm and safety tests',
        'Operator training on the Tex-Auto dashboard',
        'Documentation and handover',
      ],
      steps: [
        ['Check', 'Every installation item verified before power-on.'],
        ['Start up', 'Systems started one by one under supervision.'],
        ['Balance & tune', 'Air flows balanced, control loops tuned.'],
        ['Train', 'Operators trained and the plant handed over.'],
      ],
      stats: [['T & RH', 'curves on the dashboard'], ['Alarm', 'reporting built in'], ['Online', 'manuals & maintenance info']],
      related: ['eq-sensors', 'eq-inverters', 'eq-panels', 'eq-dampers'],
    },
  ];

  // Equipment referenced by "related" (names/images match the home page cards)
  const EQUIPMENT = {
    'eq-panels': ['Electric Panels', 'electric-panels'],
    'eq-inverters': ['Inverters & Automation System', 'inverters'],
    'eq-components': ['Electrical Components', 'components'],
    'eq-sensors': ['Temperature & Humidity Sensors', 'sensors'],
    'eq-showering': ['Showering Area', 'showering-area'],
    'eq-nozzles': ['Water Spray Nozzles', 'spray-nozzle'],
    'eq-eliminators': ['Eliminator Plates', 'eliminator-plates'],
    'eq-axial-fan': ['Axial Fan', 'supply-return-fan'],
    'eq-dampers': ['Air Control Dampers', 'dampers'],
    'eq-louvre': ['Weather Control Louvre', 'weather-louvre'],
    'eq-rotary-filter': ['Rotary Air Filtration System', 'rotary-filter'],
    'eq-dust': ['Dust Collection System', 'dust-collection'],
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = id => document.getElementById(id);

  // ---------- render ----------
  const slug = new URLSearchParams(location.search).get('s');
  const OLD = { dust: 'design' };   // the Dust Handling page was removed
  const i = Math.max(0, SERVICES.findIndex(s => s.slug === (OLD[slug] || slug)));
  const svc = SERVICES[i];

  document.title = `${svc.title} | AirKing Services`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${svc.title} — ${svc.tagline}`);

  $('svcCrumb').textContent = svc.title;
  $('svcNum').textContent = String(i + 1).padStart(2, '0');
  $('svcTitle').textContent = svc.title;
  $('svcTagline').textContent = svc.tagline;
  $('svcImg').src = svc.img; $('svcImg').alt = svc.title;
  $('svcIntro').innerHTML = svc.intro.map(p => `<p>${esc(p)}</p>`).join('');
  $('svcIncludes').innerHTML = svc.includes.map(x => `<li>${esc(x)}</li>`).join('');
  $('svcSteps').innerHTML = svc.steps.map(([h, p], k) =>
    `<li class="step"><span class="step-num">${k + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
  $('svcStats').innerHTML = svc.stats.map(([v, l]) => `<div class="aside-stat"><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join('');
  if (svc.benefits) {
    $('svcBenefits').hidden = false;
    $('svcBenefitList').innerHTML = svc.benefits.map(b => `<li>${esc(b)}</li>`).join('');
  }
  $('svcRelated').innerHTML = svc.related.map(id => {
    const [name, file] = EQUIPMENT[id];
    return `<a class="card product rel-card" href="index.html#${id}">
      <div class="product-img"><img src="assets/equipment/${file}.jpg" alt="${esc(name)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(name)}</h3><span class="rel-more">View equipment →</span></div></a>`;
  }).join('');

  const prev = SERVICES[(i + SERVICES.length - 1) % SERVICES.length], next = SERVICES[(i + 1) % SERVICES.length];
  $('svcPrev').href = `service.html?s=${prev.slug}`; $('svcPrevTitle').textContent = prev.title;
  $('svcNext').href = `service.html?s=${next.slug}`; $('svcNextTitle').textContent = next.title;
  $('svcAll').innerHTML = SERVICES.map(s =>
    `<a href="service.html?s=${s.slug}" class="${s === svc ? 'active' : ''}"${s === svc ? ' aria-current="page"' : ''}>${esc(s.title)}</a>`).join('');

  window.initPageChrome({ heroId: 'svcHero', activeHref: 'index.html#services' });
})();
