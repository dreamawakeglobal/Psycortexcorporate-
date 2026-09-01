import re

with open('services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define unique process/results for each service
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Reducción del estrés individual</li>
              <li>Mejora en la toma de decisiones</li>
              <li>Reintegración efectiva al flujo de trabajo</li>
            </ul>
          </div>"""
    ),
    (
        "Service 02",
        """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Despliegue rápido de especialistas</li>
              <li>Contención emocional inmediata</li>
              <li>Manejo de la comunicación del incidente</li>
              <li>Apoyo post-crisis</li>
            </ul>
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Estabilización rápida del equipo</li>
              <li>Mitigación de trauma organizacional</li>
              <li>Retorno seguro a la operatividad</li>
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Equipos más cohesionados</li>
              <li>Comunicación interna fluida</li>
              <li>Cultura de liderazgo empático</li>
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Disminución drástica del burnout</li>
              <li>Mayor retención de talento clave</li>
              <li>Aumento de la energía colectiva</li>
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Líderes emocionalmente inteligentes</li>
              <li>Equipos de alto rendimiento alineados</li>
              <li>Reducción de fricciones gerenciales</li>
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Identificación temprana de riesgos</li>
              <li>Plan de acción basado en datos</li>
              <li>Cumplimiento de normativas laborales</li>
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
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Resolución de bloqueos operativos</li>
              <li>Restauración de la confianza grupal</li>
              <li>Sinergia renovada bajo alta presión</li>
            </ul>
          </div>"""
    )
]

# The original block to replace
original_block = """          <div class="glass-card">
            <h4>El Proceso</h4>
            <ul>
              <li>Evaluación diagnóstica</li>
              <li>Diseño de intervención focalizada</li>
              <li>Implementación estratégica</li>
              <li>Iteración continua</li>
            </ul>
          </div>
          <div class="glass-card">
            <h4>Resultados</h4>
            <ul>
              <li>Desempeño alto y sostenido</li>
              <li>Seguridad psicológica restaurada</li>
              <li>Mayor resiliencia organizacional</li>
            </ul>
          </div>"""

# Find each service section and replace its specific block
for i in range(1, 8):
    section_id = f'id="service-0{i}"'
    # Find the start of the section
    start_idx = content.find(section_id)
    if start_idx == -1:
        print(f"Could not find {section_id}")
        continue
    
    # Find the original block within this section (up to the next section)
    next_section_idx = content.find('id="service-0', start_idx + 20)
    if next_section_idx == -1:
        next_section_idx = len(content)
        
    section_content = content[start_idx:next_section_idx]
    
    if original_block in section_content:
        new_section_content = section_content.replace(original_block, replacements[i-1][1])
        content = content[:start_idx] + new_section_content + content[next_section_idx:]
    else:
        print(f"Could not find original block in {section_id}")

with open('services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating services.")
