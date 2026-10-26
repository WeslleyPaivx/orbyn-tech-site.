import {
  CanvasTexture,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Vector2,
} from 'three';
import type { Flavor } from './brand';
import { createLabelCanvas } from './label';

/**
 * Lata de 473 ml modelada por código: corpo com o rótulo do sabor,
 * pescoço e tampa em alumínio escovado. Altura ≈ 2,2 unidades.
 */
export function buildCan(flavor: Flavor, anisotropy = 4): Group {
  const can = new Group();
  const R = 0.5;
  const H = 1.9;

  const label = new CanvasTexture(createLabelCanvas(flavor));
  label.colorSpace = SRGBColorSpace;
  label.anisotropy = anisotropy;
  // O centro do rótulo (frente) fica voltado para a câmera
  label.offset.x = 0.5;
  label.wrapS = RepeatWrapping;

  const body = new Mesh(
    new CylinderGeometry(R, R, H, 64, 1, true),
    new MeshStandardMaterial({ map: label, metalness: 0.55, roughness: 0.32 }),
  );
  can.add(body);

  const aluminum = new MeshStandardMaterial({ color: '#C8CDD4', metalness: 1, roughness: 0.28 });
  // Ombro, pescoço e borda da tampa (perfil girado)
  const top = new LatheGeometry(
    [
      new Vector2(R, 0),
      new Vector2(R * 0.985, 0.06),
      new Vector2(R * 0.86, 0.2),
      new Vector2(R * 0.8, 0.26),
      new Vector2(R * 0.82, 0.29),
      new Vector2(R * 0.78, 0.3),
      new Vector2(R * 0.7, 0.27),
      new Vector2(0, 0.25),
    ],
    64,
  );
  const topMesh = new Mesh(top, aluminum);
  topMesh.position.y = H / 2;
  can.add(topMesh);

  const bottom = new LatheGeometry(
    [new Vector2(0, -0.1), new Vector2(R * 0.72, -0.12), new Vector2(R * 0.9, -0.08), new Vector2(R, 0)],
    64,
  );
  const bottomMesh = new Mesh(bottom, aluminum);
  bottomMesh.position.y = -H / 2;
  can.add(bottomMesh);

  // Anel de abertura
  const tab = new Mesh(new CylinderGeometry(0.11, 0.11, 0.015, 24), aluminum);
  tab.position.set(0.12, H / 2 + 0.255, 0);
  tab.rotation.z = 0.08;
  can.add(tab);

  return can;
}
