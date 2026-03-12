#!/bin/bash
# Resize screenshots for App Store Connect (iPhone 6.5" slot)
# Required: 1242 x 2688 (portrait) or 1284 x 2778
# Usage: ./scripts/resize-screenshots.sh screenshot1.png screenshot2.png screenshot3.png

OUTPUT_DIR="./app-store-screenshots"
mkdir -p "$OUTPUT_DIR"

# Target dimensions for App Store
WIDTH=1242
HEIGHT=2688

for img in "$@"; do
  if [ ! -f "$img" ]; then
    echo "⚠️  Skipping (not found): $img"
    continue
  fi
  base=$(basename "$img" .png)
  out="$OUTPUT_DIR/${base}-resized.png"
  sips -z $HEIGHT $WIDTH "$img" --out "$out"
  echo "✓ Resized: $img → $out ($WIDTH x $HEIGHT)"
done

echo ""
echo "Done! Upload the files from: $OUTPUT_DIR"
