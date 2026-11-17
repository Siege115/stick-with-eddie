#!/usr/bin/env bash
# contact sheet: one frame per second, 8 per row
set -e
in="$1"; out="$2"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
n=$(python3 -c "import math;print(math.ceil($d))")
rows=$(( (n + 7) / 8 ))
ffmpeg -loglevel error -y -i "$in" -vf "fps=1,scale=216:384,tile=8x${rows}:padding=4:color=black" -frames:v 1 "$out"
