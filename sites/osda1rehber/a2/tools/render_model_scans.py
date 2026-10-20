#!/usr/bin/env python3
"""Render unchanged official ÖSD ZA2 model exam pages for a student-facing preview.
Source: https://www.osd.at/wp-content/uploads/2023/07/ZA2-Modellsatz.pdf
This is the exact 12-page ZA2 Modellsatz previously supplied by AYDA.
Do not render answer-key pages 11-12 into the learning interface.
"""
from __future__ import annotations
import io
import subprocess
import tempfile
from pathlib import Path
from PIL import Image

SOURCE = "https://www.osd.at/wp-content/uploads/2023/07/ZA2-Modellsatz.pdf"
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "model"
DEST.mkdir(parents=True, exist_ok=True)

def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=150)

with tempfile.TemporaryDirectory() as temp:
    directory = Path(temp)
    pdf = directory / "za2-modellsatz.pdf"
    run("curl", "--fail", "--location", "--retry", "4", "--retry-all-errors",
        "--connect-timeout", "20", "--max-time", "90", "--user-agent", "Mozilla/5.0",
        SOURCE, "--output", str(pdf))
    assert pdf.read_bytes()[:4] == b"%PDF", "Official source is not a PDF"
    info = subprocess.check_output(["pdfinfo", str(pdf)], text=True)
    pages = next(int(line.split(":", 1)[1]) for line in info.splitlines() if line.startswith("Pages:"))
    assert pages == 12, f"Expected the user-supplied 12-page ZA2 model, got {pages}"

    for page in range(2, 11):
        output = DEST / f"za2-page-{page:02d}"
        run("pdftoppm", "-f", str(page), "-l", str(page), "-singlefile",
            "-jpeg", "-jpegopt", "quality=83,optimize=y,progressive=y",
            "-r", "160", str(pdf), str(output))
        img = Image.open(output.with_suffix(".jpg"))
        assert img.width >= 1100 and img.height >= 1400
        print(f"page {page}: {img.width}x{img.height}")

    img = Image.open(DEST / "za2-page-06.jpg").convert("RGB")
    w,h = img.size
    sections = {
        "hoeren-1": (0.045, 0.077, 0.962, 0.301),
        "hoeren-2": (0.045, 0.300, 0.962, 0.603),
        "hoeren-3": (0.045, 0.603, 0.962, 0.930),
    }
    for name,(x1,y1,x2,y2) in sections.items():
        cropped = img.crop((int(w*x1),int(h*y1),int(w*x2),int(h*y2)))
        cropped.save(DEST / f"za2-{name}.jpg", "JPEG", quality=86, optimize=True, progressive=True)
        print(f"crop {name}: {cropped.width}x{cropped.height}")

    for file in sorted(DEST.glob("*.jpg")):
        assert file.stat().st_size > 10_000 and file.stat().st_size < 1_800_000
        print(file.name, file.stat().st_size, "bytes")

print("PASS: 9 official pages + 3 faithful section crops, no model answers in student scans.")
