// Cache only metadata from a real renderer. Creating a disposable probe context
// can race GPU startup and incorrectly suppress an otherwise usable scene.
const softwareByDocument = new WeakMap<Document, boolean>();

export function readSoftwareRenderer(): boolean | undefined {
  return typeof document === 'undefined'
    ? undefined
    : softwareByDocument.get(document);
}

export function recordSoftwareRenderer(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
): boolean {
  let software = false;
  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : '';
    software = /swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    // Missing metadata does not make an existing renderer unavailable.
  }
  if (typeof document !== 'undefined')
    softwareByDocument.set(document, software);
  return software;
}
