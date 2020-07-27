import * as config from '../config'

export function setTypography (ctx) {
  ctx.font = `${config.Typography.fontSize}px "Open Sans"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
}
