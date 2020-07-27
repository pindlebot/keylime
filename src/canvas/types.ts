export enum ElementType {
  VERTEX = 'vertex',
  EDGE = 'edge'
}

export type VertexProperties = {
  id: string,
  type: ElementType,
  label: string,
  name: string,
  depth?: number,
  x?: number,
  y?: number
}

export type EdgeProperties = {
  id: string,
  type: ElementType,
  label?: string,
  src: string,
  dst: string
}

export type Element = VertexProperties | EdgeProperties
