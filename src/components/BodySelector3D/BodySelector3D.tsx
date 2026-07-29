"use client";
import React, { Suspense, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { BODY_PARTS, type BodyPart } from "@/data/bodyParts";
import { mapNodeToPartId } from "@/lib/nodeMapper";

// Set DRACO loader path for GLB decoding (CDN fallback)
if (typeof window !== "undefined") {
  useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
}

const isLowPower = () => {
  if (typeof navigator === "undefined") return false;
  const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduced || cores <= 2 || memory <= 2;
};

function HumanModel({
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}: {
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  // Gracefully attempts loading GLB model; falls back to empty group if asset placeholder
  let scene: THREE.Group | undefined;
  try {
    const gltf = useGLTF("/models/human-draco.glb");
    scene = gltf.scene as THREE.Group;
  } catch (err) {
    try {
      const gltf = useGLTF("/models/human.glb");
      scene = gltf.scene as THREE.Group;
    } catch (e) {
      scene = undefined;
    }
  }

  useEffect(() => {
    if (!scene) return;
    scene.traverse((obj: any) => {
      if (!(obj instanceof THREE.Mesh) || !obj.material) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      const mappedId = mapNodeToPartId(obj.name) || obj.name;
      if (mappedId === selectedId) {
        mat.emissive?.setHex(0xd5f14c);
        mat.emissiveIntensity = 0.9;
      } else if (mappedId === hoveredId) {
        mat.emissive?.setHex(0x2dd4bf);
        mat.emissiveIntensity = 0.6;
      } else {
        mat.emissive?.setHex(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  }, [scene, hoveredId, selectedId]);

  return (
    <group>
      {scene && <primitive object={scene} />}
      {BODY_PARTS.map((p) => {
        let node: THREE.Object3D | undefined = scene?.getObjectByName(p.id);
        if (!node && scene) {
          scene.traverse((child) => {
            if (!node && mapNodeToPartId(child.name) === p.id) {
              node = child;
            }
          });
        }

        const worldPos = new THREE.Vector3();
        if (node) {
          node.getWorldPosition(worldPos);
        } else {
          // Default positional coordinates for fallback
          worldPos.set(0, 1, 0);
        }

        return (
          <Html key={p.id} position={[worldPos.x, worldPos.y, worldPos.z]} center>
            <button
              type="button"
              role="button"
              aria-label={`Select ${p.label}`}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(p.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(p.id)}
              className="w-4 h-4 rounded-full bg-teal-400/70 border border-teal-300 focus-visible:outline-2 focus-visible:outline-[#d5f14c] hover:bg-[#d5f14c] transition-colors"
            />
          </Html>
        );
      })}
    </group>
  );
}

export function BodySelector3D({ onSelect }: { onSelect: (p: BodyPart) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setLowPower(isLowPower());
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      const part = BODY_PARTS.find((p) => p.id === id);
      if (part) onSelect(part);
    },
    [onSelect]
  );

  if (lowPower) {
    return (
      <div className="relative w-full max-w-xl mx-auto">
        <img src="/models/human-fallback.svg" alt="Human body diagram" className="w-full" />
        {BODY_PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Select ${p.label}`}
            onClick={() => handleSelect(p.id)}
            className="absolute w-8 h-8 rounded-full bg-teal-500/60 border border-teal-300 focus-visible:outline-2 focus-visible:outline-[#d5f14c] hover:bg-[#d5f14c] transition-colors"
            style={{ top: "10%", left: "50%" }}
          />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Interactive body selector" className="relative w-full h-[68vh] bg-[#071211] rounded-2xl overflow-hidden">
      {/* Floating Tooltip */}
      {hoveredId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-sm font-semibold text-white pointer-events-none shadow-lg">
          {BODY_PARTS.find((p) => p.id === hoveredId)?.label}
        </div>
      )}

      {/* Floating Shadow Sprite */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 rounded-full bg-black/40 blur-md pointer-events-none" />

      <Canvas camera={{ position: [0, 1.6, 3], fov: 50 }} gl={{ antialias: true }} aria-hidden="true">
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1} />
        <OrbitControls enablePan={false} minDistance={1.8} maxDistance={5} />
        <Suspense fallback={null}>
          <HumanModel hoveredId={hoveredId} selectedId={selectedId} onHover={setHoveredId} onSelect={handleSelect} />
        </Suspense>
      </Canvas>
    </section>
  );
}

export default BodySelector3D;

useGLTF.preload("/models/human-draco.glb");
