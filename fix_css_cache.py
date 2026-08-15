import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    content = re.sub(r'href="assets/css/style\.css(\?v=\d+)?"', 'href="assets/css/style.css?v=64"', content)
    
    with open(file, 'w') as f:
        f.write(content)
