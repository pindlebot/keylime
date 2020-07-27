import * as config from '../config'
import * as Geometry from '../Geometry'
import NetworkState from '../NetworkState'
import Glyph from '../Glyph'
import { setTypography } from './typography'
import Node from '../model/Node'

class CanvasVertex {
  ctx: CanvasRenderingContext2D
  state: NetworkState

  constructor(ctx, state) {
    this.ctx = ctx
    this.state = state
  }

  async renderLoading (node: Node, elapsed) {
    const e = Math.floor(elapsed/10)
    let [x, y] = Geometry.fromGeometricSpace(node.x, node.y)
    const rPrime = config.Vertex.radius + 40
    const ly = y - rPrime

    Geometry.drawCircle(this.ctx, {
      x: x,
      y: ly,
      radius: 10,
      color: e <= 30 ? '#fff' : 'rgba(255, 255, 255, 0.5)',
      variant: Geometry.GeometryVariant.FILL
    })


    const theta = -1 * Math.PI / 4
    Geometry.drawCircle(this.ctx, {
      x: x + (rPrime * Math.cos(theta)),
      y: y + (rPrime * Math.sin(theta)),
      radius: 10,
      color: e > 30 && e < 60 ? '#fff' : 'rgba(255, 255, 255, 0.5)',
      variant: Geometry.GeometryVariant.FILL
    })

    Geometry.drawCircle(this.ctx, {
      x: x + (rPrime * Math.cos(theta - Math.PI / 2)),
      y: y + (rPrime * Math.sin(theta - Math.PI / 2)),
      radius: 10,
      color: e > 60 ? '#fff' : 'rgba(255, 255, 255, 0.8)',
      variant: Geometry.GeometryVariant.FILL
    })
  }

  async render (vertex: Node, template, elapsed) {
    const radius = vertex.isRoot ? config.Vertex.radius * 1 : config.Vertex.radius

    const { id, label, name } = vertex
    let [x, y] = Geometry.fromGeometricSpace(vertex.x, vertex.y)

    const isSelected = this.state.isSelected(id)
    const isLoading = this.state.loadingNodeIds.has(id)
    if (isLoading) {
      this.renderLoading(vertex, elapsed)
    }
    this.ctx.shadowColor = 'rgba(0,0,0,0.15)'
    this.ctx.shadowBlur = 2
    Geometry.drawCircle(this.ctx, {
      x,
      y,
      radius: radius,
      color: template.color || config.Vertex.selected.backgroundColor,
      variant: Geometry.GeometryVariant.FILL
    })
    const img = await template.icon
    // @ts-ignore
    this.ctx.drawImage(img, x - (radius / 2), y - (radius / 2), radius, radius)
    
    if (isSelected) {
      Geometry.drawCircle(this.ctx, {
        x,
        y,
        radius: radius + config.Vertex.selected.borderWidth + 2,
        color: template.color || config.Vertex.selected.backgroundColor,
        variant: Geometry.GeometryVariant.STROKE,
        style: {
          borderWidth: config.Vertex.selected.borderWidth
        }
      })
    }
    this.ctx.shadowColor = 'rgba(0,0,0,0)'
    this.ctx.shadowBlur = 0
    const horizonEdgeCount = vertex.children.filter(node => this.state.isHidden(node.id)).length
    if (horizonEdgeCount > 0) {
      const glyphX = x + radius - (config.Glyph.radius / 2)
      const glyphY = y - radius + config.Glyph.radius
      new Glyph(this.ctx).render(glyphX, glyphY, horizonEdgeCount.toString())
    }

    setTypography(this.ctx)
    const labelWidth = 20 + (15 * name.length)
    const labelHeight = 30
    const textY = y + radius + 20
    this.ctx.fillStyle = config.Vertex.label.backgroundColor
    this.ctx.fillRect(x - labelWidth / 2, textY - (labelHeight / 2), labelWidth, labelHeight)
    this.ctx.fillStyle = config.Vertex.label.color
    this.ctx.fillText(name, x, textY)
  }
}

export default CanvasVertex