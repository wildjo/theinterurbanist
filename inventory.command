#!/usr/bin/env bash
set -euo pipefail

# always run from this script's folder
cd "$(dirname "$0")"

out="_tools/inventory"
mkdir -p "$out"

# 1) Full file list (exclude build cruft)
{ 
  echo "# Full file list (excluding .git, _site, vendor, node_modules)"
  date
  echo
  find . \
    -path './.git' -prune -o \
    -path './_site' -prune -o \
    -path './vendor' -prune -o \
    -path './node_modules' -prune -o \
    -type f -print \
    | sed 's#^\./##' \
    | sort
} > "$out/file-inventory.txt"

# 2) Git views
git ls-files | sort > "$out/tracked.txt" || true
git ls-files --others --exclude-standard | sort > "$out/untracked.txt" || true
git ls-files --others -i --exclude-standard | sort > "$out/ignored-by-gitignore.txt" || true

# 3) Top-level sizes (helps spot dead weight)
du -sh ./* 2>/dev/null | sort -h > "$out/by-directory-size.txt"

echo "Wrote inventory to $out"
# macOS: open the folder so you see the files
command -v open >/dev/null && open "$out" || true
