import Node from './model/Node'
import Edge from './model/Edge'

import { ElementType } from './types'

class NetworkSelection {
  _nodes: Set<string>
  _edges: Set<string>
  constructor (selection : any = {}) {
    this._nodes = selection.nodes || new Set()
    this._edges = selection.edges || new Set()
  }

  getNodes () {
    return this._nodes
  }

  getEdges () {
    return this._edges
  }

  setSelection ({ nodes, edges }) {
    this._nodes = nodes
    this._edges = edges
  }

  selectVertex (id) {
    this._nodes.add(id)
  }

  selectEdge (id) {
    this._edges.add(id)
  }

  select (element: Node | Edge) { 
    if (element.type === ElementType.EDGE) {
      this.selectEdge(element.id)
    } else {
      this.selectVertex(element.id)
    }
  }

  clear () {
    this._nodes.clear()
    this._edges.clear()
  }

  getSelection () {
    return this
  }
}

export default NetworkSelection
