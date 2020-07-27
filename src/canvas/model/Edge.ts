

class Edge {
  id: string
  src: string
  dst: string
  label: string
  name: string
  key: string
  type: string
  bb: { width: number, height: number, top: number, left: number }
  constructor (properties: any) {
    this.id = properties.id
    this.src = properties.src
    this.dst = properties.dst
    this.label = properties.label
    this.name = properties.name
    this.key = `${this.src}:${this.dst}`
    this.type = 'edge'
  }

  setBoundingBox(bb) {
    this.bb = bb
  }
}

export default Edge
