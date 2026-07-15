from pathlib import Path
import base64, io, zipfile, shutil

ROOT = Path(__file__).resolve().parents[1]
PARTS = ROOT / "tools" / "payload"
payload = "".join(path.read_text() for path in sorted(PARTS.glob("part*.txt")))
with zipfile.ZipFile(io.BytesIO(base64.b64decode(payload))) as archive:
    archive.extractall(ROOT)
for path in [PARTS, Path(__file__), ROOT / ".github" / "workflows" / "bootstrap-campaign.yml"]:
    if path.is_dir():
        shutil.rmtree(path)
    else:
        try:
            path.unlink()
        except FileNotFoundError:
            pass
print("Installed complete EY candidate campaign")
