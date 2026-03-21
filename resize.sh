#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RAW_DIR="$SCRIPT_DIR/public/raw-photos"
OUT_DIR="$SCRIPT_DIR/public/photos"

# Lowercase all filenames in raw-photos
for file in "$RAW_DIR"/*; do
    name="$(basename "$file")"
    lower="$(echo "$name" | tr '[:upper:]' '[:lower:]')"
    if [ "$name" != "$lower" ]; then
        echo "Renaming $name -> $lower"
        mv "$file" "$RAW_DIR/$lower"
    fi
done

mkdir -p "$OUT_DIR"

for file in "$RAW_DIR"/*.jpg; do
    name="$(basename "$file")"
    echo "Resizing $name..."
    convert "$file" -resize 2560 -quality 80 "$OUT_DIR/$name"
done

echo "Done. Resized $(ls "$OUT_DIR"/*.jpg 2>/dev/null | wc -l) photos."
