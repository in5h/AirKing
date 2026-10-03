"""Writes the main navigation (with its dropdown menus) into every page.

Run from the repo root after changing the menu:  python3 tools/build_nav.py
The home page links to its own sections (#about); inner pages link to index.html#about.
"""
import re

SERVICES = [('design', 'Design &amp; Engineering'), ('installation', 'Installation'), ('commissioning', 'Commissioning'),
            ('control', 'Automation &amp; Control'), ('dust', 'Dust Handling'), ('upgrade', 'AC Plant Upgrade')]
EQUIPMENT = [
    ('div-automation', 'Automation &amp; Controls', [('panels', 'Electric Panels'), ('inverters', 'Inverters &amp; Automation System'), ('components', 'Electrical Components'), ('sensors', 'Temperature &amp; Humidity Sensors')]),
    ('div-washer', 'Air Washer', [('showering', 'Showering Area'), ('nozzles', 'Water Spray Nozzles'), ('eliminators', 'Eliminator Plates')]),
    ('div-airhandling', 'Air Handling', [('supply-fan', 'Supply &amp; Return Air Fan'), ('return-fan', 'Return Air Fan'), ('dampers', 'Air Control Dampers'), ('louvre', 'Weather Control Louvre')]),
    ('div-filtration', 'Filtration &amp; Dust Handling', [('rotary-filter', 'Rotary Air Filtration System'), ('dust', 'Dust Collection System')]),
]


def col(head_href, head, links):
    items = ''.join(f'\n              <a href="{h}">{t}</a>' for h, t in links)
    return f'''            <div class="dropdown-col">
              <a href="{head_href}" class="dropdown-head">{head}</a>{items}
            </div>'''


def dropdown(key, label, cols, ncols, sections=None):
    return f'''        <div class="dropdown" id="{key}Dropdown">
          <button class="nav-link dropdown-toggle" data-section="{sections or key}" aria-expanded="false" aria-controls="{key}Menu">
            {label} <span class="caret" aria-hidden="true"></span>
          </button>
          <div class="dropdown-menu cols-{ncols}" id="{key}Menu">
{chr(10).join(cols)}
          </div>
        </div>'''


def nav(p):  # p = '' on the home page, 'index.html' on inner pages
    svc = lambda s: f'service.html?s={s}'
    eq = lambda e: f'detail.html?eq={e}'
    services = dropdown('services', 'Services', [
        col(f'{p}#services', 'Project delivery', [(svc(s), t) for s, t in SERVICES[:3]]),
        col(f'{p}#services', 'Plant solutions', [(svc(s), t) for s, t in SERVICES[3:]]),
    ], 2)
    equipment = dropdown('equipment', 'Equipment', [col(f'{p}#{a}', h, [(eq(e), t) for e, t in items]) for a, h, items in EQUIPMENT], 4)
    control = dropdown('control', 'Control', [
        col(f'{p}#control', 'Tex-Auto system', [(f'{p}#control', 'System overview'), (f'{p}#control', 'Self-explanatory dashboard'), (f'{p}#results', 'Measured energy savings')]),
        col(f'{p}#div-automation', 'Control hardware', [(eq(e), t) for e, t in EQUIPMENT[0][2]]),
        col(f'{p}#services', 'Related services', [(svc('control'), 'Automation &amp; Control'), (svc('upgrade'), 'AC Plant Upgrade'), (svc('commissioning'), 'Commissioning')]),
    ], 3, sections='control results')
    ind = lambda i: f'detail.html?ind={i}'
    company = dropdown('company', 'Company', [
        col(f'{p}#about', 'About AirKing', [(f'{p}#about', 'Who we are'), (f'{p}#history', 'Our history'), (f'{p}#factory', 'Inside AirKing (factory)'), (f'{p}#team', 'Meet our team')]),
        col(f'{p}#industries', 'Industries', [(ind('spinning'), 'Spinning'), (ind('weaving'), 'Weaving'), (ind('synthetic-fibre'), 'Synthetic Fibre'), (ind('knitting'), 'Knitted Fabric'), (ind('nonwoven'), 'Non-woven Fabric'), (ind('other'), 'Other Industries')]),
        col(f'{p}#clients', 'References', [(f'{p}#clients', 'Key customers'), (f'{p}#why', 'Why AirKing?'), (f'{p}#contact', 'Contact us')]),
    ], 3, sections='company about history factory industries clients team why')
    return f'''<nav class="nav" id="nav" aria-label="Main">
        <span class="nav-bubble" id="navBubble" aria-hidden="true"></span>
{company}
{services}
{equipment}
{control}
        <a href="{p}#contact" class="nav-link nav-link-mobile">Contact</a>
      </nav>'''


for page, prefix in [('index.html', ''), ('service.html', 'index.html'), ('detail.html', 'index.html')]:
    html = open(page, encoding='utf-8').read()
    html, n = re.subn(r'<nav class="nav" id="nav".*?</nav>', lambda m: nav(prefix), html, count=1, flags=re.S)
    assert n == 1, page
    open(page, 'w', encoding='utf-8').write(html)
    print('nav updated:', page)
