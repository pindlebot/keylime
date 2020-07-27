

export const Vertex = {
  radius: 50,
  backgroundColor: '#ff4f56',
  selected: {
    backgroundColor: '#15bd76',
    borderWidth: 6
  },
  label: {
    color: '#2D3748',
    backgroundColor: '#E2E8F0'
  }
}

export const Glyph = {
  radius: 20,
  borderColor: '#122331',
  borderWidth: 2,
  backgroundColor: '#2185d0',
  color: '#fff'
}

export const Edge = {
  color: '#A0AEC0',
  width: 8,
  size: 200,
  selected: {
    color: '#fbd38d'
  },
  label: {
    color: '#2D3748',
    backgroundColor: '#E2E8F0'
  }
}

export const Typography = {
  fontSize: 20
}

export const Canvas = {
  scale: 2
}

export default { Vertex, Glyph, Edge, Typography }
