import * as Geometry from '../Geometry'

function onMouseMove (evt) {
  const [offsetX, offsetY] = Geometry.toGeometricSpace(evt.clientX, evt.clientY)

  if (this.state.dragging) {
    const nodes = this.network.getSelection().getNodes()
    if (nodes.size) {
      const vertexId = [...nodes][0]
      const vertex = this.network.getById(vertexId)
      vertex.setPosition(offsetX, offsetY)
      this.start()
    }
  }
}

export default onMouseMove
