---
type: "guide"
category: "Production"
tags:
  - "stick-with-eddie"
---
# Render Commands

```
node render-episode.mjs content/<id>.beats.mjs projects/<id> --aspect 9:16 --3d --workers 3
node render-episode.mjs content/<id>.beats.mjs projects/<id> --3d --preview 1.5,10,30   # stills
node render-episode.mjs ... --preview all                                               # one still per second
src/contact.sh deliver/<id>.mp4 deliver/<id>-contact-sheet.jpg
python3 studio/build-portable.py   # rebuild the portable team file and skill
```
A full render takes about 30–45 min. Re-run the same command after any interruption; finished pieces are kept.
