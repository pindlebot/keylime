import NetworkState from '../NetworkState'
import Node from '../model/Node'
import * as config from '../config'

class CollapseEvent {
  state: NetworkState
  node: Node
  isCollapsed: boolean
  constructor (state, node) {
    this.state = state
    this.node = node
    this.isCollapsed = this.state.isCollapsed(this.node.id)
  }

  async onNextTick (tick: number) {
    // if (this.state.loadingNodeIds.has(this.node.id)) {
    //   return false
    // }
    const increment = 1 / 10
    // let increment = 1 / 100
    // if (this.isCollapsed) {
    //   if (tick < 90) {
    //     return
    //   }
    //   tick = tick - 90
    //   increment = 1 / 10
    // }
    const getNextPosition = (node: Node) => {
      const parent = node.parents[0]
      let x
      let y
      if (this.isCollapsed) {
        const angle = node.getAngle()
        let dx = config.Edge.size * Math.cos(angle)
        let dy = config.Edge.size * Math.sin(angle)
        x = parent.x + (dx * increment * tick)
        y = parent.y + (dy * increment * tick)
      } else {
        let dx = parent.x - node.x
        let dy = parent.y - node.y
        x = node.x + (dx * increment * tick)
        y = node.y + (dy * increment * tick)
      }
  
      return [x, y]
    }

    let tuples = []
    this.node.walk((node) => {
      tuples.push([node, getNextPosition(node)])
    })

    tuples.forEach(([node, position]) => {
      node.setPosition(...position)
    })
  }

  beforeStart () {
    if (this.isCollapsed) {
      this.state.setLoading(this.node.id)
      setTimeout(() => {
        this.state.loadingNodeIds.clear()
      }, 1000)
      this.state.setVisible(this.node.children.map(v => v.id))
    }
  }

  afterEnd (ctx) {
    if (!this.isCollapsed) {
      this.state.setHidden(this.node.children.map(v => v.id))
    } else {
      this.state.setVisible(this.node.children.map(v => v.id))
    }

    ctx.start()
  }
}

export default CollapseEvent
