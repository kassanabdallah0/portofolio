'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/** Software GPUs share the CPU with the page. Wait for completed work between
 * steady-state frames, leaving room for input and the independent simulation
 * clock. Explicit stage/view invalidation can still render promptly. Hardware
 * rendering never uses this scheduler.
 */
export default function SoftwareRenderBudget({
  running,
}: {
  running: boolean;
}) {
  const { gl, invalidate } = useThree();
  const pending = useRef<{
    timer: ReturnType<typeof setTimeout> | null;
    fence: WebGLSync | null;
  }>({ timer: null, fence: null });
  useEffect(() => {
    const state = pending.current,
      context = gl.getContext() as WebGL2RenderingContext;
    invalidate();
    return () => {
      if (state.timer !== null) clearTimeout(state.timer);
      if (state.fence) context.deleteSync(state.fence);
      state.timer = null;
      state.fence = null;
    };
  }, [gl, invalidate, running]);
  // Positive priority owns rendering; actor/rig/projection callbacks run first.
  useFrame(({ scene, camera }) => {
    const context = gl.getContext() as WebGL2RenderingContext,
      state = pending.current;
    if (state.timer !== null) clearTimeout(state.timer);
    if (state.fence) context.deleteSync(state.fence);
    state.fence = null;
    gl.render(scene, camera);
    if (!running) return;
    state.fence = context.fenceSync(context.SYNC_GPU_COMMANDS_COMPLETE, 0);
    context.flush();
    const next = () => {
      state.timer = null;
      if (context.isContextLost()) return;
      if (
        state.fence &&
        context.clientWaitSync(state.fence, 0, 0) === context.TIMEOUT_EXPIRED
      ) {
        state.timer = setTimeout(next, 32);
        return;
      }
      if (state.fence) context.deleteSync(state.fence);
      state.fence = null;
      invalidate();
    };
    state.timer = setTimeout(next, 80);
  }, 1);
  return null;
}
