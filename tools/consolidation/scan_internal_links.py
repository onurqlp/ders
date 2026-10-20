#!/usr/bin/env python3
"""Inventory cross-repository links before changing any production URLs."""
import collections
import json
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[2]
cfg=json.loads((ROOT/"tools/consolidation/sources.json").read_text())
sites=ROOT/"sites"
known={x["repository"].split("/")[-1].lower() for x in cfg["sources"]}
legacy=collections.defaultdict(lambda:{"count":0,"examples":[]})
wordpress=collections.Counter()
hosting=collections.Counter()
extensions={".html",".htm",".js",".mjs",".cjs",".css",".md",".txt",".json",".svg",".xml"}
patterns=[
    re.compile(r"https?://onurqlp\.github\.io/([A-Za-z0-9_.-]+)(?:/|[?#]|[\"'])",re.I),
    re.compile(r"https?://www\.aydadil\.com/([A-Za-z0-9_-]+)(?:/|[?#]|[\"'])",re.I)
]
for source in cfg["sources"]:
    repo=source["repository"].split("/")[-1]
    directory=ROOT/source["folder"]
    for file in directory.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in extensions:
            continue
        try:
            text=file.read_text(encoding="utf-8")
        except (UnicodeDecodeError,ValueError):
            continue
        relative=file.relative_to(ROOT).as_posix()
        for match in patterns[0].finditer(text):
            dest=match.group(1)
            key=(repo,dest)
            item=legacy[key]
            item["count"]+=1
            if len(item["examples"])<2:
                item["examples"].append(relative)
        for match in patterns[1].finditer(text):
            wordpress[match.group(1)]+=1

refs=[{"source_repo":a,"destination_repo":b,"count":v["count"],
       "already_imported":b.lower() in known,
       "examples":v["examples"]}
      for (a,b),v in sorted(legacy.items())]
unknown=sorted({r["destination_repo"] for r in refs if not r["already_imported"]})
result={"imported_repositories":len(known),"cross_repo_links":refs,
    "unmapped_github_pages_destinations":unknown,
    "wordpress_paths":dict(wordpress.most_common()),
    "note":"Read-only inventory: legacy URLs are intentionally unchanged until test-site routing is approved."}
path=ROOT/"tools/consolidation/link-audit.json"
path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n")
print(f"LINK AUDIT: {len(refs)} source/destination pairs, {len(unknown)} unimported destinations")
for n in unknown: print("REVIEW destination:",n)
