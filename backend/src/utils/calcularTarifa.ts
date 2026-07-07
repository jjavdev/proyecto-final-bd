// Algoritmo de calculo de tarifa para los traslados.
// Tarifa base ($3.00) + costo por kilometro recorrido ($1.50/km).
// El resultado se redondea a 2 decimales.

const TARIFA_BASE = 3.0
const COSTO_POR_KM = 1.5

export function calcularTarifa(distanciaKm: number): number {
  const total = TARIFA_BASE + distanciaKm * COSTO_POR_KM
  return Math.round(total * 100) / 100
}
