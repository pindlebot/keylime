import React from 'react'
import CanvasRenderer from './canvas/CanvasRenderer'
import data from './canvas/data'

function Graph () {
  const ref = React.useRef(null)

  React.useEffect(() => {
    const renderer = new CanvasRenderer(ref.current, data)
    renderer.bindEvents()
    renderer.render()
  }, [])

  return (
    <div
      className={'root'}
    >
      <canvas ref={ref} id={'network'} />
    </div>
  )
}

export default Graph

