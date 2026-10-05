#!/usr/bin/env python3
"""Regenerate assets/gallery/manifest.json from the files in assets/gallery/.

The gallery page lists that folder through the GitHub contents API, so adding
an image normally needs nothing but a commit. The manifest is the fallback the
page uses when that call fails -- offline, rate limited, or serving files that
are not committed yet -- so refresh it after adding or removing images:

    python tools/gallery_manifest.py

Standard library only.
"""

import json
from pathlib import Path

GALLERY_DIR = Path(__file__).resolve().parent.parent / "assets" / "gallery"
MANIFEST_PATH = GALLERY_DIR / "manifest.json"
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"}


def main():
    if not GALLERY_DIR.is_dir():
        raise SystemExit(f"error: {GALLERY_DIR} does not exist")

    names = sorted(
        entry.name
        for entry in GALLERY_DIR.iterdir()
        if entry.is_file() and entry.suffix.lower() in IMAGE_SUFFIXES
    )

    MANIFEST_PATH.write_text(json.dumps(names, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MANIFEST_PATH.relative_to(Path.cwd())} ({len(names)} images).")


if __name__ == "__main__":
    main()
