import * as Geometry from './Geometry' 
import config from './config'

class Glyph {
  ctx: CanvasRenderingContext2D
  constructor(ctx) {
    this.ctx = ctx
  }

  render (x, y, text) {
    Geometry.drawCircle(this.ctx, {
      x,
      y,
      radius: config.Glyph.radius,
      color: config.Glyph.backgroundColor,
      variant: Geometry.GeometryVariant.FILL
    })
    Geometry.drawCircle(this.ctx, {
      x,
      y,
      radius: config.Glyph.radius,
      color: config.Glyph.backgroundColor,
      variant: Geometry.GeometryVariant.STROKE,
      style: {
        borderWidth: config.Glyph.borderWidth
      }
    })   
    this.ctx.font = `${config.Typography.fontSize}px "Open Sans"`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#fff'
    this.ctx.fillText(text, x, y)
  }
}

export default Glyph
