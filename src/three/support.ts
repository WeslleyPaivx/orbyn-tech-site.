/**
 * Verificações leves (sem importar o Three.js): ficam no pacote principal para decidir,
 * antes de baixar a cena 3D, se ela deve ser carregada e com qual qualidade.
 */
export type Quality = 'high' | 'medium' | 'low';

/** O navegador oferece WebGL 2 (exigido pelos shaders)? */
export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const ok = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

type NavigatorExtras = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Escolhe a densidade da cena pelo tipo de aparelho. A cena ainda se ajusta sozinha se ficar lenta. */
export function detectQuality(): Quality {
  const nav = navigator as NavigatorExtras;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const small = window.innerWidth < 768;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  if (nav.connection?.saveData) return 'low';
  if (small || coarse) return cores >= 6 && memory >= 4 ? 'medium' : 'low';
  if (cores < 4 || memory < 4) return 'medium';
  return 'high';
}
