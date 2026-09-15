#!/bin/sh
set -eu

if [ "$#" -ne 1 ] || [ -z "$1" ]; then
  echo 'Usage: sh scripts/install-skills.sh /path/to/project/.claude/skills' >&2
  exit 2
fi

source_root=$(CDPATH= cd -- "$(dirname -- "$0")/../pure-prompts/skills" && pwd)
destination=$1
case "$destination" in
  /*) ;;
  *) destination="$(pwd)/$destination" ;;
esac

if [ -e "$destination" ] && [ ! -d "$destination" ]; then
  echo "Destination is not a directory: $destination" >&2
  exit 1
fi

# Check every name before copying any files. Existing skills stay untouched.
for skill in "$source_root"/*; do
  name=$(basename "$skill")
  if [ -e "$destination/$name" ] || [ -L "$destination/$name" ]; then
    echo "Existing skill, nothing copied: $destination/$name" >&2
    exit 1
  fi
done

mkdir -p "$destination"
for skill in "$source_root"/*; do
  cp -R "$skill" "$destination/"
done

echo "Installed 8 skill directories into $destination"
echo 'Open a Claude Code session in the target project and try /assess first.'
