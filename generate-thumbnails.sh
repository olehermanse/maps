#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PHOTO_DIR="$SCRIPT_DIR/public/photos"
THUMB_DIR="$SCRIPT_DIR/public/thumbnails"

mkdir -p "$THUMB_DIR"

for file in "$PHOTO_DIR"/*.jpg; do
    name="$(basename "$file")"
    echo "Thumbnail $name..."
    convert "$file" -resize 256x256^ -gravity center -extent 256x256 -quality 80 "$THUMB_DIR/$name"
done

echo "Done. Generated $(ls "$THUMB_DIR"/*.jpg 2>/dev/null | wc -l) thumbnails."
