export type ShaderBackgroundVariant = "grid-light" | "grid-dark" | "scanline-grid";

export const VERTEX_SHADER = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/** Stitch ANIMATION_5 — subtle architectural grid on a light field. */
export const GRID_LIGHT_FRAGMENT = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
  vec2 uv = v_texCoord;
  vec2 mouse = u_mouse / u_resolution;

  float grid = sin(uv.x * 50.0) * sin(uv.y * 50.0);
  grid = smoothstep(0.98, 1.0, grid);

  float line = sin(uv.y * 100.0 + u_time * 2.0) * 0.02;
  float dist = length(uv - mouse);
  float glow = smoothstep(0.2, 0.0, dist) * 0.05;

  vec3 color = vec3(0.98);
  color -= grid * 0.03;
  color += line;
  color += glow;

  gl_FragColor = vec4(color, 1.0);
}`;

/** Dark inverse — white grid lines and scanlines composited over black sections. */
export const GRID_DARK_FRAGMENT = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
  vec2 uv = v_texCoord;
  vec2 mouse = u_mouse / u_resolution;

  float grid = sin(uv.x * 50.0) * sin(uv.y * 50.0);
  grid = smoothstep(0.98, 1.0, grid);

  float line = abs(sin(uv.y * 100.0 + u_time * 1.6)) * 0.018;
  float dist = length(uv - mouse);
  float glow = smoothstep(0.22, 0.0, dist) * 0.08;

  float alpha = grid * 0.07 + line + glow;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}`;

/** Emphasised scanline grid for full-bleed focus bands. */
export const SCANLINE_GRID_FRAGMENT = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
  vec2 uv = v_texCoord;
  vec2 pixel = uv * u_resolution;
  vec2 mouse = u_mouse / u_resolution;

  float gridX = smoothstep(0.985, 1.0, sin(pixel.x * 3.14159265 / 50.0));
  float gridY = smoothstep(0.985, 1.0, sin(pixel.y * 3.14159265 / 50.0));
  float grid = max(gridX, gridY);

  float scan = sin(uv.y * 120.0 + u_time * 2.4) * 0.012;
  float sweep = sin(uv.x * 8.0 - u_time * 0.35) * 0.008;
  float dist = length(uv - mouse);
  float glow = smoothstep(0.25, 0.0, dist) * 0.04;

  float alpha = grid * 0.09 + abs(scan) + abs(sweep) + glow;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}`;

export const FRAGMENT_SHADERS: Record<ShaderBackgroundVariant, string> = {
  "grid-light": GRID_LIGHT_FRAGMENT,
  "grid-dark": GRID_DARK_FRAGMENT,
  "scanline-grid": SCANLINE_GRID_FRAGMENT,
};

export const SHADER_FALLBACK_CLASS: Record<ShaderBackgroundVariant, string> = {
  "grid-light": "shader-fallback-grid-light",
  "grid-dark": "shader-fallback-grid-dark",
  "scanline-grid": "shader-fallback-scanline-grid",
};
