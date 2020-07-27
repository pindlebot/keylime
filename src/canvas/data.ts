
export default [
  {
    type: 'vertex',
    id: 'school:0',
    name: 'Hogwarts',
    label: 'school'
  },
  {
    type: 'vertex',
    id: 'house:0',
    name: 'Gryffindor',
    label: 'house'
  },
  {
    type: 'vertex',
    id: 'house:1',
    name: 'Slytherin',
    label: 'house'
  },
  {
    type: 'vertex',
    id: 'house:2',
    name: 'Ravenclaw',
    label: 'house'
  },
  {
    type: 'vertex',
    id: 'house:3',
    name: 'Hufflepuff',
    label: 'house'
  },
  {
    type: 'edge',
    src: 'school:0',
    dst: 'house:0',
    id: 'school:0:house:0',
    label: 'houseOf',
    name: 'houseOf'
  },
  {
    type: 'edge',
    src: 'school:0',
    dst: 'house:1',
    id: 'school:0:house:1',
    label: 'houseOf',
    name: 'houseOf'
  },
  {
    type: 'edge',
    src: 'school:0',
    dst: 'house:2',
    id: 'school:0:house:2',
    label: 'houseOf',
    name: 'houseOf'
  },
  {
    type: 'edge',
    src: 'school:0',
    dst: 'house:3',
    id: 'school:0:house:3',
    label: 'houseOf',
    name: 'houseOf'
  },
  {
    type: 'vertex',
    id: 'person:1',
    name: 'Dumbledore',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:2',
    name: 'Voldemort',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:3',
    name: 'Harry Potter',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:4',
    name: 'Snape',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:5',
    name: 'Ron',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:6',
    name: 'Hermione',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:7',
    name: 'Ginny',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:8',
    name: 'Draco Malfoy',
    label: 'person'
  },
  {
    type: 'vertex',
    id: 'person:9',
    name: 'Luna Lovegood',
    label: 'person'
  },
  {
    type: 'edge',
    src: 'house:0',
    dst: 'person:1',
    id: 'house:0:person:1',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:1',
    dst: 'person:2',
    id: 'house:1:person:2',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:0',
    dst: 'person:3',
    id: 'house:0:person:3',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:0',
    dst: 'person:5',
    id: 'house:0:person:5',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:0',
    dst: 'person:6',
    id: 'house:0:person:6',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:0',
    dst: 'person:7',
    id: 'house:0:person:7',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:1',
    dst: 'person:8',
    id: 'house:1:person:8',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:2',
    dst: 'person:9',
    id: 'house:2:person:9',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:1',
    dst: 'person:4',
    id: 'house:1:person:4:1',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:1',
    dst: 'person:4',
    id: 'house:1:person:4:2',
    name: 'attended',
    label: 'attended'
  },
  {
    type: 'edge',
    src: 'house:1',
    dst: 'person:4',
    id: 'house:1:person:4:3',
    name: 'attended',
    label: 'attended'
  }
]
