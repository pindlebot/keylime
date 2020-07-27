import * as Geometry from './Geometry'

const w = 1024 / 2
const h = 768 / 2

it ('fromGeometricSpace', () => {
  const [x, y] = Geometry.fromGeometricSpace(0, 0)
  expect(x).toBe(w)
  expect(y).toBe(h)
})

it ('toGeometricSpace', () => {
  const [x1, y1] = Geometry.toGeometricSpace(0, 0)
  expect(x1).toBe(-1 * w)
  expect(y1).toBe(-1 * h)
  const [x2, y2] = Geometry.toGeometricSpace(w * 2, h * 2)
  expect(x2).toBe(512)
  expect(y2).toBe(384)
  const [x3, y3] = Geometry.toGeometricSpace(w, h)
  expect(x3).toBe(0)
  expect(y3).toBe(0)
})