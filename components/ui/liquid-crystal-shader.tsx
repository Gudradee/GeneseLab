"use client";

import React, { FC, useRef, useEffect, useState } from "react";

export interface LiquidCrystalProps {
  speed?: number;
  radii?: [number, number, number];
  smoothK?: [number, number];
  className?: string;
}

export const liquidCrystalShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_radii;
uniform vec2 u_smoothK;
out vec4 fragColor;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

float mapScene(vec2 uv) {
  float t = u_time * u_speed;
  vec2 p1 = vec2(cos(t * 0.5), sin(t * 0.5)) * 0.3;
  vec2 p2 = vec2(cos(t * 0.7 + 2.1), sin(t * 0.6 + 2.1)) * 0.4;
  vec2 p3 = vec2(cos(t * 0.4 + 4.2), sin(t * 0.8 + 4.2)) * 0.35;

  float b1 = sdCircle(uv - p1, u_radii.x);
  float b2 = sdCircle(uv - p2, u_radii.y);
  float b3 = sdCircle(uv - p3, u_radii.z);

  float u12 = opSmoothUnion(b1, b2, u_smoothK.x);
  return opSmoothUnion(u12, b3, u_smoothK.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  float d = mapScene(uv);

  vec3 base = vec3(0.01 / abs(d));
  vec3 pha = 0.5 + 0.5 * cos(u_time * 0.5 + uv.xyx + vec3(0,1,2));
  vec3 col = clamp(base * pha, 0.0, 1.0);
  fragColor = vec4(col, 1.0);
}
`;

const LiquidCrystalBackground: FC<LiquidCrystalProps> = ({
  speed = 0.5,
  radii = [0.2, 0.15, 0.22],
  smoothK = [0.2, 0.25],
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setError("WebGL2 not supported");
      return;
    }

    // Use non-null assertion — gl is confirmed non-null above
    const ctx = gl as WebGL2RenderingContext;

    const compile = (type: GLenum, src: string) => {
      const s = ctx.createShader(type)!;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(s));
        ctx.deleteShader(s);
      }
      return s;
    };

    const vsSrc = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;
    const vs = compile(ctx.VERTEX_SHADER, vsSrc);
    const fs = compile(ctx.FRAGMENT_SHADER, liquidCrystalShader);

    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      console.error(ctx.getProgramInfoLog(prog));
    }

    const quadVerts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buf = ctx.createBuffer()!;
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, quadVerts, ctx.STATIC_DRAW);
    const posLoc = ctx.getAttribLocation(prog, "position");
    ctx.enableVertexAttribArray(posLoc);
    ctx.vertexAttribPointer(posLoc, 2, ctx.FLOAT, false, 0, 0);

    const uRes   = ctx.getUniformLocation(prog, "u_resolution")!;
    const uTime  = ctx.getUniformLocation(prog, "u_time")!;
    const uSpeed = ctx.getUniformLocation(prog, "u_speed")!;
    const uRadii = ctx.getUniformLocation(prog, "u_radii")!;
    const uK     = ctx.getUniformLocation(prog, "u_smoothK")!;

    const renderer = {
      render(timeMs: number) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.viewport(0, 0, w, h);
        ctx.clear(ctx.COLOR_BUFFER_BIT);
        ctx.useProgram(prog);
        ctx.uniform2f(uRes, w, h);
        ctx.uniform1f(uTime, timeMs * 0.001);
        ctx.uniform1f(uSpeed, speed);
        ctx.uniform3fv(uRadii, radii);
        ctx.uniform2fv(uK, smoothK);
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
      },
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    window.addEventListener("resize", resize);
    resize();

    let rafId: number;
    const animate = (t: number) => {
      renderer.render(t);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [speed, radii, smoothK]);

  return (
    <div
      role="region"
      aria-label="Liquid crystal shader background"
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white font-mono text-sm p-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiquidCrystalBackground;
