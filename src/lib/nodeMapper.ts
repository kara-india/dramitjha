// src/lib/nodeMapper.ts
// Node mapping adapter: translates arbitrary 3D model node names to canonical bodyPart IDs.

const NODE_ALIAS_MAP: Record<string, string[]> = {
  head: ["head", "cranium", "head_mesh", "skull", "caput"],
  neck: ["neck", "cervical", "cervical_spine", "collum"],
  shoulder: ["shoulder", "deltoid", "ac_joint", "rotator", "glenohumeral", "clavicle", "scapula"],
  elbow: ["elbow", "olecranon", "cubitus", "epicondyle"],
  wrist: ["wrist", "carpus", "hand", "manus", "radiocarpal"],
  spine: ["spine", "thoracic", "lumbar", "back", "vertebrae", "columna"],
  hip: ["hip", "pelvis", "acetabulum", "femoral_head", "coxa"],
  knee: ["knee", "patella", "femur_distal", "tibia_proximal", "genu"],
  ankle: ["ankle", "talus", "tarsus", "foot", "pes", "calcaneus"],
};

/**
 * Maps a GLB mesh/node name to a canonical BodyPart ID if possible.
 */
export function mapNodeToPartId(nodeName: string): string | null {
  const normalized = nodeName.toLowerCase().replace(/[^a-z0-9]/g, "_");

  for (const [canonicalId, aliases] of Object.entries(NODE_ALIAS_MAP)) {
    if (canonicalId === normalized) return canonicalId;
    for (const alias of aliases) {
      if (normalized.includes(alias)) return canonicalId;
    }
  }

  return null;
}
