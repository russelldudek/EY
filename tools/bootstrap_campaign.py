from pathlib import Path
import base64, io, zipfile, shutil

ROOT = Path(__file__).resolve().parents[1]
PARTS = ROOT / "tools" / "source_payload"
expected = [PARTS / f"part{i:02}.txt" for i in range(11)]
missing = [path.name for path in expected if not path.exists()]
if missing:
    raise FileNotFoundError(f"Missing campaign payload parts: {', '.join(missing)}")
payload = "".join(path.read_text().strip() for path in expected)
data = base64.b64decode(payload, validate=True)
with zipfile.ZipFile(io.BytesIO(data)) as archive:
    damaged = archive.testzip()
    if damaged:
        raise RuntimeError(f"Campaign payload failed ZIP integrity at {damaged}")
    archive.extractall(ROOT)
for path in [
    PARTS,
    ROOT / "tools" / "payload",
    Path(__file__),
    ROOT / ".github" / "workflows" / "bootstrap-campaign.yml",
    ROOT / "publish-trigger.txt",
    ROOT / "publication-note.md",
    ROOT / ".publication-ready",
    ROOT / "publication-trigger.json",
    ROOT / "publication-context.txt",
    ROOT / "publication-sequence.txt",
    ROOT / "pr-ready.txt",
    ROOT / "final-trigger.txt",
    ROOT / "open-pr-now.txt",
]:
    if path.is_dir():
        shutil.rmtree(path)
    else:
        try:
            path.unlink()
        except FileNotFoundError:
            pass
print("Installed complete EY candidate campaign source")
