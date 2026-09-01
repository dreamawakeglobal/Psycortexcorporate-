import glob

for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace the text image margin to be perfectly aligned
    # We'll set the text image to have margin: -10px -11px -23px -30px; 
    # Or maybe -5px if they want it further down. Let's use -6px.
    content = content.replace(
        'margin: -23px -11px -23px -30px;"', 
        'margin: -8px -11px -23px -30px;"'
    )
    content = content.replace(
        'margin: -10px -11px -23px -30px;"', 
        'margin: -8px -11px -23px -30px;"'
    )
    
    with open(file, 'w') as f:
        f.write(content)
