import os, sys, json, urllib.request, concurrent.futures
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from photo_filenames import FILENAMES
from PIL import Image

BASE = "https://base44.app/api/apps/6a7a0d673c6e832f34f21db3/files/mp/public/6a7a0d673c6e832f34f21db3/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "photos")
MANIFEST_PATH = os.path.join(ROOT, "src", "lib", "photo-manifest.json")
MAX_DIM = 1600
QUALITY = 80

os.makedirs(OUT_DIR, exist_ok=True)

def out_name(fname):
    base = os.path.splitext(fname)[0]
    return base + ".jpg"

def process(fname):
    url = BASE + fname
    out_path = os.path.join(OUT_DIR, out_name(fname))
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        orig_size = len(data)
        import io
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGB") if im.mode != "RGB" else im
        w, h = im.size
        scale = min(1.0, MAX_DIM / max(w, h))
        if scale < 1.0:
            im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
        im.save(out_path, "JPEG", quality=QUALITY, optimize=True)
        new_size = os.path.getsize(out_path)
        return (fname, out_name(fname), orig_size, new_size, None)
    except Exception as e:
        return (fname, None, 0, 0, str(e))

def main():
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        for i, r in enumerate(ex.map(process, FILENAMES)):
            results.append(r)
            if (i + 1) % 25 == 0:
                print(f"...{i + 1}/{len(FILENAMES)}")

    manifest = {}
    total_orig = total_new = 0
    failed = []
    for fname, newname, orig_size, new_size, err in results:
        if err:
            failed.append((fname, err))
            continue
        manifest[fname] = f"/photos/{newname}"
        total_orig += orig_size
        total_new += new_size

    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=1, sort_keys=True)

    print(f"\nOK: {len(manifest)}/{len(FILENAMES)}")
    print(f"original total: {total_orig/1024/1024:.1f} MB")
    print(f"new total:      {total_new/1024/1024:.1f} MB")
    if total_orig:
        print(f"reduction: {(1 - total_new/total_orig)*100:.0f}%")
    if failed:
        print(f"\nFAILED ({len(failed)}):")
        for fname, err in failed:
            print(f"  {fname}: {err}")

if __name__ == "__main__":
    main()
