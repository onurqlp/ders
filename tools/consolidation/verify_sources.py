#!/usr/bin/env python3
"""Test-only source parity gate: every copied tracked byte matches its origin."""
import hashlib
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[2]
CONFIG=json.loads((ROOT/"tools/consolidation/sources.json").read_text())
REPORT=ROOT/"tools/consolidation/verification-report.json"
MANIFESTS=ROOT/"tools/consolidation/source-manifests"

def sha256(path):
    h=hashlib.sha256()
    with path.open("rb") as src:
        for chunk in iter(lambda:src.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

issues=[]
rows=[]
for source in CONFIG["sources"]:
    name=source["repository"].split("/")[-1]
    path=MANIFESTS/(name+".json")
    if not path.exists():
        issues.append("MISSING MANIFEST "+name)
        continue
    manifest=json.loads(path.read_text())
    dest=ROOT/source["folder"]
    listed={item["path"]:item for item in manifest["files"]}
    actual={p.relative_to(dest).as_posix() for p in dest.rglob("*") if p.is_file()}
    absent=set(listed)-actual
    added=actual-set(listed)
    for file in absent:
        issues.append("MISSING "+name+"/"+file)
    for file in added:
        issues.append("EXTRA "+name+"/"+file)
    for rel in set(listed)&actual:
        file=dest/rel
        if file.stat().st_size!=listed[rel]["bytes"] or sha256(file)!=listed[rel]["sha256"]:
            issues.append("DIFFERENT "+name+"/"+rel)
    if manifest["file_count"]!=len(listed) or len(listed)!=len(actual):
        issues.append("COUNT "+name)
    rows.append({"repository":source["repository"],"source_commit":manifest["source_commit"],
                 "files":len(listed),"bytes":sum(x["bytes"] for x in listed.values()),
                 "parity":not any(x.startswith(("MISSING "+name+"/","EXTRA "+name+"/","DIFFERENT "+name+"/","COUNT "+name)) for x in issues)})
total_files=sum(x["files"] for x in rows)
total_bytes=sum(x["bytes"] for x in rows)
REPORT.write_text(json.dumps({
    "test_branch":CONFIG["test_branch"],"production_untouched":True,
    "expected_sources":len(CONFIG["sources"]),"imported_sources":len(rows),
    "total_source_files":total_files,"total_source_bytes":total_bytes,
    "repositories":rows,"issues":issues
},ensure_ascii=False,indent=2)+"\n")
for r in rows:
    print(f"{'PASS' if r['parity'] else 'FAIL'} {r['repository']}: {r['files']} files",flush=True)
print(f"SOURCE PARITY: {len(rows)}/{len(CONFIG['sources'])} repositories, {total_files} files, {total_bytes} bytes, {len(issues)} issues",flush=True)
if issues:
    for issue in issues[:50]: print("FAIL "+issue,file=sys.stderr)
    sys.exit(1)
if len(rows)!=len(CONFIG["sources"]):
    sys.exit("FAIL: not all source repositories imported")
