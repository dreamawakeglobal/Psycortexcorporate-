import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    content = re.sub(r'href="assets/css/style\.css(\?v=\d+)?"', 'href="assets/css/style.css?v=29"', content)
    content = re.sub(r'src="assets/js/main\.js(\?v=\d+)?"', 'src="assets/js/main.js?v=4"', content)
    
    with open(file, 'w') as f:
        f.write(content)
