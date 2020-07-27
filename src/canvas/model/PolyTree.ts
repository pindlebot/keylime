import { groupBy } from 'lodash'
import { ElementType, Element, VertexProperties, EdgeProperties } from '../types'
import Node from '../model/Node'
import Edge from '../model/Edge'

type PolyTreeState = {
  vertices?: VertexProperties[],
  edges: Edge[],
  src: {
    [key: string]: EdgeProperties[]
  },
  dst: {
    [key: string]: EdgeProperties[]
  },
  tree: {
    [key: string]: Node
  }
}

function generateTree (elements: Element[]): Graph {
  const graph = elements.reduce((acc, element) => {
    if (element.type === ElementType.EDGE) {
      const edge = element as EdgeProperties
      acc.src[edge.src] = acc.src[edge.src] || []
      acc.src[edge.src].push(edge)

      acc.dst[edge.dst] = acc.dst[edge.dst] || []
      acc.dst[edge.dst].push(edge)
      acc.edges.push(new Edge(edge))
    }

    if (element.type === ElementType.VERTEX) {
      acc.tree[element.id] = new Node(element)
    }
    return acc
  }, {
    edges: [],
    src: {},
    dst: {},
    tree: {}
  })


  Object.values(graph.tree).forEach((node: Node) => {
    const parents = (graph.dst[node.id] || []).map(e => graph.tree[e.src])
    const children = (graph.src[node.id] || []).map(e => graph.tree[e.dst])
    node.setParents(parents)
    node.setChildren(children)
  })

  return graph
}

class PolyTree {
  state: PolyTreeState

  constructor(elements) {
    this.state = generateTree(elements)
  }

  get (id: string) {
    return this.state.tree[id]
  }

  getEdges(): Edge[] {
    return this.state.edges
  }

  getEdgeClusters () {
    return groupBy(this.state.edges, 'key')
  }

  getNodes(): Node[] {
    return Object.values(this.state.tree)
      .sort((a, b) => b.children.length - a.children.length)
  }
}

export default PolyTree
