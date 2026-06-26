// Algoritmo de cálculo de tarifa (discrecional del equipo)
// Ejemplo: tarifa fija por zona + distancia

const TARIFA_BASE = 3.0
const COSTO_POR_KM = 1.5

export function calcularTarifa(distanciaKm: number): number {
  const total = TARIFA_BASE + distanciaKm * COSTO_POR_KM
  return Math.round(total * 100) / 100
}
