import os
import glob
import shutil

brain_dir = "/Users/tariqwest/.gemini/antigravity/brain/f6747208-6d33-463a-af93-7532b68b8277"
files = glob.glob(os.path.join(brain_dir, "media__*"))
if files:
    newest = max(files, key=os.path.getmtime)
    print("Newest file is:", newest)
    shutil.copy2(newest, "assets/img/alba-cortez-about.jpg")
    print("Copied to assets/img/alba-cortez-about.jpg")
else:
    print("No media files found")
