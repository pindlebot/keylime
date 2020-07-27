import wizard from '../assets/wizard.svg'
import school from '../assets/school.svg'

const loadAsset = (src): Promise<any> => {
  return new Promise(resolve => {
    const image = new Image()
    image.src = src
    image.addEventListener('load', () => {
      resolve(image) 
    })
  })
}


export default {
  person: {
    icon: loadAsset(wizard),
    color: '#d5408c',

  },
  school: {
    icon: loadAsset(school),
    color: '#4299E1'
  },
  house: {
    icon: loadAsset(school),
    color: '#48BB78'
  }
}