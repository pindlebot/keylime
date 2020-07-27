import React from 'react'
import { render } from 'react-dom'
import './styles.css'
import Graph from './Graph'

function App () {
  return (<Graph />)
}

render(
  <App />,
  (window.document as any).getElementById('root')
)
 
