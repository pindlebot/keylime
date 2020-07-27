import { groupBy } from 'lodash'
import { Element } from './types'
import * as Geometry from './Geometry'
import NetworkSelection from './NetworkSelection'
import Node from './model/Node'
import Edge from './model/Edge'
import PolyTree from './model/PolyTree'

function doesPointCollide(p, box) {
  return !(p.x < box.left || p.x > box.right || p.y > box.bottom || p.y < box.top)
}

class NetworkState {
  selection: NetworkSelection
  hiddenElementIds: Set<string>
  tree: PolyTree
  cache: Set<string>
  loadingNodeIds: Set<string>
  constructor(elements: Element[]) {
    this.tree = new PolyTree(elements)
    this.hiddenElementIds = new Set()
    this.loadingNodeIds = new Set()
    this.selection = new NetworkSelection()
    this.cache = new Set()
  }

  isSelected (id: string) {
    return this.selection.getNodes().has(id) || this.selection.getEdges().has(id)
  }

  setLoading (id: string) {
    this.loadingNodeIds.add(id)
  }

  getSelection() {
    return this.selection
  }

  setHidden (ids: string[]) {
    ids.forEach(id => {
      const node = this.tree.get(id)
      this.setHidden(node.children.map(c => c.id))
      this.hiddenElementIds.add(id)
    })
  }

  setVisible (ids: string[]) {
    ids.forEach(id => {
      this.hiddenElementIds.delete(id)
    })
  }

  isHidden (id: string) {
    return this.hiddenElementIds.has(id)
  }

  isCollapsed (id: string) {
    const vertex = this.tree.get(id)
    return (vertex?.children || []).every(child => this.hiddenElementIds.has(child.id))
  }

  isExpanded (id: string) {
    const vertex = this.tree.get(id)
    const children = vertex?.children || []
    return children.length && !children.some(child => this.isHidden(child.id))
  }

  getById(id): Node {
    return this.tree.get(id)
  }

  getEdges(): Edge[] {
    return this.tree.getEdges().filter(edge => {
      return !this.isHidden(edge.src) && !this.isHidden(edge.dst)
    })
  }

  getEdgeClusters (): { [key: string]: Edge[] } {
    const edges = this.getEdges()
    return groupBy(edges, 'key')
  }

  getVertices(): Node[] {
    return this.tree.getNodes()
      .filter(v => !this.isHidden(v.id))
  }

  getRootNodes (): Node[] {
    return this.tree.getNodes()
      .filter(c => !c.parents.length)
  }

  setInitialPositions (node: Node) {
    if (this.cache.has(node.id)) {
      return
    }
    this.cache.add(node.id)
    node.layout()

    node.children.forEach((child, i) => {
      this.setInitialPositions(child)
    })
  }

  arrange (node: Node, tick) {
    node.arrange(tick)

    node.children.forEach((child, i) => {
      this.arrange(child, tick)
    })
  }

  getEdgeAtPosition (x, y) {
    const edges = this.tree.getEdges()
    let index = 0
    while (index < edges.length) {
      const edge = edges[index]
      const collides = doesPointCollide({ x: 2 * x, y: 2 * y }, {
        left: edge.bb.left,
        right: edge.bb.left + edge.bb.width,
        top: edge.bb.top,
        bottom: edge.bb.top + edge.bb.height
      })
      if (collides) {
        return edge          
      }
      index++
    }
  }


  getNodeAtPosition (x, y) {
    const vertices = this.tree.getNodes()
    let index = 0
    while (index < vertices.length) {
      const vertex = vertices[index]
      const [aX, aY] = Geometry.fromGeometricSpace(vertex.x, vertex.y)
      if (
        x >= (aX / 2) - 20 &&
        x <= (aX / 2) + 20 &&
        y >= (aY / 2) - 20 &&
        y <= (aY / 2) + 20
      ) {
        if (!this.hiddenElementIds.has(vertex.id)) {
          return vertex          
        }
      }
      index++
    }
  }

  getElementAtPosition (evt) {
    const { clientX, clientY } = evt
    return this.getNodeAtPosition(clientX, clientY) || this.getEdgeAtPosition(clientX, clientY)
  }
}

export default NetworkState
