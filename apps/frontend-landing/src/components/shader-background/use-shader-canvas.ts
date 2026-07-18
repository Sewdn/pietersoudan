import { useEffect, useState, type RefObject } from "react";

import {
  FRAGMENT_SHADERS,
  VERTEX_SHADER,
  type ShaderBackgroundVariant,
} from "#/components/shader-background/shaders";

type UseShaderCanvasOptions = {
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly variant: ShaderBackgroundVariant;
  readonly active?: boolean;
  readonly trackMouse?: boolean;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, fragmentSource: string) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export type ShaderCanvasStatus = "pending" | "ready" | "failed";

export function useShaderCanvas({
  canvasRef,
  variant,
  active = true,
  trackMouse = true,
}: UseShaderCanvasOptions) {
  const [status, setStatus] = useState<ShaderCanvasStatus>("pending");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) {
      setStatus("pending");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setStatus("failed");
      return;
    }

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setStatus("failed");
      return;
    }

    const program = createProgram(gl, FRAGMENT_SHADERS[variant]);
    if (!program) {
      setStatus("failed");
      return;
    }

    gl.useProgram(program);

    if (variant === "grid-dark" || variant === "scanline-grid") {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    setStatus("ready");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const syncSize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    syncSize();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncSize) : null;
    resizeObserver?.observe(canvas);

    const onMouseMove = (event: MouseEvent) => {
      if (!trackMouse) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }
      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = 1 - (event.clientY - rect.top) / rect.height;
      mouse.x = normalizedX * canvas.width;
      mouse.y = normalizedY * canvas.height;
    };

    if (trackMouse) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    let frameId = 0;
    let running = true;

    const render = (time: number) => {
      if (!running) {
        return;
      }
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (timeLocation) {
        gl.uniform1f(timeLocation, time * 0.001);
      }
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
      if (mouseLocation) {
        gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      running = false;
      setStatus("pending");
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      if (trackMouse) {
        window.removeEventListener("mousemove", onMouseMove);
      }
      gl.deleteProgram(program);
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
    };
  }, [active, canvasRef, trackMouse, variant]);

  return status;
}
