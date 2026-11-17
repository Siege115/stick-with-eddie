"""Build the portable versions of the studio team from .claude/agents/*.md.

Outputs (re-run after editing any agent):
  YOUTUBE-STUDIO-TEAM.md          one file to upload or paste into any Claude chat or Project
  skills/youtube-studio/SKILL.md  the same team as an Agent Skill
  dist/youtube-studio.zip         the skill zipped for claude.ai → Settings → Capabilities → Skills
Usage: python3 studio/build-portable.py
"""
import os, re, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AG = os.path.join(ROOT, ".claude", "agents")
ORDER = ["youtube-manager", "trend-scout", "fact-checker", "scriptwriter", "art-director", "animator",
         "sound-designer", "packaging-lead", "qa-reviewer", "publisher", "analytics-analyst",
         "community-manager", "social-repurposer"]

def parse(name):
    txt = open(os.path.join(AG, name + ".md"), encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n(.*)", txt, re.S)
    fm, body = m.group(1), m.group(2).strip()
    import json
    desc = json.loads(re.search(r"^description: (.*)$", fm, re.M).group(1).strip())
    return desc, body

HOW = """## How to use this file in a chat
You are a whole YouTube production team in one conversation. **Act as the Studio Manager** (below) and talk to the owner as the manager. When a task belongs to a specialist, **switch into that specialist's role**: start the section with a header like `### 🎬 Scriptwriter`, follow that role's instructions exactly, then switch back to the manager to check the work and report. Never skip the manager's review or the QA gate.

- If your environment can run sub-agents (Claude Code), use the real agents in `.claude/agents/` instead of role-play.
- If files aren't available, keep the studio files (schedule, project board, idea backlog, briefs) as clearly labelled sections in the chat and update them as you go.
- If the owner hasn't shared `CHANNEL-BIBLE.md`, ask for it once, then follow it.
- **The owner sets every posting date** and approves anything public or paid. That rule overrides everything else in this file.
"""

def build():
    parts = ["# Stick With Eddie: YouTube Studio Team\n",
             "A manager and 12 specialists that run a YouTube Shorts channel like a professional team.\n",
             HOW]
    studio = open(os.path.join(ROOT, "studio", "STUDIO.md"), encoding="utf-8").read()
    studio = re.sub(r"^## ", "### ", studio, flags=re.M).replace("# Stick With Eddie Studio: operating manual", "## Studio operating manual")
    parts.append("\n---\n\n" + studio)
    for n in ORDER:
        desc, body = parse(n)
        title = n.replace("-", " ").title()
        parts.append(f"\n---\n\n## Role: {title} (`{n}`)\n*When to use:* {desc}\n\n" + re.sub(r"^## ", "### ", body, flags=re.M))
    doc = "\n".join(parts)
    open(os.path.join(ROOT, "YOUTUBE-STUDIO-TEAM.md"), "w", encoding="utf-8").write(doc)

    skill_dir = os.path.join(ROOT, "skills", "youtube-studio"); os.makedirs(skill_dir, exist_ok=True)
    fm = ("---\nname: youtube-studio\ndescription: Run the Stick With Eddie YouTube channel as a full production team. "
          "A studio manager plans, delegates and reviews, and 12 specialists (trend scout, fact-checker, scriptwriter, "
          "art director, animator, sound designer, packaging lead, QA reviewer, publisher, analytics analyst, community manager, "
          "social repurposer) do the work. Use for anything about the channel's videos, ideas, scripts, schedule, packaging, "
          "analytics or comments.\n---\n\n")
    open(os.path.join(skill_dir, "SKILL.md"), "w", encoding="utf-8").write(fm + doc)

    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    with zipfile.ZipFile(os.path.join(ROOT, "dist", "youtube-studio.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(skill_dir, "SKILL.md"), "youtube-studio/SKILL.md")
    print("built YOUTUBE-STUDIO-TEAM.md,", len(doc.split()), "words; skills/youtube-studio/SKILL.md; dist/youtube-studio.zip")

build()
