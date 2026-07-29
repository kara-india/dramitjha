#!/usr/bin/env bash
set -euo pipefail
mkdir -p assets/reports

# 1) Inspect nodes (requires @gltf-transform/cli)
npx @gltf-transform/cli inspect public/models/human.glb --list-nodes --json > assets/reports/node-list.json || true

# 2) Draco compress (if glb exists)
if [ -f public/models/human.glb ]; then
  echo "Compressing to public/models/human-draco.glb..."
  npx @gltf-transform/cli draco public/models/human.glb public/models/human-draco.glb --compression-level=7
  npx @gltf-transform/cli inspect public/models/human-draco.glb --list-nodes --json > assets/reports/node-list-draco.json || true
fi

# 3) Checksums for artifacts
if [ -f public/models/human-draco.glb ]; then
  sha256sum public/models/human-draco.glb > assets/reports/human-draco.sha256
fi
if [ -f public/models/human-fallback.svg ]; then
  sha256sum public/models/human-fallback.svg > assets/reports/human-fallback.sha256
fi

# 4) Minimal asset-check.json
python3 - <<'PY'
import json, os
report={"agents":["A","B","C","D"],"summary":{"status":"pending","notes":""},"files":[]}
for p in ["public/models/human-draco.glb","public/models/human-fallback.svg"]:
  if os.path.exists(p):
    import hashlib
    h=hashlib.sha256(open(p,"rb").read()).hexdigest()
    report["files"].append({"path":p,"sha256":h})
print(json.dumps(report,indent=2))
PY > assets/reports/asset-check.json

echo "Done. Reports under assets/reports/"
