import re

with open('contact.html', 'r') as f:
    html = f.read()

# Replace the contact-page styles
html = re.sub(
    r'\.contact-page \{.*?\n\s*\}',
    '.contact-page {\n    padding: 160px 0 80px;\n    background: var(--cream-deep);\n    color: var(--ink);\n    min-height: 100vh;\n  }',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.contact-info h1 em \{ color: var\(--rose-soft\); font-style: italic; \}',
    '.contact-info h1 em { color: var(--rose); font-style: italic; }',
    html
)

html = re.sub(
    r'color: rgba\(243, 235, 226, 0\.7\);',
    'color: var(--ink-soft);',
    html
)

html = re.sub(
    r'\.contact-info a \{\n    color: var\(--cream\);\n    font-size: 20px;\n    text-decoration: none;\n    border-bottom: 1px solid rgba\(243, 235, 226, 0\.3\);',
    '.contact-info a {\n    color: var(--ink);\n    font-size: 20px;\n    text-decoration: none;\n    border-bottom: 1px solid rgba(14, 13, 12, 0.3);',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.contact-info a:hover \{\n    color: var\(--rose-soft\);\n    border-color: var\(--rose-soft\);\n  \}',
    '.contact-info a:hover {\n    color: var(--rose);\n    border-color: var(--rose);\n  }',
    html, flags=re.DOTALL
)

# Replace form-panel styles
html = re.sub(
    r'\.form-panel \{.*?\n\s*\}',
    '.form-panel {\n    background: rgba(255, 255, 255, 0.4);\n    backdrop-filter: blur(12px);\n    -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(14, 13, 12, 0.08);\n    border-radius: 20px;\n    padding: 50px;\n    position: relative;\n    overflow: hidden;\n  }',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-panel::before \{.*?\n\s*\}',
    '.form-panel::before {\n    display: none;\n  }',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-label \{\n    display: block;\n    font-size: 12px;\n    letter-spacing: 0\.12em;\n    text-transform: uppercase;\n    color: rgba\(243, 235, 226, 0\.8\);',
    '.form-label {\n    display: block;\n    font-size: 12px;\n    letter-spacing: 0.12em;\n    text-transform: uppercase;\n    color: var(--ink-soft);',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-control \{\n    width: 100%;\n    padding: 14px 16px;\n    background: rgba\(14, 13, 12, 0\.4\);\n    border: 1px solid rgba\(243, 235, 226, 0\.15\);\n    color: var\(--cream\);',
    '.form-control {\n    width: 100%;\n    padding: 14px 16px;\n    background: rgba(255, 255, 255, 0.6);\n    border: 1px solid rgba(14, 13, 12, 0.15);\n    color: var(--ink);',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-control:focus \{\n    outline: none;\n    border-color: var\(--rose-soft\);\n    background: rgba\(14, 13, 12, 0\.7\);',
    '.form-control:focus {\n    outline: none;\n    border-color: var(--rose);\n    background: #fff;',
    html, flags=re.DOTALL
)

# Update SVG arrow for select
html = html.replace('fill%3D%22%23F3EBE2%22', 'fill%3D%22%230E0D0C%22')

html = re.sub(
    r'select\.form-control option \{\n    background: var\(--ink\);\n    color: var\(--cream\);\n  \}',
    'select.form-control option {\n    background: var(--cream);\n    color: var(--ink);\n  }',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-submit \{\n    background: var\(--cream\);\n    color: var\(--ink\);\n    border: 1px solid var\(--cream\);',
    '.form-submit {\n    background: var(--rose);\n    color: var(--cream);\n    border: 1px solid var(--rose);',
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.form-submit:hover \{\n    background: transparent;\n    color: var\(--cream\);\n  \}',
    '.form-submit:hover {\n    background: transparent;\n    color: var(--rose);\n  }',
    html, flags=re.DOTALL
)

with open('contact.html', 'w') as f:
    f.write(html)
