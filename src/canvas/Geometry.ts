import config from './config'
import Node from './model/Node'

export enum GeometryVariant {
  FILL = 'fill',
  STROKE = 'stroke'
}

export type DrawCircleOptions = {
  x: number,
  y: number,
  radius: number,
  color: string,
  style?: {
    borderWidth?: number
  }
}

export function baseDrawCircle (
  context: CanvasRenderingContext2D,
  variant: GeometryVariant,
  options: DrawCircleOptions
) {
  const { x, y, radius, color } = options

  context[`${variant}Style`] = color
  if (options?.style?.borderWidth) {
    context.lineWidth = options?.style?.borderWidth
  }
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context[variant]()
}

export function drawCircle (
  context: CanvasRenderingContext2D,
  options: DrawCircleOptions & { variant: GeometryVariant }
) {
  const { variant, ...rest } = options
  return baseDrawCircle(context, variant, rest)
}

export function rotate (angle, x, y) {
  const dx = x * Math.cos(angle) - y * Math.sin(angle)
  const dy = x * Math.sin(angle) + y * Math.cos(angle)
  return [dx, dy]
}

export function getEdgeVector (src, dst) {
  const dx = Math.floor(dst[0] - src[0])
  const dy = Math.floor(dst[1] - src[1])
  const theta = Math.atan2(dy, dx)
  const decompX = (config.Vertex.radius + 10) * Math.cos(theta)
  const decompY = (config.Vertex.radius + 10) * Math.sin(theta)
  const srcX = src[0] + decompX
  const srcY = src[1] + decompY
  const dstX = dst[0] - decompX
  const dstY = dst[1] - decompY
  return [[srcX, srcY], [dstX, dstY]]
}
//    |
// ___|___
//    |
//    |

function getSemiDimensions () {
  return [
    window.innerWidth / 2,
    window.innerHeight / 2
  ]
}

export function fromGeometricSpace (x, y) {
  const [w, h] = getSemiDimensions()
  const cX = x + w
  const isNegative = Math.abs(y) !== y
  const cY = isNegative ? (h + (-1 * y)) : h - y
  return [cX, cY].map(x => x * 2)
}

export function toGeometricSpace (x, y) {
  const [w, h] = getSemiDimensions()
  const cX = x - w
  const isNegative = y > h

  const cY = isNegative ? (-1 * (y - h)) : (h - y)
  return [cX, cY].map(x => x)
}

// export function radialPositions (tree: { [key: string]: TreeNode }, vertex: TreeNode, alpha : number = 0, beta : number = 2 * Math.PI, out = {}) {
//   let theta = alpha
//   const depth = vertex.depth
//   const R = 100
//   const r = R + (10 * (depth + 1))
//   const kappa = vertex.leaves

//   const children = vertex.childKeys.map(key => tree[key])

//   children.forEach((child, i)=> {
//     const lambda = child.leaves
//     const mu = theta + ((lambda / kappa) * (beta - alpha))
//     const x = r * Math.cos((theta + mu) / 2)
//     const y = r * Math.sin((theta + mu) / 2)
//     tree[child.id].x = x
//     tree[child.id].y = y
//     if (child.childKeys.length) {
//       radialPositions(tree, child, theta, mu, out)
//     }
//     theta = mu
//   })
//   return out
// }

export function getAngle (parent: Node, i): number {
  const count = (parent.childKeys || []).length
  const parentAngleRange = parent.getAngleRange()
  const centerAdjust = (-1 * parentAngleRange + parentAngleRange / count) / 2
  const angle = parent.angle + ((parentAngleRange / count) * i) + centerAdjust
  return angle
}

export function rectangle (ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  this.ctx.beginPath()
  this.ctx.moveTo(x+r, y)
  this.ctx.arcTo(x+w, y,   x+w, y+h, r)
  this.ctx.arcTo(x+w, y+h, x,   y+h, r)
  this.ctx.arcTo(x,   y+h, x,   y,   r)
  this.ctx.arcTo(x,   y,   x+w, y,   r)
  this.ctx.closePath()
}