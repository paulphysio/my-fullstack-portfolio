"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const COUNT = 100;
const COLS = 10;
const ROWS = 10;
const GRID_SPACING = 2.55;
const HELIX_RADIUS = 2.3;
const HELIX_TURNS = 1.6;
const HELIX_HEIGHT = 6.2;

// strand counts that divide evenly into 12 panes
const STRAND_OPTIONS = [1, 2, 3, 4, 6];

// icy cyan -> warm coral, walked across the 12-item sequence
const COLOR_START = new THREE.Color("#7fd8ff");
const COLOR_END = new THREE.Color("#ff6b4a");

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function gridTransform(i) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = (col - (COLS - 1) / 2) * GRID_SPACING;
  const y = ((ROWS - 1) / 2 - row) * GRID_SPACING;
  const position = new THREE.Vector3(x, y, 0);
  const euler = new THREE.Euler(0, 0, 0);
  return { position, quaternion: new THREE.Quaternion().setFromEuler(euler) };
}

// panes are dealt round-robin across strands (i % strands) so consecutive
// numbers sit on different strands, like base pairs climbing a DNA ladder
function helixTransform(i, strands) {
  const perStrand = COUNT / strands;
  const strand = i % strands;
  const level = Math.floor(i / strands);
  const t = perStrand === 1 ? 0 : level / (perStrand - 1);

  const angle = level * ((Math.PI * 2 * HELIX_TURNS) / perStrand) + strand * ((Math.PI * 2) / strands);
  const x = HELIX_RADIUS * Math.cos(angle);
  const z = HELIX_RADIUS * Math.sin(angle);
  const y = -HELIX_HEIGHT / 2 + t * HELIX_HEIGHT;

  const position = new THREE.Vector3(x, y, z);
  const euler = new THREE.Euler(0, Math.PI / 2 - angle, 0);
  return { position, quaternion: new THREE.Quaternion().setFromEuler(euler), level, strand, perStrand };
}

function makeLabelSprite(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 128, 128);
  ctx.font = "500 44px 'SFMono-Regular', Consolas, monospace";
  ctx.fillStyle = "rgba(230, 237, 243, 0.85)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.34, 0.34, 0.34);
  return sprite;
}

