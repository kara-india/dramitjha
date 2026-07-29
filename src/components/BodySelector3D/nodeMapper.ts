// src/components/BodySelector3D/nodeMapper.ts
// Fuzzy alias adapter to map arbitrary 3D glTF node names to canonical body part IDs

export const NODE_ALIAS: Record<string, string[]> = {
  head: ["Head", "Head_geo", "head_mesh", "cranium", "skull"],
  neck: ["Neck", "Neck_geo", "cervical", "cervical_spine"],
  shoulder: ["Shoulder_L", "Shoulder_R", "shoulder", "clavicle", "scapula", "deltoid"],
  elbow: ["Elbow_L", "Elbow_R", "elbow", "humerus", "radius", "ulna"],
  wrist: ["Wrist_L", "Wrist_R", "wrist", "carpal", "hand", "metacarpal"],
  spine: ["Spine", "Spine_geo", "thoracic", "lumbar", "vertebrae", "back"],
  hip: ["Hip_L", "Hip_R", "hip", "pelvis", "acetabulum", "femur_head"],
  knee: ["Knee_L", "Knee_R", "knee", "patella", "meniscus", "acl", "tibia"],
  ankle: ["Ankle_L", "Ankle_R", "ankle", "tarsal", "foot", "achilles"],
};

export function mapNodeToPart(nodeName: string): string | null {
  const normalized = nodeName.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const [partId, aliases] of Object.entries(NODE_ALIAS)) {
    for (const alias of aliases) {
      if (normalized.includes(alias.toLowerCase())) {
        return partId;
      }
    }
  }

  return null;
}
