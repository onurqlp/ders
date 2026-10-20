#!/usr/bin/env python3
"""Copy AYDA's existing student-facing source repositories, losslessly.

Runs ONLY in the protected consolidation branch via GitHub Actions. Original
repositories, their Pages sites and WordPress are never changed by this script.
The repositories are cloned read-only and files are copied byte-for-byte.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
CONFIG = json.loads((ROOT / "tools/consolidation/sources.json").read_text())
BRANCH = CONFIG["test_branch"]
if os.environ.get("GITHUB_REF") != f"refs/heads/{BRANCH}":
    sys.exit("STOP: refusing import outside the dedicated test branch")
if os.environ.get("GITHUB_REPOSITORY") != CONFIG["target_repository"]:
    sys.exit("STOP: wrong destination repository")
if not CONFIG["policy"].get("deploy_to_production") is False:
    sys.exit("STOP: production publish policy must be disabled")

manifest_root = ROOT / "tools/consolidation/source-manifests"
manifest_root.mkdir(parents=True, exist_ok=True)

def run(args, cwd=None):
    return subprocess.check_output(args, cwd=cwd, text=True, stderr=subprocess.PIPE).strip()

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1048576), b""):
            h.update(block)
    return h.hexdigest()

def copy_repo(source, root):
    full_name = source["repository"]
    name = full_name.rsplit("/", 1)[-1]
    if "/" not in full_name or not name.replace("-", "").replace("_", "").isalnum():
        raise ValueError(f"Invalid repository entry: {full_name}")
    target = ROOT / source["folder"]
    if target.resolve() != (ROOT / "sites" / name).resolve():
        raise ValueError(f"Unexpected target directory for {name}")
    manifest = manifest_root / f"{name}.json"
    if manifest.exists():
        print(f"SKIP {name}: source manifest already exists; do not overwrite later edits", flush=True)
        return
    if target.exists():
        raise RuntimeError(f"STOP: {target} exists without source manifest; refusing overwrite")

    clone_dir = root / name
    url = f"https://github.com/{full_name}.git"
    for attempt in range(3):
        try:
            subprocess.run(["git", "clone", "--quiet", "--depth", "1",
                "--single-branch", "--branch", source["ref"], url, str(clone_dir)],
                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=480)
            break
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as exc:
            if clone_dir.exists():
                shutil.rmtree(clone_dir)
            if attempt == 2:
                raise RuntimeError(f"Could not clone {full_name}: {exc}") from exc
            time.sleep(3 * (attempt + 1))
    source_commit = run(["git", "rev-parse", "HEAD"], clone_dir)
    paths = subprocess.check_output(["git", "ls-files", "-z"], cwd=clone_dir).split(b"\0")
    expected = []
    for item in paths:
        if not item:
            continue
        rel = os.fsdecode(item)
        if Path(rel).is_absolute() or ".." in Path(rel).parts:
            raise RuntimeError(f"Unsafe path: {name}/{rel}")
        path = clone_dir / rel
        if path.is_symlink():
            link = path.resolve()
            if not link.is_relative_to(clone_dir.resolve()):
                raise RuntimeError(f"Unsafe symlink: {name}/{rel}")
        if not path.is_file():
            raise RuntimeError(f"Non-file entry not supported: {name}/{rel}")
        expected.append({"path":rel,"sha256":sha256(path),"bytes":path.stat().st_size})

    for entry in expected:
        rel = entry["path"]
        output = target / rel
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(clone_dir / rel, output)
    result = {
        "repository":full_name, "source_ref":source["ref"],
        "source_commit":source_commit, "destination":source["folder"],
        "file_count":len(expected), "total_bytes":sum(x["bytes"] for x in expected),
        "files":expected,
    }
    manifest.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n")
    print(f"COPIED {name}: {len(expected)} files / {result['total_bytes']} bytes @ {source_commit[:12]}",flush=True)

def main():
    with tempfile.TemporaryDirectory(prefix="ayda-import-") as temp:
        for source in CONFIG["sources"]:
            copy_repo(source, Path(temp))
    print("IMPORT FINISHED, content is staged ONLY in the isolated test branch",flush=True)

if __name__ == "__main__":
    main()
