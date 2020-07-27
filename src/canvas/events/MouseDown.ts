

function onMouseDown (evt) {
  this.state.dragging = true
  const element = this.network.getElementAtPosition(evt)
  console.log(element)
  this.network.selection.clear()

  if (element) {
    this.network.selection.select(element)
  }

  this.start()
}

export default onMouseDown
