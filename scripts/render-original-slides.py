"""Render the original deck for the website without changing the download.

Requires LibreOffice, PyMuPDF, Pillow and lxml. Modern chartEx objects use
PowerPoint's own cached fallback images, which preserve the map and doughnut.
Hidden slides are exported to keep the original 23-slide sequence intact.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO
import argparse
import os
import shutil
import subprocess
import fitz
from lxml import etree
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NS = {
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
    "cx": "http://schemas.microsoft.com/office/drawing/2014/chartex",
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "public/files/Investing-in-Movies.pptx")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "public/slides")
    parser.add_argument("--soffice")
    args = parser.parse_args()
    runtime = os.environ.get("CODEX_PRIMARY_RUNTIME_ROOT")
    bundled = Path(runtime) / "dependencies/native/libreoffice-headless/libreoffice/program/soffice" if runtime else None
    soffice = args.soffice or shutil.which("soffice") or (str(bundled) if bundled and bundled.is_file() else None)
    if not soffice:
        parser.error("LibreOffice is required. Supply its executable with --soffice.")
    source = args.input.resolve()
    with TemporaryDirectory(prefix="portfolio-slide-render-") as tmp:
        work = Path(tmp)
        render_copy = work / "Investing-in-Movies.pptx"
        restored = 0
        with ZipFile(source) as original, ZipFile(render_copy, "w", ZIP_DEFLATED) as target:
            slide_count = len([n for n in original.namelist() if n.startswith("ppt/slides/slide") and n.endswith(".xml")])
            for name in original.namelist():
                data = original.read(name)
                if name.startswith("ppt/slides/slide") and name.endswith(".xml"):
                    tree = etree.fromstring(data)
                    for alternate in tree.xpath("//mc:AlternateContent[mc:Choice//cx:chart]", namespaces=NS):
                        fallback = alternate.find("mc:Fallback", NS)
                        if fallback is None or not len(fallback):
                            raise RuntimeError(f"No original chart fallback in {name}")
                        parent = alternate.getparent()
                        index = parent.index(alternate)
                        for child in list(fallback):
                            parent.insert(index, child)
                            index += 1
                        parent.remove(alternate)
                        restored += 1
                    data = etree.tostring(tree, xml_declaration=True, encoding="UTF-8", standalone=True)
                target.writestr(name, data)
        subprocess.run([
            soffice, "--headless", f"-env:UserInstallation={(work / 'profile').as_uri()}",
            "--convert-to", 'pdf:impress_pdf_Export:{"ExportHiddenSlides":{"type":"boolean","value":"true"}}',
            "--outdir", str(work), str(render_copy),
        ], check=True, timeout=120)
        with fitz.open(work / "Investing-in-Movies.pdf") as deck:
            if len(deck) != slide_count:
                raise RuntimeError(f"Expected {slide_count} slides; got {len(deck)}")
            if any("not supported" in page.get_text().lower() for page in deck):
                raise RuntimeError("The conversion still contains an unsupported-object placeholder")
            args.output_dir.mkdir(parents=True, exist_ok=True)
            for number, page in enumerate(deck, 1):
                pixels = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                image = Image.frombytes("RGB", (pixels.width, pixels.height), pixels.samples)
                encoded = BytesIO()
                image.save(encoded, format="WEBP", quality=96, method=6)
                payload = encoded.getvalue()
                if not payload:
                    raise RuntimeError(f"Slide {number} encoded to an empty file")
                with Image.open(BytesIO(payload)) as check:
                    check.load()
                destination = args.output_dir / f"slide-{number}.webp"
                staging = destination.with_suffix(".webp.tmp")
                staging.write_bytes(payload)
                staging.replace(destination)
        print(f"Rendered {slide_count} slides; restored {restored} original chart images. Source unchanged.")


if __name__ == "__main__":
    main()
