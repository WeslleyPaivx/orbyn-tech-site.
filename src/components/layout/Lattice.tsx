import { useEffect } from 'react';
import { startPointerField } from '../../motion/pointerField';

/**
 * Grade técnica que reage ao cursor, nas seções escuras.
 *
 * A ordem dos dois filhos é estrutural, não estética: o facho vem PRIMEIRO e
 * as barras depois, por cima. As barras pintando sobre a luz é o efeito
 * inteiro — o brilho só sobrevive dentro das células. Invertendo, vira uma
 * lanterna atravessando a página, que é outra coisa.
 */
export function Lattice() {
  useEffect(() => startPointerField(), []);

  return (
    <div className="lattice" aria-hidden="true">
      <div className="lattice-beam" />
      <div className="lattice-bars" />
    </div>
  );
}
