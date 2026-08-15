import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove the services-grid wrapper
html = html.replace('<div class="services-grid">\n      <div class="section-head scroll-fade">', '<div class="section-head scroll-fade">')
html = html.replace('</a>\n    </div>\n    </div>\n  </div>\n</section>', '</a>\n    </div>\n  </div>\n</section>')

# 2. Add the 8th service
service_8 = """      <a href="services.html#service-08" style="text-decoration: none; color: inherit;" class="service-row scroll-fade">
        <span class="idx">08</span>
        <div>
          <h4>Estrategias de bienestar y diseño organizacional</h4>
          <p>Integración de principios psicológicos en el diseño de roles y estructuras organizativas para optimizar el rendimiento de los empleados.</p>
        </div>
        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>"""

html = html.replace('      </a>\n    </div>\n  </div>\n</section>', f'      </a>\n{service_8}\n    </div>\n  </div>\n</section>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")
