// src/components/BodySelector3D/BodySelector3D.tsx
// Client-only. Import via next/dynamic({ ssr: false }) in page.tsx.
// PLACEHOLDER: /public/models/human.glb must be added before 3D path works.

"use client";

import {
  Suspense, useEffect, useRef, useState, useCallback, type FC,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Html, OrbitControls, Center } from "@react-three/drei";
import * as THREE from "three";
import { BODY_PARTS, getBodyPart, type BodyPart } from "@/data/bodyParts";
import { PartTooltip }      from "./PartTooltip";
import { PartDetailsPanel } from "./PartDetailsPanel";

// ─── Capability detection ─────────────────────────────────────────────────────
function detectLowPower(): boolean {
  if (typeof window === "undefined") return false;
  const cores  = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.innerWidth < 640;
  return motion || cores <= 2 || memory <= 2 || mobile;
}

// ─── Highlight colours ────────────────────────────────────────────────────────
const COLOR_HOVER    = new THREE.Color(0x2dd4bf); // teal-400
const COLOR_SELECTED = new THREE.Color(0xd5f14c); // lime
const COLOR_OFF      = new THREE.Color(0x000000);

// ─── 3D Human model component ─────────────────────────────────────────────────
const HumanModel: FC<{
  hoveredId:  string | null;
  selectedId: string | null;
  onHover:    (id: string | null) => void;
  onSelect:   (id: string) => void;
}> = ({ hoveredId, selectedId, onHover, onSelect }) => {
  // PLACEHOLDER path — swap with actual Draco GLB
  const { scene } = useGLTF("/models/human.glb");

  // Apply emissive highlights to matching mesh nodes
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (!mat?.emissive) return;
      const name = obj.name;
      if      (name === selectedId) mat.emissive.copy(COLOR_SELECTED);
      else if (name === hoveredId)  mat.emissive.copy(COLOR_HOVER);
      else                          mat.emissive.copy(COLOR_OFF);
      mat.emissiveIntensity = name === selectedId ? 0.6 : name === hoveredId ? 0.4 : 0;
    });
  }, [scene, hoveredId, selectedId]);

  // Accessible HTML hotspots overlaid on mesh bounding-box centres
  const hotspots = BODY_PARTS.map((part) => {
    const node = scene.getObjectByName(part.id) as THREE.Mesh | undefined;
    if (!node) return null;

    const box = new THREE.Box3().setFromObject(node);
    const center = new THREE.Vector3();
    box.getCenter(center);

    return (
      <Html key={part.id} position={[center.x, center.y + 0.05, center.z]} center occlude>
        <button
          type="button"
          aria-label={`Select ${part.label} — ${part.subtitle}`}
          tabIndex={0}
          onMouseEnter={() => onHover(part.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(part.id)}
          onBlur={() => onHover(null)}
          onClick={() => onSelect(part.id)}
          className={[
            "w-4 h-4 rounded-full border-2 transition-all cursor-pointer",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]",
            selectedId === part.id
              ? "bg-[#d5f14c] border-[#d5f14c] scale-125"
              : hoveredId === part.id
              ? "bg-teal-400 border-teal-300 scale-110"
              : "bg-teal-900/70 border-teal-600 hover:bg-teal-400",
          ].join(" ")}
        />
      </Html>
    );
  });

  return (
    <Center>
      <primitive
        object={scene}
        // Pointer events on mesh nodes
        onPointerOver={(e: React.PointerEvent & { object: THREE.Object3D }) => {
          e.stopPropagation();
          const match = BODY_PARTS.find((p) => p.id === e.object.name);
          if (match) onHover(match.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e: React.MouseEvent & { object: THREE.Object3D }) => {
          e.stopPropagation();
          const match = BODY_PARTS.find((p) => p.id === e.object.name);
          if (match) onSelect(match.id);
        }}
      />
      {hotspots}
    </Center>
  );
};

// Preload GLB (non-blocking; only downloaded when component mounts)
useGLTF.preload("/models/human.glb");

