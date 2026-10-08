// Detail pages for equipment (detail.html?eq=...) and industries (detail.html?ind=...).
// Edit the text for each item in EQUIPMENT / INDUSTRIES below.
(function () {
  const DIVISIONS = {
    automation: { name: 'Automation & Controls', anchor: 'div-automation', interest: 'controls' },
    airhandling: { name: 'Air Distribution', anchor: 'div-airhandling', interest: 'fans' },
    filtration: { name: 'Filtration & Dust Handling', anchor: 'div-filtration', interest: 'filtration' },
    fire: { name: 'Fire Protection Systems', anchor: 'div-fire', interest: 'general' },
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
      photos: [['rainproof-louver-1', 'Rainproof louvers at a plant room air intake'], ['weather-louvre-1', 'Rainproof louvers installed on a plant room'], ['weather-louvre-2', 'Louver blades — close-up'], ['weather-louvre-3', 'Rainproof louver, full height']],
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
      photos: [['centrifugal-fan-1', 'Centrifugal fan with motor on a base frame'], ['centrifugal-fan-2', 'Backward-curved centrifugal fan impeller'], ['centrifugal-fan-3', 'Forward-curved centrifugal fan wheel']],
      intro: [
        'Centrifugal fans give the high suction pressure that dust collection needs. They draw fibre and dust from the rotary filters and move it through the ducting to the dust collectors.',
        'Air enters the centre of the fan wheel (impeller) and is thrown outwards by its blades, building up pressure. Backward-curved and forward-curved wheels suit different duties.',
      ],
      points: ['High suction pressure', 'Backward- or forward-curved impeller', 'Moves fibre and dust to the collectors', 'Works with the rotary air filter and dust collection system'],
      services: ['design', 'installation'],
    },
    {
      id: 'fire-protection', div: 'fire', title: 'Spark, Metal & Fire Protection System',
      tagline: 'Complete spark, metal & fire detection and suppression — building the anti-fire wall for the textile industry.',
      photos: [['xta3-install-4', 'AIRKING fire protection installed on a blow room line'], ['fire-protection-1', 'Metal & spark diverter with collection box'], ['asd119a3-install-1', 'Spark diverter installed between the cleaner and the carding']],
      intro: [
        'AIRKING spark, metal and fire protection systems guard every critical point of the blow room and carding line. They detect metal, sparks, embers and smoke, and divert or extinguish the hazard automatically.',
        'In milliseconds the system diverts the material or starts metal diverters, CO2 and dry-chemical or water-spray suppression, stops the production line and sounds local and central alarms. Your team is notified instantly through the AIRKING central control panel and mobile app.',
      ],
      points: [
        'Detects metal, sparks, embers and smoke at every critical point of the blow room and carding line',
        'Detects all metallic particles — ferrous and non-ferrous such as brass, stainless steel, copper and aluminium',
        'Highly sensitive to infrared radiation from fast-moving small sparks in pneumatic fibre transport',
        'Three infrared digital spark detectors — 360° detection without blind areas',
        'Large collection box with cotton level detection, air pressure detection and water spray extinguishing',
        'Intelligent identification of metal speed and mass — removal time calculated automatically to reduce material waste',
        'Works under both positive and negative air pressure',
        'Automatic compensation and digital filtering keep sensitivity stable without drift',
        'Full digital programming — RS485, network port, WiFi and Bluetooth',
      ],
      tables: [{ title: 'Product range', rows: [
        ['MDX02', 'Metal & Spark Diverter for pneumatic fibre transport'],
        ['ASD119A3', 'Spark Diverter with collection box and water spray'],
        ['ASD-119M2', 'Multi-route Spark Diverter — one host for up to 30 IR spark detectors'],
        ['ASD119AP', 'Fire Protection System for Bale Openers — water-mist jets beside the beater'],
        ['XTA3', 'Multi-mixer Fire Protection System with water spray and CO2'],
        ['AV20', 'Carbon Dioxide (CO2) Extinguishing System'],
        ['119DCS / 119WS', 'Automatic spark extinguishing — dry powder / water mist'],
        ['ASD119FD', 'Digital IR Spark Detector — response under 10 ms, IP65'],
        ['AMD2000Plus', 'Metal & Spark Diverter'],
        ['AMD3000Plus', 'Metal, Spark & Heavy Material Diverter'],
        ['TF-27A', 'Bridge Magnet — rare-earth magnet, ≥ 4500 Gauss'],
        ['FA001A', 'Pneumatic Distributor — one machine to two-line feeding'],
        ['MD20', 'Hand-held Metal Detector — detects Φ1.2 mm iron'],
        ['AIRKING IoT', 'Cloud platform — alarms by SMS, WeChat and app; remote control from computer or phone'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'mdx02', div: 'fire', title: 'MDX02 Metal & Spark Diverter',
      tagline: 'Removes metal and sparks from pneumatic fibre transport before they reach the next machine.',
      photos: [['fire-protection-1', 'MDX02 Metal & Spark Diverter with collection box'], ['mdx02-dimensions', 'MDX02 mounting dimensions (mm)']],
      intro: [
        'The MDX02 Metal and Spark Diverter is installed on the pipe of pneumatic transport systems for fibres or tufts. It detects metallic particles and sparks mixed into or generated in the production process.',
        'When metal or a spark is detected, the material is diverted into the collection box, the line is stopped and the alarm sounds. The MDX02-L has a taller 1825 mm collection box, and the MDX02(NF) is for lines where only metal detection is required.',
      ],
      points: ['Detects ferrous and non-ferrous metal', 'Infrared spark detection', 'Response time under 100 ms', 'Collection box 1225 mm (MDX02) or 1825 mm (MDX02-L)', 'For pipe heights of 3–4 m (MDX02) or 3.6–4.6 m (MDX02-L)', 'Pipe diameters Φ200, Φ300, Φ350 and Φ400 mm'],
      tables: [{ title: 'Technical data', rows: [
        ['Metal detection sensitivity', '≥ Φ2 mm iron ball, ≥ Φ4 mm aluminium ball'],
        ['Spark detection sensitivity', '≥ Φ0.5 mm spark, dark environment'],
        ['Response time', '< 100 ms'],
        ['Signal output', 'Relay output, contact capacity 5 A, 250 V~'],
        ['Communication interface', 'RS485, LAN'],
        ['Operating temperature & humidity', '-10 °C to +50 °C, ≤ 75% RH'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'amd2000plus', div: 'fire', title: 'AMD2000Plus Metal & Spark Diverter',
      tagline: 'Detects and removes metal and sparks to keep the blow room–carding line safe.',
      photos: [['amd2000plus-1', 'AMD2000Plus Metal & Spark Diverter'], ['amd2000plus-site', 'AMD2000Plus installation site in the blow room–carding line'], ['amd2000plus-interface', 'AMD2000Plus control interface']],
      intro: [
        'AMD2000Plus is installed on the pipe of pneumatic transport systems for fibres or tufts. It detects metallic particles and sparks mixed into or generated in the production process, keeping the blow room–carding line in spinning mills and other fibre processing lines safe.',
        'Its efficient exhaust mechanism gives the shortest response time and a short installation distance. If it is installed behind the fan, the positive-pressure configuration uses a floor-type cotton box.',
      ],
      points: ['Detects all metallic particles — ferrous and non-ferrous such as brass, stainless steel, copper and aluminium', 'Highly sensitive to infrared radiation from fast-moving small sparks', 'Fully shielded metal detector for electromagnetic shielding and easy installation', 'Water spray extinguishing in the collection box', 'Easy to install and commission', 'Works under positive or negative air pressure'],
      tables: [{ title: 'Technical data', rows: [
        ['Spark detection sensitivity', '≥ Φ0.5 mm spark, dark environment'],
        ['Metal detection sensitivity', '≥ Φ2.5 mm iron, ≥ Φ4 mm aluminium'],
        ['Signal output', 'Relay output, contact capacity 5 A, 250 V~'],
        ['Communication interface', 'RS485, LAN'],
        ['Operating temperature & humidity', '-10 °C to +50 °C, ≤ 75% RH (no condensation)'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'amd3000plus', div: 'fire', title: 'AMD3000Plus Metal, Spark & Heavy Material Diverter',
      tagline: 'Adds heavy material separation to metal and spark detection.',
      photos: [['amd3000plus-1', 'AMD3000Plus Metal, Spark & Heavy Material Diverter'], ['amd3000plus-install-1', 'AMD3000 installed between the cleaning and the carding']],
      intro: [
        'Based on the AMD2000, the AMD3000 Metal, Spark & Heavy Material Diverter adds the function of separating heavy material. It is installed between the cleaning and the carding.',
        'The older version has been upgraded with an all-metal detector, a carbon fibre flap and a water spray extinguishing system — the PLUS version is the most complete.',
      ],
      points: ['Metal, spark and heavy material detection', 'All-metal detector', 'Carbon fibre flap', 'Water spray extinguishing system', 'Touch screen and 3 spark detectors (PLUS version)'],
      tables: [{ title: 'AMD series', rows: [
        ['AMD3000 Metal, Spark & Heavy Material Diverter', 'Metal, spark and heavy material detection. PLUS: touch screen, all-metal detection, 3 spark detectors'],
        ['AMD2000 Metal & Spark Diverter', 'Metal and spark detection. PLUS: touch screen, all-metal detection, 3 spark detectors, heavy debris detection'],
        ['AMD1000 Metal Diverter', 'Metal detection. PLUS: touch screen, all-metal detection, 3 spark detectors'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'asd119a3', div: 'fire', title: 'ASD119A3 Spark Diverter',
      tagline: 'Detects and separates sparks in the blow room–carding line to eliminate fire hazards.',
      photos: [['asd119a3-install-1', 'ASD119A3 installed between the cleaner and the carding'], ['asd119a3-install-2', 'ASD119A3 installed on a multi-mixer']],
      intro: [
        'The ASD119A3 spark diverter is used in the blow room–carding process of the textile industry, and suits any pipeline that transports material by air. It detects and separates sparks mixed into or generated during production.',
        'When a spark is detected, the burning cotton flow is transferred to the collection box and the water spray extinguishing device starts. A double perforated plate makes sure sparks and embers do not reach the next process.',
      ],
      points: ['Highly sensitive to infrared radiation from fast-moving small sparks', 'A single spark or ember activates the diverter, stops machinery and sounds an alarm', 'Air pressure, water level and flap action detection, with spark self-test', 'Water spray extinguishing system', 'Works under positive or negative air pressure'],
      tables: [{ title: 'Technical data', rows: [
        ['Spark detection sensitivity', '≥ Φ0.5 mm spark, dark environment'],
        ['Response time', '< 120 ms'],
        ['Power', 'AC 100–250 V'],
        ['Signal output', 'Relay output, contact capacity 5 A, 250 V~'],
        ['Communication interface', 'RS485, LAN'],
        ['Operating temperature & humidity', '-10 °C to +50 °C, ≤ 75% RH'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'asd119m2', div: 'fire', title: 'ASD-119M2 Multi-route Spark Diverter',
      tagline: 'One host machine watches up to 30 spark detectors across your filtration and blow room lines.',
      photos: [['asd119m2-install-1', 'ASD-119M2 installed on a filtration system'], ['asd119m2-detector', 'Spark detector installed in the pipe of the filtration system'], ['asd119m2-119dcs', '119DCS automatic spark extinguishing system (dry powder)'], ['asd119m2-119ws', '119WS automatic spark extinguishing system (water based)'], ['asd119m2-zhf', 'ZHF-XXX fire stop valve'], ['asd119m2-blowdown', 'Rectangular flameless blowdown device']],
      intro: [
        'ASD-119M2 detects sparks in pneumatic transport systems for textile fibres. It is widely used for fire protection in blow room–carding lines, filtration systems and cotton gins.',
        'It is made up of the main (host) machine and 119M-SD spark detectors. ZHF-XXX flame-retarder valves (XXX = pipe diameter) and the 119DCS (dry powder) or 119WS (water mist) automatic spark extinguishing systems can be added as required.',
      ],
      points: ['One host connects up to 30 addressable IR spark detectors', '6 programmable output relays', 'Several dust filtration systems can share one host', 'A single spark or ember activates the host, stops machinery and sounds an alarm', 'Simple interface; stores 1,000 alarm records', 'UPS keeps it running 6–8 hours after a power cut', 'Two-wire power-line communication to detectors over long distances', 'RS-485 and LAN; optional WiFi and 4G for internet access'],
      tables: [{ title: 'Technical data', rows: [
        ['Spark detection sensitivity', '≥ Φ0.5 mm spark, dark environment'],
        ['Signal distance', '≤ 200 m'],
        ['Response time', '< 300 ms'],
        ['Power', 'AC 100–250 V'],
        ['Signal output', 'Contact capacity 5 A, 250 V~; 6 relay outputs'],
        ['Communication interface', 'RS485, LAN'],
        ['Operating temperature & humidity', '-10 °C to +60 °C, ≤ 75% RH'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'asd119fd', div: 'fire', title: 'ASD119FD Spark Detector',
      tagline: 'Full-digital infrared spark detector with high sensitivity and strong anti-interference.',
      photos: [['asd119fd-1', 'ASD119FD Spark Detector'], ['asd119fd-install-1', 'ASD119FD installed at the dust filter compactor'], ['asd119fd-2', 'Optical fibre detection head for hot or corrosive pipelines']],
      intro: [
        'ASD119FD uses an infrared sensor that detects the infrared frequency bands created by the hot gas produced when a substance burns. With signal amplification, digital filtering and an anti-interference algorithm, it detects fast-moving sparks larger than 0.5 mm in a dark environment.',
        'It is used where highly flammable substances are produced, stored and transported, and is especially sensitive to fast open fire with smokeless shielding. An optical fibre detection head can be fitted on pipelines with high temperature or corrosive gas.',
      ],
      points: ['Relay output and RS485 communication', 'High-performance MCU with professional signal processing', 'OLED screen and touch buttons, Chinese and English menus', 'Sensitivity adjustable from 1 to 99', 'Real-time clock records the time of each spark', 'Electrostatic filter and spark simulation self-test', 'Aluminium die-cast housing with magnetic base for easy installation'],
      tables: [{ title: 'Technical data', rows: [
        ['Operating voltage', 'DC 24 V'],
        ['Working current', 'Monitoring ≤ 30 mA, alarm ≤ 500 mA'],
        ['Detection range', '0.5 mm diameter spark, 1 m linear distance, dark environment'],
        ['Response time', 'Less than 10 ms'],
        ['Sensitivity level', '1–99% adjustable'],
        ['Signal output', 'Relay output, contact capacity 5 A, 250 V~'],
        ['Communication interface', 'RS485, Modbus-RTU'],
        ['Operating temperature & humidity', '-40 °C to +50 °C, ≤ 95% RH (no condensation)'],
        ['Shell material', 'Aluminium die-cast, anti-corrosion paint'],
        ['Shell protection level', 'IP65'],
        ['Electrical pipe interface', '2 × M16 × 1.5 mm'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'xta3', div: 'fire', title: 'XTA3 Multi-mixer Fire Protection System',
      tagline: 'Fire protection for the multi-mixer — the focus of fire prevention in the blowing–carding process.',
      photos: [['xta3-install-1', 'XTA3 installed on a multi-mixer line'], ['xta3-install-2', 'XTA3 control panel and alarm on the multi-mixer'], ['xta3-install-3', 'Detector connections along the multi-mixer'], ['xta3-install-4', 'AV20 CO2 extinguishing system with alarm beacon']],
      intro: [
        'With its large cotton storage, the multi-mixer is the focus of fire prevention in the blowing–carding process. Common causes of fire are stones, stray metal and wire in bales, loose metal from machines, electrical short circuits, friction and choking.',
        'XTA3 has three high-sensitivity digital infrared spark detectors with narrow-band filtering. Spark detectors SD1 and SD2 at the cotton inlet start the spark removal mechanism and water spray; SD3 activates the AV20 CO2 extinguishing system. AIRKING\'s digital automatic compensation keeps the sensors stable at different temperatures.',
      ],
      points: ['Three digital infrared spark detectors', 'Water spray and AV20 CO2 extinguishing', 'Machine stops with sound and light alarm when a spark is detected', 'CO sensor confirms the combustion situation', 'WiFi, Bluetooth and 4G for monitoring from mobile phones and remote terminals'],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'tf27a', div: 'fire', title: 'TF-27A Bridge Magnet',
      tagline: 'Strong magnets catch metal particles in the blow room–carding cotton flow.',
      photos: [['tf27a-1', 'TF-27A Bridge Magnet — design and installation']],
      intro: [
        'The TF-27A is used in the blow room–carding process to detect and divert metallic particles. As the cotton flow passes through, its speed changes and the strong magnetic pad inside catches the metal particles, which can be cleaned off regularly.',
      ],
      points: ['Rare-earth magnet, ≥ 4500 Gauss', 'Overall dimensions 720 × 509 × 540 mm', 'TF-27B stainless steel version available (option)'],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'fa001a', div: 'fire', title: 'FA001A Pneumatic Distributor',
      tagline: 'Feeds two lines from one machine.',
      photos: [['fa001a-1', 'FA001A Pneumatic Distributor']],
      intro: [
        'The FA001A Pneumatic Distributor is used for one machine to two-line feeding. An electrical control cabinet is optional.',
      ],
      points: ['One machine to two-line feeding', 'Pipe diameter Φ300 or Φ350 mm', 'Electrical control cabinet optional'],
      tables: [{ title: 'Technical data', rows: [
        ['Pipe diameter', 'Φ300, Φ350'],
        ['Handling air volume', '2000–6000 m³/h'],
        ['Compressed air pressure', '0.4–0.8 MPa'],
        ['Air consumption per action', 'About 0.08 dm³'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'md20', div: 'fire', title: 'MD20 Hand-held Metal Detector',
      tagline: 'Quickly finds broken needles and small metal pieces.',
      photos: [['md20-2', 'MD20 hand-held metal detector finding metal in removed cotton'], ['md20-1', 'MD20 in its case']],
      intro: [
        'The MD20 hand-held metal detector finds broken needles and small metal pieces in cotton, chemical fibre materials, clothes, bedding and more.',
        'It is used to quickly find the metal in the cotton removed by the metal detector.',
      ],
      points: ['Detects Φ1.2 mm iron', 'Compact 145 × 65 × 45 mm', '9 V battery with low-battery alarm'],
      tables: [{ title: 'Technical data', rows: [
        ['Sensitivity', 'Φ1.2 mm Fe'],
        ['Size', '145 × 65 × 45 mm'],
        ['Power supply', '9 V battery'],
        ['Working hours', 'Low battery alarm'],
      ] }],
      services: ['design', 'installation', 'commissioning'],
    },
    {
      id: 'iot', div: 'fire', title: 'AIRKING IoT Cloud Platform',
      tagline: 'Monitor and control your fire protection from any computer or phone.',
      photos: [['iot-platform-1', 'AIRKING IoT cloud platform — workshops, factory monitoring and remote terminals']],
      intro: [
        'The AIRKING IoT Cloud Platform connects smart products across your workshops. It supports both new AIRKING products and older versions of metal and spark diverters already in your spinning mill.',
        'The platform supports iOS and Android. Alarm information arrives by SMS, WeChat and the AIRKING IoT app, and the machines can be controlled remotely from a computer or mobile phone.',
      ],
      points: ['Works with new and older AIRKING diverters', 'iOS and Android', 'Alarms by SMS, WeChat and the AIRKING IoT app', 'Remote control from computer and mobile phone', 'Factory-wide monitoring and control across workshops'],
      services: ['design', 'installation', 'commissioning'],
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
    $('dTables').innerHTML = (item.tables || []).map(t => `<h2 class="svc-h2">${esc(t.title)}</h2>
      <table class="spec-table"><tbody>${t.rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`).join('');
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
