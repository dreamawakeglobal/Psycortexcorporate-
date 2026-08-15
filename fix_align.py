import re

with open('services.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        "Service 01",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Evaluación confidencial del empleado</li>
              <li>Terapia enfocada en soluciones breves</li>
              <li>Desarrollo de estrategias de afrontamiento</li>
              <li>Seguimiento de progreso</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Evaluación confidencial del empleado</li>
              <li>Terapia enfocada en soluciones breves</li>
              <li>Estrategias de afrontamiento y seguimiento</li>
            </ul>
          </div>"""
    ),
    (
        "Service 03",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Análisis de necesidades formativas</li>
              <li>Diseño de talleres interactivos</li>
              <li>Facilitación por expertos clínicos</li>
              <li>Evaluación de aprendizaje</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Diseño de talleres interactivos</li>
              <li>Facilitación por expertos clínicos</li>
              <li>Evaluación de aprendizaje continuo</li>
            </ul>
          </div>"""
    ),
    (
        "Service 04",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Mapeo de estresores organizacionales</li>
              <li>Implementación de pausas activas mentales</li>
              <li>Capacitación en límites saludables</li>
              <li>Monitoreo de carga laboral</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Mapeo de estresores organizacionales</li>
              <li>Implementación de pausas activas mentales</li>
              <li>Capacitación en límites saludables</li>
            </ul>
          </div>"""
    ),
    (
        "Service 05",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Auditoría de estilos de liderazgo</li>
              <li>Coaching ejecutivo 1 a 1</li>
              <li>Simulaciones de manejo de personal</li>
              <li>Retroalimentación 360 continua</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Auditoría de estilos de liderazgo</li>
              <li>Coaching ejecutivo y simulaciones</li>
              <li>Retroalimentación 360 continua</li>
            </ul>
          </div>"""
    ),
    (
        "Service 06",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Encuestas de clima anonimizadas</li>
              <li>Entrevistas a grupos focales</li>
              <li>Análisis de datos psicosociales</li>
              <li>Presentación de mapa de riesgos</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Encuestas de clima y grupos focales</li>
              <li>Análisis profundo de datos psicosociales</li>
              <li>Presentación de mapa de riesgos</li>
            </ul>
          </div>"""
    ),
    (
        "Service 07",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Mediación estructurada de conflictos</li>
              <li>Rediseño de dinámicas de equipo</li>
              <li>Talleres de descompresión bajo presión</li>
              <li>Establecimiento de nuevos acuerdos</li>
            </ul>
          </div>""",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Mediación estructurada de conflictos</li>
              <li>Rediseño de dinámicas de equipo</li>
              <li>Talleres de descompresión bajo presión</li>
            </ul>
          </div>"""
    )
]

for service_name, old_block, new_block in replacements:
    if old_block in content:
        content = content.replace(old_block, new_block)
    else:
        print(f"Could not find old block for {service_name}")

with open('services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done aligning lists.")
