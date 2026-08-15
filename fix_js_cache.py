import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    content = re.sub(r'src="assets/js/main\.js(\?v=\d+)?"', 'src="assets/js/main.js?v=2"', content)
    
    with open(file, 'w') as f:
        f.write(content)
