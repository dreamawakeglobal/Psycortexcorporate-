with open('packages.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Plata
old_plata = """        <!-- SILVER TIER -->
        <div class="package-card">
          <h3>Plata</h3>
          <p class="tier-desc">Alineación cognitiva fundamental y capacitación básica en resiliencia para equipos de liderazgo clave.</p>
          <ul class="package-features">
            <li>Sesión de alineación previa</li>
            <li>Mapeo de carga cognitiva de referencia</li>
            <li>2 Talleres de resiliencia ejecutiva</li>
            <li>Revisión de progreso mensual</li>
            <li>Conjunto de informes estándar</li>
          </ul>
          <a href="contact.html?package=silver" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

new_plata = """        <!-- SILVER TIER -->
        <div class="package-card">
          <h3>Plata</h3>
          <p class="tier-desc">Prevención de Burnout y Diagnóstico Inicial. Ideal para centros de contacto y operaciones de alto volumen.</p>
          <ul class="package-features">
            <li>Evaluación inicial de clima emocional</li>
            <li>2 Talleres de manejo del estrés y resiliencia</li>
            <li>Intervención preventiva grupal</li>
            <li>Informe básico de riesgos psicosociales</li>
          </ul>
          <a href="contact.html?package=silver" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

# Replace Elite
old_elite = """        <!-- ELITE TIER (Featured) -->
        <div class="package-card package-featured">
          <div class="eyebrow" style="margin-bottom:15px; justify-content:flex-start;"><div class="rule" style="background:var(--rose-soft);"></div><span style="color:var(--cream);">Recomendado</span></div>
          <h3>Élite</h3>
          <p class="tier-desc">El sistema operativo psicológico completo. Intervenciones sistémicas profundas para organizaciones en transición y de alto crecimiento.</p>
          <ul class="package-features">
            <li>Mapeo sistémico de carga cognitiva</li>
            <li>6 Talleres de resiliencia ejecutiva</li>
            <li>Retiro inmersivo de 2 días</li>
            <li>Apoyo de asesoría dedicado</li>
            <li>Diseño de intervención estructural avanzada</li>
          </ul>
          <a href="contact.html?package=elite" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

new_elite = """        <!-- ELITE TIER (Featured) -->
        <div class="package-card package-featured">
          <div class="eyebrow" style="margin-bottom:15px; justify-content:flex-start;"><div class="rule" style="background:var(--rose-soft);"></div><span style="color:var(--cream);">Recomendado</span></div>
          <h3>Élite</h3>
          <p class="tier-desc">Transformación Cultural y Desempeño Ejecutivo. Intervenciones sistémicas profundas para juntas directivas y operaciones regionales.</p>
          <ul class="package-features">
            <li>Diseño de intervención estructural a medida</li>
            <li>Retiro inmersivo de resiliencia directiva</li>
            <li>Coaching ejecutivo continuo para C-Level</li>
            <li>Acompañamiento en manejo de crisis organizacionales</li>
            <li>Asesoría dedicada 24/7</li>
          </ul>
          <a href="contact.html?package=elite" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

# Replace Gold
old_gold = """        <!-- GOLD TIER -->
        <div class="package-card">
          <h3>Oro</h3>
          <p class="tier-desc">Diagnósticos acelerados y talleres focalizados diseñados para resolver la fricción y mejorar el rendimiento sostenido.</p>
          <ul class="package-features">
            <li>Análisis completo de la red de comunicación</li>
            <li>Diagnóstico de aislamiento de puntos de fricción</li>
            <li>4 Talleres de resiliencia ejecutiva</li>
            <li>Capacitación en habilidades gerenciales</li>
            <li>Reuniones informativas ejecutivas trimestrales</li>
          </ul>
          <a href="contact.html?package=gold" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

new_gold = """        <!-- GOLD TIER -->
        <div class="package-card">
          <h3>Oro</h3>
          <p class="tier-desc">Desarrollo de Liderazgo y Retención de Talento. Diseñado para gerencias medias y equipos técnicos especializados.</p>
          <ul class="package-features">
            <li>Auditoría completa de carga cognitiva</li>
            <li>4 Talleres de liderazgo empático y comunicación</li>
            <li>Coaching individual para gerentes clave (hasta 3)</li>
            <li>Evaluaciones bimensuales de progreso</li>
          </ul>
          <a href="contact.html?package=gold" class="btn-primary" style="text-align:center; width:100%; display:block; padding:18px;">Solicitar precios</a>
        </div>"""

content = content.replace(old_plata, new_plata)
content = content.replace(old_elite, new_elite)
content = content.replace(old_gold, new_gold)

with open('packages.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated packages.html")
