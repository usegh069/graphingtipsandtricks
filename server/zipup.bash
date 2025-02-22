#!/bin/bash

# Default values
EXPLORE_DIR=""
OUTPUT_DIR=""

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --explore=*)
      EXPLORE_DIR="${1#*=}"
      shift
      ;;
    --out=*)
      OUTPUT_DIR="${1#*=}"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate inputs
if [[ -z "$EXPLORE_DIR" || -z "$OUTPUT_DIR" ]]; then
  echo "Usage: $0 --explore=DIR --out=OUTPUT_DIR"
  exit 1
fi

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Function to process directories
process_directory() {
  local DIR="$1"
  for subdir in "$DIR"/*; do
    if [[ -d "$subdir" ]]; then
      echo "[FOUND] $subdir [s,z,e]: "
      read -r choice
      choice=${choice:-z}
      case "$choice" in
        s) echo "    [SKIPPED] $subdir" ;;
        z)
          zip_name="$OUTPUT_DIR/$(basename "$subdir").zip"
          (cd "$subdir" && zip -r "$zip_name" .) >/dev/null
          echo "    [ZIPPED] $subdir"
          ;;
        e) process_directory "$subdir" ;;
        *) echo "    Invalid choice, skipping $subdir" ;;
      esac
    fi
  done
}

# Start processing
process_directory "$EXPLORE_DIR"