// ─── SVG fallback (mobile / low-power / no-JS) ────────────────────────────────
const SVGFallback: FC<{
  hoveredId:  string | null;
  selectedId: string | null;
  onHover:    (id: string | null) => void;
  onSelect:   (id: string) => void;
}> = ({ hoveredId, selectedId, onHover, onSelect }) => {
  return (
    <div
      className="relative w-full max-w-[280px] mx-auto"
      aria-label="Body region selector — tap a highlighted area"
    >
      {/*
        Inline the SVG so we can bind React events to data-part elements.
        The file at /public/models/human-fallback.svg is the visual reference;
        hotspot positions here must match that SVG viewBox="0 0 200 500".
      */}
      <svg
        viewBox="0 0 200 500"
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* ── silhouette shapes (non-interactive, decorative) ─────────── */}
        <ellipse cx="100" cy="35" rx="24" ry="28" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="91" y="60" width="18" height="18" rx="4" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="68" y="78" width="64" height="110" rx="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="38" y="80" width="26" height="70" rx="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="136" y="80" width="26" height="70" rx="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="40" y="155" width="22" height="60" rx="9" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="138" y="155" width="22" height="60" rx="9" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <ellipse cx="51" cy="226" rx="14" ry="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <ellipse cx="149" cy="226" rx="14" ry="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="72" y="192" width="28" height="90" rx="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="101" y="192" width="28" height="90" rx="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="73" y="286" width="24" height="80" rx="8" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="103" y="286" width="24" height="80" rx="8" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <ellipse cx="82" cy="374" rx="16" ry="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
        <ellipse cx="118" cy="374" rx="16" ry="10" fill="#1e3a38" stroke="#2dd4bf" strokeWidth="1.5" />
      </svg>

      {/* ── accessible interactive hotspot buttons ────────────────────── */}
      {/* Positions as % of 200×500 viewBox → relative to container div */}
      {(
        [
          { id: "head",     cx: 100, cy: 35,  rx: 24, ry: 28 },
          { id: "neck",     cx: 100, cy: 69,  rx: 12, ry: 10 },
          { id: "shoulder", cx: 51,  cy: 93,  rx: 20, ry: 14 },
          { id: "elbow",    cx: 48,  cy: 152, rx: 14, ry: 12 },
          { id: "wrist",    cx: 51,  cy: 218, rx: 14, ry: 10 },
          { id: "spine",    cx: 100, cy: 130, rx: 12, ry: 40 },
          { id: "hip",      cx: 86,  cy: 200, rx: 20, ry: 12 },
          { id: "knee",     cx: 83,  cy: 285, rx: 15, ry: 12 },
          { id: "ankle",    cx: 81,  cy: 365, rx: 13, ry: 10 },
        ] as const
      ).map(({ id, cx, cy, rx, ry }) => {
        const isHovered  = hoveredId  === id;
        const isSelected = selectedId === id;
        const part = getBodyPart(id)!;
        return (
          <button
            key={id}
            type="button"
            aria-label={`${part.label} — ${part.subtitle}`}
            aria-pressed={isSelected}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(id)}
            className="absolute focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-full transition-all"
            style={{
              left:      `${((cx - rx) / 200) * 100}%`,
              top:       `${((cy - ry) / 500) * 100}%`,
              width:     `${(rx * 2 / 200) * 100}%`,
              height:    `${(ry * 2 / 500) * 100}%`,
              background: isSelected
                ? "rgba(213,241,76,0.45)"
                : isHovered
                ? "rgba(45,212,191,0.4)"
                : "rgba(45,212,191,0.15)",
              border: `1.5px solid ${isSelected ? "#d5f14c" : "#2dd4bf"}`,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BodySelector3D({
  onBook,
}: {
  onBook: (partId: string) => void;
}) {
  const [lowPower,   setLowPower]   = useState(true); // default true (SSR safe)
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<BodyPart | null>(null);

  // Re-evaluate after hydration
  useEffect(() => { setLowPower(detectLowPower()); }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setActivePart(getBodyPart(id) ?? null);
  }, []);

  const handleClose = useCallback(() => {
    setActivePart(null);
    setSelectedId(null);
  }, []);

  const handleBook = useCallback((partId: string) => {
    handleClose();
    onBook(partId);
  }, [handleClose, onBook]);

  const hoveredPart = getBodyPart(hoveredId ?? "");

  return (
    <>
      <section
        aria-label="Interactive body region selector"
        className="relative w-full rounded-3xl overflow-hidden bg-[#0c1a18] border border-slate-800/80"
        style={{ minHeight: lowPower ? "auto" : "70vh" }}
      >
        {/* Floating tooltip */}
        <PartTooltip label={hoveredPart?.label ?? null} />

        {lowPower ? (
          // ── SVG hotspot map (mobile / prefers-reduced-motion) ──────────────
          <div className="py-10 px-4">
            <p className="text-center text-xs text-slate-500 font-mono mb-6 uppercase tracking-widest">
              Tap a region to explore conditions
            </p>
            <SVGFallback
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          </div>
        ) : (
          // ── R3F 3D Canvas ──────────────────────────────────────────────────
          <Canvas
            camera={{ position: [0, 1.2, 3.5], fov: 45 }}
            shadows={false}          // off for perf; PROGRESSION: enable on high-end
            gl={{ antialias: false, powerPreference: "high-performance" }}
            aria-hidden="true"       // decorative; keyboard users use Html hotspot buttons
            className="w-full h-full"
            style={{ height: "70vh" }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 4, 3]} intensity={1.2} />
            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.5}
              minDistance={2}
              maxDistance={5}
              enableDamping
              dampingFactor={0.08}
            />
            <Suspense fallback={null}>
              <HumanModel
                hoveredId={hoveredId}
                selectedId={selectedId}
                onHover={setHoveredId}
                onSelect={handleSelect}
              />
            </Suspense>
          </Canvas>
        )}
      </section>

      {/* Slide-over panel (outside section so it covers full viewport) */}
      <PartDetailsPanel
        part={activePart}
        onClose={handleClose}
        onBook={handleBook}
      />
    </>
  );
}