export default function HelixGrid() {
  const mountRef = useRef(null);
  const [mode, setMode] = useState("helix"); // "grid" | "helix"
  const modeRef = useRef(mode);
  const [strands, setStrands] = useState(2);
  const strandsRef = useRef(strands);
  const [autoSpin, setAutoSpin] = useState(true);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    strandsRef.current = strands;
  }, [strands]);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0d12, 0.045);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(5.2, 2.6, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0d12, 1);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 0, 0);

    // lighting — soft key + rim, tuned for translucent glass panes
    const key = new THREE.DirectionalLight(0xbfe8ff, 1.1);
    key.position.set(4, 5, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9a7a, 0.55);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0x223040, 0.9));

    // faint ground reference ring
    const ringGeo = new THREE.RingGeometry(HELIX_RADIUS + 0.4, HELIX_RADIUS + 0.42, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1c242f,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -HELIX_HEIGHT / 2 - 0.3;
    scene.add(ring);

    const paneGeo = new THREE.PlaneGeometry(1, 1);
    const panes = [];
    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      const color = COLOR_START.clone().lerp(COLOR_END, t);

      const material = new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.32,
        roughness: 0.15,
        metalness: 0.05,
        transmission: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(paneGeo, material);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(paneGeo),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 })
      );
      mesh.add(edges);

      const label = makeLabelSprite(String(i + 1).padStart(2, "0"));
      label.position.set(0.42, 0.42, 0.02);
      mesh.add(label);

      const start = helixTransform(i, strandsRef.current);
      mesh.position.copy(start.position);
      mesh.quaternion.copy(start.quaternion);
      mesh.scale.setScalar(1);

      group.add(mesh);
      panes.push({
        mesh,
        from: { position: start.position.clone(), quaternion: start.quaternion.clone() },
        to: { position: start.position.clone(), quaternion: start.quaternion.clone() },
      });
    }

    // rung pool — the ladder struts that appear between strands (DNA look).
    // exactly COUNT struts exist at any strand-count > 1 (perStrand levels x strands = COUNT).
    const rungPool = [];
    for (let k = 0; k < COUNT; k++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x9fb3c2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      line.visible = false;
      group.add(line);
      rungPool.push(line);
    }

    // stagger + quintic ease — panes cascade into place rather than
    // snapping together in lockstep
    const PER_PANE_MS = 1300;
    const STAGGER_MS = 55;
    let transitionStart = null;
    let currentAppliedMode = modeRef.current;
    let currentAppliedStrands = strandsRef.current;

    function applyTargets(targetMode, targetStrands) {
      transitionStart = performance.now();
      panes.forEach((p, i) => {
        const target = targetMode === "grid" ? gridTransform(i) : helixTransform(i, targetStrands);
        p.from.position.copy(p.mesh.position);
        p.from.quaternion.copy(p.mesh.quaternion);
        p.to.position.copy(target.position);
        p.to.quaternion.copy(target.quaternion);
      });
    }

    applyTargets(currentAppliedMode, currentAppliedStrands);

    let raf;
    const clock = new THREE.Clock();
    const totalDuration = PER_PANE_MS + STAGGER_MS * (COUNT - 1);
    let rungOpacityTarget = currentAppliedMode === "helix" && currentAppliedStrands > 1 ? 1 : 0;
    let rungOpacityCurrent = rungOpacityTarget;

    function animate() {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const wantsMode = modeRef.current;
      const wantsStrands = strandsRef.current;
      if (wantsMode !== currentAppliedMode || wantsStrands !== currentAppliedStrands) {
        currentAppliedMode = wantsMode;
        currentAppliedStrands = wantsStrands;
        applyTargets(currentAppliedMode, currentAppliedStrands);
        rungOpacityTarget = currentAppliedMode === "helix" && currentAppliedStrands > 1 ? 1 : 0;
      }

      let settled = true;
      if (transitionStart !== null) {
        const elapsed = performance.now() - transitionStart;
        panes.forEach((p, i) => {
          const local = elapsed - i * STAGGER_MS;
          const raw = Math.min(Math.max(local / PER_PANE_MS, 0), 1);
          if (raw < 1) settled = false;
          const e = easeInOutQuint(raw);
          p.mesh.position.lerpVectors(p.from.position, p.to.position, e);
          p.mesh.quaternion.slerpQuaternions(p.from.quaternion, p.to.quaternion, e);
          // gentle pop mid-flight so the motion reads as a lively arc, not a slide
          const pop = 1 + 0.16 * Math.sin(Math.PI * e) * (1 - Math.abs(raw - 0.5) * 0.6);
          p.mesh.scale.setScalar(pop);
        });
        if (elapsed >= totalDuration) {
          transitionStart = null;
          panes.forEach((p) => p.mesh.scale.setScalar(1));
        }
      }

      // rungs: reposition every frame between neighbouring strands at the
      // same helix level, and crossfade their opacity in/out with the shape
      rungOpacityCurrent += (rungOpacityTarget - rungOpacityCurrent) * Math.min(delta * 6, 1);
      const showRungs = currentAppliedStrands > 1 && rungOpacityCurrent > 0.01;
      const perStrand = COUNT / currentAppliedStrands;
      for (let k = 0; k < COUNT; k++) {
        const line = rungPool[k];
        if (!showRungs || k >= COUNT) {
          line.visible = false;
          continue;
        }
        const level = Math.floor(k / currentAppliedStrands);
        const strand = k % currentAppliedStrands;
        const a = level * currentAppliedStrands + strand;
        const b = level * currentAppliedStrands + ((strand + 1) % currentAppliedStrands);
        if (level >= perStrand || a >= COUNT || b >= COUNT || a === b) {
          line.visible = false;
          continue;
        }
        line.visible = true;
        line.material.opacity = 0.35 * rungOpacityCurrent;
        const posAttr = line.geometry.attributes.position;
        posAttr.setXYZ(0, panes[a].mesh.position.x, panes[a].mesh.position.y, panes[a].mesh.position.z);
        posAttr.setXYZ(1, panes[b].mesh.position.x, panes[b].mesh.position.y, panes[b].mesh.position.z);
        posAttr.needsUpdate = true;
      }

      if (autoSpinRef.current) {
        group.rotation.y += delta * 0.12;
      }

      controls.update();
      renderer.render(scene, camera);
    }

    const autoSpinRef = { current: autoSpin };
    animate();

    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    mount._setAutoSpin = (v) => {
      autoSpinRef.current = v;
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
      controls.dispose();
      panes.forEach((p) => {
        p.mesh.geometry.dispose?.();
        p.mesh.material.dispose?.();
      });
      rungPool.forEach((line) => {
        line.geometry.dispose?.();
        line.material.dispose?.();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mountRef.current?._setAutoSpin?.(autoSpin);
  }, [autoSpin]);

  const mono = "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace";
  const display = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif";

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />

      {/* HUD — top left */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 32,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Helix / Grid
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: mono,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--text-dim)",
            textTransform: "uppercase",
          }}
        >
          12 panes · {strands > 1 ? `${strands} strands` : "1 strand"} · state:{" "}
          <span style={{ color: "var(--accent)" }}>{mode}</span>
        </div>
      </div>

      {/* Controls — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        {/* strand selector — only meaningful once you're in helix mode,
            but you can pre-select it and it applies live */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: 4,
            borderRadius: 999,
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {STRAND_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setStrands(n)}
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: "0.05em",
                padding: "8px 13px",
                borderRadius: 999,
                border: "none",
                background: strands === n ? "var(--accent)" : "transparent",
                color: strands === n ? "#0a0d12" : "var(--text-dim)",
                cursor: "pointer",
                fontWeight: strands === n ? 700 : 400,
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              title={n === 2 ? "2 strands — DNA" : `${n} strand${n > 1 ? "s" : ""}`}
            >
              {n}
              {n === 2 ? " · dna" : ""}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => setMode((m) => (m === "grid" ? "helix" : "grid"))}
            style={{
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid var(--accent)",
              background: "rgba(127, 216, 255, 0.08)",
              color: "var(--accent)",
              cursor: "pointer",
              transition: "background 0.2s ease, transform 0.15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Shift to {mode === "grid" ? "Helix" : "Grid"}
          </button>

          <button
            onClick={() => setAutoSpin((s) => !s)}
            style={{
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.02)",
              color: autoSpin ? "var(--text)" : "var(--text-dim)",
              cursor: "pointer",
            }}
          >
            Auto-spin: {autoSpin ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 32,
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--text-dim)",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        drag to rotate · scroll to zoom
      </div>
    </main>
  );
}
