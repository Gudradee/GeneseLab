"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  className?: string;
}

export default function InteractiveStarfieldShader({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.error("WebGL not supported", err);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      varying vec2 vTextureCoord;

      void mainImage(out vec4 O, in vec2 fragCoord) {
        O = vec4(0.0, 0.0, 0.0, 1.0);
        vec2 b = vec2(0.0, 0.2);
        vec2 p;

        for(int i = 0; i < 20; i++) {
          float fi = float(i) + 1.0;

          float angle = fi;
          float c = cos(angle); float s = sin(angle);
          mat2 R = mat2(c, -s, s, c);

          float angle2 = fi + 33.0;
          float c2 = cos(angle2); float s2 = sin(angle2);
          mat2 R2 = mat2(c2, -s2, s2, c2);

          vec2 coord = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
          vec2 frac_coord = fract(coord * R2) - 0.5;
          p = R * frac_coord;
          vec2 clamped_p = clamp(p, -b, b);

          float len = length(clamped_p - p);
          if (len > 0.0) {
            vec4 star = 1e-3 / len * (cos(p.y / 0.1 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
            O += star;
          }
        }

        // Blue tint for classification page
        O.rgb = mix(O.rgb, vec3(0.1, 0.3, 1.0), 0.25);

        // Dim the center softly
        vec2 center = iResolution.xy * 0.5;
        float dist = distance(fragCoord, center);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float centerDim = smoothstep(radius * 0.3, radius * 0.65, dist);
        O.rgb = mix(O.rgb * 0.15, O.rgb, centerDim);
      }

      void main() {
        vec4 color;
        mainImage(color, vTextureCoord * iResolution);
        gl_FragColor = color;
      }
    `;

    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ backgroundColor: "#000" }}
      aria-hidden="true"
    />
  );
}
