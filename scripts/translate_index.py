import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    '<title>Psycortex — Better Minds. Better Performance.</title>': '<title>Psycortex — Mejores mentes. Mejor desempeño.</title>',
    '<li><a href="index.html">Home</a></li>': '<li><a href="index.html">Inicio</a></li>',
    '<li><a href="about.html">About</a></li>': '<li><a href="about.html">Nosotros</a></li>',
    '<li><a href="services.html">Services</a></li>': '<li><a href="services.html">Servicios</a></li>',
    '<li><a href="packages.html">Packages</a></li>': '<li><a href="packages.html">Paquetes</a></li>',
    '<li><a href="contact.html" class="nav-cta">Contact</a></li>': '<li><a href="contact.html" class="nav-cta">Contacto</a></li>',
    
    '<span>THE FOUNDER</span>': '<span>LA FUNDADORA</span>',
    '<h2>The difference between a functional organization and a high-performing one isn\'t driven by strategy alone. It\'s also defined by the mental well-being of its people, the quality of its leadership, and the <em>emotional resilience</em> of its teams.</h2>': '<h2>La diferencia entre una organización funcional y una de alto rendimiento no está impulsada únicamente por la estrategia. También está definida por el bienestar mental de su gente, la calidad de su liderazgo y la <em>resiliencia emocional</em> de sus equipos.</h2>',
    '<p>Alba Cortez, a clinical and organizational psychologist, founded Psycortex Corporate Mental Health with a clear vision: to place psychology at the center of business strategy.</p>': '<p>Alba Cortez, psicóloga clínica y organizacional, fundó Psycortex Corporate Mental Health con una visión clara: colocar la psicología en el centro de la estrategia empresarial.</p>',
    '<p>Drawing on her experience working with high-demand corporate environments, she has supported organizations through workplace stress, emotional crises, burnout, internal conflict, leadership under pressure, and workforce fatigue.</p>': '<p>Basándose en su experiencia trabajando con entornos corporativos de alta exigencia, ha apoyado a organizaciones a través del estrés laboral, crisis emocionales, agotamiento, conflictos internos, liderazgo bajo presión y fatiga de la fuerza laboral.</p>',
    '<p>Psycortex was created to address a critical need: organizations striving for stronger business outcomes while recognizing that sustainable performance requires clinical expertise, human-centered solutions, and strategic frameworks that support the people behind those results.</p>': '<p>Psycortex fue creado para abordar una necesidad crítica: organizaciones que se esfuerzan por obtener resultados empresariales más sólidos al tiempo que reconocen que el desempeño sostenible requiere experiencia clínica, soluciones centradas en el ser humano y marcos estratégicos que respalden a las personas detrás de esos resultados.</p>',
    
    '<span class="cred-label">Professional Profile</span>': '<span class="cred-label">Perfil profesional</span>',
    '<span class="cred-value">Clinical & Organizational Psychologist</span>': '<span class="cred-value">Psicóloga clínica y organizacional</span>',
    '<span class="cred-label">Education</span>': '<span class="cred-label">Educación</span>',
    '<span class="cred-value">Bachelor\'s Degree in Psychology<span class="degree-divider"></span>Master\'s in Clinical and Health Psychology (In Progress)</span>': '<span class="cred-value">Licenciatura en Psicología<span class="degree-divider"></span>Maestría en Psicología Clínica y de la Salud (En curso)</span>',
    '<span class="cred-label">Specialization</span>': '<span class="cred-label">Especialización</span>',
    '<span class="cred-value">Corporate mental health, crisis intervention, workplace stress, burnout, leadership development, and organizational behavior.</span>': '<span class="cred-value">Salud mental corporativa, intervención en crisis, estrés laboral, agotamiento, desarrollo de liderazgo y comportamiento organizacional.</span>',
    '<span class="cred-label">Areas of Focus</span>': '<span class="cred-label">Áreas de enfoque</span>',
    '<span class="cred-value">Sustainable performance, organizational resilience, emotional well-being, effective communication, and the prevention of psychosocial risks.</span>': '<span class="cred-value">Desempeño sostenible, resiliencia organizacional, bienestar emocional, comunicación efectiva y prevención de riesgos psicosociales.</span>',
    
    '<span>What We Do</span>': '<span>Qué hacemos</span>',
    '<h2>What does Psycortex do?</h2>': '<h2>¿Qué hace Psycortex?</h2>',
    '<p>Psycortex helps companies identify, prevent, and intervene in the psychological factors that affect performance, culture, and talent stability.<br><br>Our services integrate clinical psychology, organizational behavior, and corporate well-being strategies to support leaders and employees in high-pressure environments.</p>': '<p>Psycortex ayuda a las empresas a identificar, prevenir e intervenir en los factores psicológicos que afectan el desempeño, la cultura y la estabilidad del talento.<br><br>Nuestros servicios integran psicología clínica, comportamiento organizacional y estrategias de bienestar corporativo para apoyar a líderes y empleados en entornos de alta presión.</p>',
    '<h4>Individual corporate psychological support</h4>': '<h4>Apoyo psicológico corporativo individual</h4>',
    '<h4>Emotional crisis intervention and high-risk case management</h4>': '<h4>Intervención en crisis emocionales y manejo de casos de alto riesgo</h4>',
    '<h4>Mental health, leadership, and communication workshops</h4>': '<h4>Talleres de salud mental, liderazgo y comunicación</h4>',
    '<h4>Burnout and workplace stress prevention programs</h4>': '<h4>Programas de prevención del agotamiento y estrés laboral</h4>',
    '<h4>Leadership and executive resilience labs</h4>': '<h4>Laboratorios de resiliencia ejecutiva y liderazgo</h4>',
    '<h4>Emotional climate and psychosocial risk assessments</h4>': '<h4>Evaluaciones de clima emocional y riesgos psicosociales</h4>',
    '<h4>Support for teams facing conflict or operational pressure</h4>': '<h4>Apoyo para equipos que enfrentan conflictos o presión operativa</h4>',
    
    '<span>Why Psycortex</span>': '<span>Por qué Psycortex</span>',
    '<h2>Performance built on <em>psychological</em> ground, not pressure.</h2>': '<h2>Desempeño basado en fundamentos <em>psicológicos</em>, no en presión.</h2>',
    '<p>Most performance consulting treats the mind as a variable to manage. We treat it as the infrastructure to design.</p>': '<p>La mayoría de la consultoría de desempeño trata la mente como una variable a gestionar. Nosotros la tratamos como la infraestructura a diseñar.</p>',
    '<h3>Evidence Over Instinct</h3>': '<h3>Evidencia sobre el instinto</h3>',
    '<p>Every engagement begins with diagnostic assessment — validated psychometrics, structured interviews, and behavioral data — before a single recommendation is made.</p>': '<p>Cada intervención comienza con una evaluación diagnóstica (psicometría validada, entrevistas estructuradas y datos conductuales) antes de hacer una sola recomendación.</p>',
    '<h3>Systems, Not Symptoms</h3>': '<h3>Sistemas, no síntomas</h3>',
    '<p>Burnout, conflict, and disengagement are usually downstream of structural conditions. We work at the level of team design, incentives, and culture — where change holds.</p>': '<p>El agotamiento, el conflicto y la falta de compromiso suelen ser consecuencia de condiciones estructurales. Trabajamos a nivel del diseño de equipos, incentivos y cultura, donde el cambio realmente perdura.</p>',
    '<h3>Discretion as Standard</h3>': '<h3>Discreción como estándar</h3>',
    '<p>Leadership psychology requires trust. Engagements are confidential by default, with reporting structures built around what your organization actually needs to know.</p>': '<p>La psicología del liderazgo requiere confianza. Las intervenciones son confidenciales por defecto, con estructuras de informes construidas en torno a lo que su organización realmente necesita saber.</p>',
    '<h3>Measurable ROI</h3>': '<h3>Retorno de inversión (ROI) medible</h3>',
    '<p>Various business studies have shown that workplace mental health programs can generate a return of approximately $4 to $5 for every $1 invested, thanks to reductions in absenteeism, turnover, burnout, and lost productivity.</p>': '<p>Diversos estudios han demostrado que los programas de salud mental en el trabajo pueden generar un retorno de aproximadamente $4 a $5 por cada $1 invertido, gracias a reducciones en ausentismo, rotación, agotamiento y pérdida de productividad.</p>',
    
    '<h2>Let\'s discuss what\'s actually <em>limiting</em> your team\'s performance.</h2>': '<h2>Hablemos sobre lo que realmente está <em>limitando</em> el desempeño de su equipo.</h2>',
    '<p>A first consultation is a conversation, not a sales call. We\'ll talk through where things stand and whether this is the right fit.</p>': '<p>Una primera consulta es una conversación, no una llamada de ventas. Hablaremos sobre la situación actual y evaluaremos si somos la opción adecuada.</p>',
    '<a href="contact.html" class="btn-primary light">Schedule a Consultation</a>': '<a href="contact.html" class="btn-primary light">Programe una consulta</a>',
    
    '<p>Psychological performance consulting for organizations who treat the mind as infrastructure, not an afterthought.</p>': '<p>Consultoría de desempeño psicológico para organizaciones que tratan la mente como infraestructura, no como una idea de último momento.</p>',
    '<h5>Site</h5>': '<h5>Sitio</h5>',
    '<h5>Contact</h5>': '<h5>Contacto</h5>',
    '<h5>Connect</h5>': '<h5>Conectar</h5>',
    '<a href="index.html">Home</a>': '<a href="index.html">Inicio</a>',
    '<a href="about.html">About</a>': '<a href="about.html">Nosotros</a>',
    '<a href="services.html">Services</a>': '<a href="services.html">Servicios</a>',
    '<a href="packages.html">Packages</a>': '<a href="packages.html">Paquetes</a>',
    '<a href="contact.html">Contact Form</a>': '<a href="contact.html">Formulario de contacto</a>',
    '<span>© 2026 Psycortex. All rights reserved.</span>': '<span>© 2026 Psycortex. Todos los derechos reservados.</span>',
    '<span>Better Minds. Better Performance.</span>': '<span>Mejores mentes. Mejor desempeño.</span>'
}

for k, v in replacements.items():
    if k not in html:
        print(f"Key not found: {k}")
    html = html.replace(k, v)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
