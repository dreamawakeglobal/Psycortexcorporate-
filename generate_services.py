html_template = """<!-- ============ SERVICE {num_str} ============ -->
<section id="service-{num_str}" class="service-detail-section"{bg_style}>
  <div class="wrap">
    <div class="service-detail-grid scroll-fade">
      <div>
        <span class="num">{num_str}</span>
        <h2>{title}</h2>
        <img src="assets/img/{icon}" alt="Service Icon" class="service-icon"{img_style}>
      </div>
      <div>
        <p class="lead">{lead}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <div class="glass-card">
            <h4>The Process</h4>
            <ul>
              <li>Diagnostic Assessment</li>
              <li>Targeted Intervention Design</li>
              <li>Strategic Implementation</li>
              <li>Continuous Iteration</li>
            </ul>
          </div>
          <div class="glass-card">
            <h4>Outcomes</h4>
            <ul>
              <li>Sustained high performance</li>
              <li>Restored psychological safety</li>
              <li>Increased organizational resilience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
"""

services = [
    {
        "title": "Individual corporate psychological support",
        "lead": "Targeted, confidential support designed specifically for leaders and employees navigating intense corporate environments and high-stakes pressure.",
        "icon": "brain-icon.png",
        "img_style": ""
    },
    {
        "title": "Emotional crisis intervention and high-risk case management",
        "lead": "Immediate, structured intervention to stabilize teams and individuals during acute psychological distress or organizational crises.",
        "icon": "crisis-icon.png",
        "img_style": ' style="width: 140px; margin-top: -70px;"'
    },
    {
        "title": "Mental health, leadership, and communication workshops",
        "lead": "Interactive, science-backed sessions that equip teams with the cognitive tools required to communicate effectively and lead under pressure.",
        "icon": "diagnostic-icon.png",
        "img_style": ' style="transform: translateX(15px);"'
    },
    {
        "title": "Burnout and workplace stress prevention programs",
        "lead": "Systemic protocols to identify friction points and inoculate your organization against widespread burnout and operational fatigue.",
        "icon": "resilience-icon.png",
        "img_style": ""
    },
    {
        "title": "Leadership and executive resilience labs",
        "lead": "Immersive development spaces for executives to build sustainable performance habits and emotional resilience.",
        "icon": "brain-icon.png",
        "img_style": ""
    },
    {
        "title": "Emotional climate and psychosocial risk assessments",
        "lead": "Data-driven diagnostics to uncover latent cultural blind spots, psychological safety issues, and systemic risk factors within the organization.",
        "icon": "diagnostic-icon.png",
        "img_style": ' style="transform: translateX(15px);"'
    },
    {
        "title": "Support for teams facing conflict or operational pressure",
        "lead": "Facilitated alignment and intervention for teams experiencing interpersonal friction or overwhelming operational demands.",
        "icon": "crisis-icon.png",
        "img_style": ' style="width: 140px; margin-top: -70px;"'
    }
]

import re

with open("services.html", "r") as f:
    content = f.read()

# The services start right after <!-- ============ HEADER ============ --> section which ends at </section> around line 130
# and end before <!-- ============ FOOTER ============ -->
start_marker = "<!-- ============ SERVICE 01 ============ -->"
end_marker = "<!-- ============ FOOTER ============ -->"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_sections = ""
    for i, s in enumerate(services):
        num_str = f"{i+1:02d}"
        bg_style = ' style="background: var(--cream-deep);"' if i % 2 == 0 else ''
        new_sections += html_template.format(
            num_str=num_str,
            bg_style=bg_style,
            title=s["title"],
            icon=s["icon"],
            img_style=s["img_style"],
            lead=s["lead"]
        ) + "\n"
    
    new_content = content[:start_idx] + new_sections + content[end_idx:]
    with open("services.html", "w") as f:
        f.write(new_content)
    print("Updated services.html successfully.")
else:
    print("Could not find markers.")

