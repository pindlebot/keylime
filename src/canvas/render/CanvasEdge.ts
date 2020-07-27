import * as config from '../config'
import * as Geometry from '../Geometry'
import NetworkState from '../NetworkState'
import { setTypography } from './typography'

class CanvasEdge {
  ctx: CanvasRenderingContext2D
  state: NetworkState

  constructor(ctx, state) {
    this.ctx = ctx
    this.state = state
  }

  getControlPoint (line, i, n) {
    const [srcX, srcY, dstX, dstY] = line
    if (n === 1) {
      return [
        srcX + ((dstX - srcX) / 2),
        srcY + ((dstY - srcY) / 2)
      ]
    }
    const dx = dstX - srcX
    const dy = dstY - srcY
    const slope = (-1 / (dy / dx))
    const ratio = (i + 1) / n
    const K = 300
    const d = (-1 * K / 2) + (K * ratio)
    const cdx = d * Math.cos(slope)
    const cdy = d * Math.sin(slope)
    const cX = ((srcX + dstX) / 2) + cdx
    const cY = ((srcY + dstY) / 2) + cdy
    return [cX, cY]
  }

  arrow(srcX, srcY, dstX, dstY, i: number, n: number) {
    var headlen = 10; // length of head in pixels
    var dx = dstX - srcX;
    var dy = dstY - srcY;

    var angle = Math.atan2(dy, dx)
    this.ctx.beginPath()
    this.ctx.moveTo(srcX, srcY)
    this.ctx.lineWidth = 1
    if (n > 1) {
      const slope = (-1 / (dy / dx))
      const ratio = (i + 1) / n
      const K = 300
      const d = (-1 * K / 2) + (K * ratio)
      const cdx = d * Math.cos(slope)
      const cdy = d * Math.sin(slope)
      const cX = ((srcX + dstX) / 2) + cdx
      const cY = ((srcY + dstY) / 2) + cdy
      this.ctx.quadraticCurveTo(cX, cY, dstX, dstY)
    } else {
      this.ctx.lineTo(dstX, dstY)
    }
    this.ctx.lineTo(dstX, dstY)
    this.ctx.lineTo(dstX - headlen * Math.cos(angle - Math.PI / 6), dstY - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(dstX, dstY)
    this.ctx.lineTo(dstX - headlen * Math.cos(angle + Math.PI / 6), dstY - headlen * Math.sin(angle + Math.PI / 6));
  }

  render (edge: Edge, i: number, n: number) {
    const srcVertex = this.state.getById(edge.src)
    const dstVertex = this.state.getById(edge.dst)
    const left = Geometry.fromGeometricSpace(srcVertex.x, srcVertex.y)
    const right = Geometry.fromGeometricSpace(dstVertex.x, dstVertex.y)
    const srcRadius = srcVertex.isRoot ? config.Vertex.radius * 1.5 : config.Vertex.radius
    const dstRadius = dstVertex.isRoot ? config.Vertex.radius * 1.5 : config.Vertex.radius
    const [src, dst] = Geometry.getEdgeVector(left, right)
    const [srcX, srcY] = src
    const [dstX, dstY] = dst
  
    this.ctx.strokeStyle = this.state.isSelected(edge.id) ? config.Edge.selected.color : config.Edge.color
    this.ctx.lineWidth = config.Edge.width

    const K = 300
    const d = (-1 * K / 2) + (K * ((i + 1) / n))
    const [cx, cy] = this.getControlPoint([srcX, srcY, dstX, dstY], i, n)
    this.arrow(srcX, srcY, dstX, dstY, i, n)
    this.ctx.stroke()

    const w = 20 + (15 * edge.label.length)
    const h = 30
    const x = cx - (w / 2)
    const y = cy - (h / 2)
    edge.setBoundingBox({
      width: w,
      height: h,
      left: x,
      top: y
    })
    setTypography(this.ctx)
    this.ctx.fillStyle = this.state.isSelected(edge.id) ? config.Edge.selected.color : config.Edge.label.backgroundColor
    this.ctx.fillRect(x, y, w, h)
    this.ctx.fillStyle = config.Edge.label.color
    this.ctx.fillText(edge.label, x + (w / 2), y + (h / 2))
  }
}

export default CanvasEdge