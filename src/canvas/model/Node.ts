import * as config from '../config'

let roots : [number, number][] = [
  [0, 0],
  [300, 300],
  [300, -300],
  [-300, 300],
  [-300, -300]
]

class Node {
  type: string
  id: string
  label: string
  x: number
  y: number
  _children: Set<Node>
  _parents: Set<Node>
  name: string

  constructor(node: any) {
    this.type = 'node'
    this.id = node.id
    this.label = node.label
    this.name = node.name
    this.x = node.x
    this.y = node.y
    this._children = new Set()
    this._parents = new Set()
  }

  get children () {
    return Array.from(this._children)
  }

  get parents () {
    return Array.from(this._parents)
  }


  get childKeys () {
    return this.children.map(node => node.id)
  }

  get parentKeys () {
    return this.parents.map(node => node.id)
  }

  get angle () {
    return Math.atan2(this.y || 0, this.x || 0)
  }

  get isRoot () {
    if (!this.parents.length) {
      return true
    }

    return false
  }

  getParent () {
    const parents = this.parents
    const children = new Set(this.children.map(c => c.id))
    parents
      .filter(parent => !children.has(parent.id))
      .sort((a, b) => b.children.length - a.children.length)
  
    return parents.length ? parents[0] : null
  }
  
  walk (callback) {
    let i = 0
    let nodes = this.children
    const seenKeys = new Set()
  
    while (i < nodes.length) {
      let node = nodes[i]
      if (seenKeys.has(node.id)) {
        continue
      }
      seenKeys.add(node.id)
      callback(node)
      if (node.children) {
        nodes = nodes.concat(node.children)
      }
      i++
    }
  }

  isLeaf () {
    return this.children.length === 0
  }

  getAngle () {
    if (this.isRoot) {
      return 0
    }
  
    const [parent] = this.parents
    console.log(this)
    const n = parent.children.length
    const i = [...parent.children].map(c => c.id).indexOf(this.id) + 1

    // layer 1
    if (parent.isRoot) {
      return (2 * (i - 1) * Math.PI) / n
    }
 
    // layer 2
    if (parent.parents[0].isRoot) {
      if (n === 1) {
        return parent.getAngle()
      }
      const theta1 = parent.getAngle()
      const f0 = parent.parents[0].children.length

      return (theta1 - (Math.PI / f0) +  (2 * Math.PI * (i - 1) / ((n - 1) * f0)))
    }

    // layer 3
    if (n === 1) {
      return parent.getAngle()
    }

    const thetad1 = parent.getAngle()
    const thetad2 = parent.parents[0].getAngle()
    const seenKeys = new Set()

    let k = parent.parents[0]
    let fsum = 0
    while (true) {
      // if (seenKeys.has(k.id)) {
      //   break
      // }

      // seenKeys.add(k.id)
      let fk = k.children.length
      fsum += fk
      if (k.isRoot) {
        break
      } else {
        k = k.parents[0]
      }
    }
  
    let clump = ((2 * Math.PI) * (i - 1)) / ((n - 1) * fsum)

    if (thetad1 < thetad2) {
      return thetad1 + clump
    }

    if (thetad1 > thetad2) {
      return thetad1 - clump
    }

    return thetad1 - (Math.PI / fsum) + clump
  }

  getComponents (): [number, number] {
    if (this.isRoot) {
      return [...roots].shift()
    }
    const angle = this.getAngle()
    const dx = config.Edge.size * Math.cos(angle)
    const dy = config.Edge.size * Math.sin(angle)
    const [parent] = this.parents
    const x = parent.x + dx
    const y = parent.y + dy
    return [x, y]
  }

  layout () {
    if (this.isRoot) {
      return this.setPosition(0, 0)
    }
    const [x, y] = this.getComponents()
    this.setPosition(x, y)
  }

  arrange (tick: number) {
    const [fx, fy] = this.getComponents()
    const x = this.x + ((fx - this.x) * 0.1 * tick)
    const y = this.y + ((fy - this.y) * 0.1 * tick)
    this.setPosition(x, y)
  }

  setChildren (children: Node[]) {
    this._children = new Set(children)
  }

  setParents (parents: Node[]) {
    this._parents = new Set(parents)
  }

  setPosition (x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export default Node
