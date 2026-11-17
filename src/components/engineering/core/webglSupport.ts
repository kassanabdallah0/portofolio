type WebGLSupport = Readonly<{ available: boolean; software: boolean }>;

// Feature detection belongs to the document, not to each scene instance.
// Reopening an exhibit must not synchronously create another GPU context just
// to discover the same renderer. A fresh document gets its own detection result,
// including documents whose browser or test setup deliberately disables WebGL.
const supportByDocument = new WeakMap<Document, WebGLSupport>();

export function getWebGLSupport(): WebGLSupport {
  if (typeof document === 'undefined')
    return { available: false, software: false };
  const cached = supportByDocument.get(document);
  if (cached) return cached;

  let gl: WebGL2RenderingContext | null = null;
  let support: WebGLSupport = { available: false, software: false };
  try {
    const probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    gl = probe.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer =
      gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    support = {
      available: Boolean(gl),
      software: /swiftshader|llvmpipe|softpipe|software/i.test(renderer),
    };
  } catch {
    // Keep the complete lightweight illustration when feature probing fails.
  } finally {
    // Release the temporary context even if a renderer query throws. Only the
    // small capability result is cached; never retain the canvas or context.
    try {
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      // Context loss can race browser/GPU teardown; it is already unavailable.
    }
  }
  supportByDocument.set(document, support);
  return support;
}
