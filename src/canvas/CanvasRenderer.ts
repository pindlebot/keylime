import EventEmitter from 'eventemitter3'
import { debounce } from 'lodash'
import NetworkState from './NetworkState'
import NetworkSelection from './NetworkSelection'
import { Element, Edge } from './types'
import * as config from './config'
import { SUBSCRIBED_EVENTS } from './fixtures'
import CanvasVertex from './render/CanvasVertex'
import CanvasEdge from './render/CanvasEdge'
import Node from './model/Node'
import onMouseDown from './events/MouseDown'
import onMouseMove from './events/MouseMove'
import onMouseUp from './events/MouseUp'
import CollapseEvent from './events/CollapseEvent'
import templates from './templates'

export enum Events {
  TICK = 'tick',
  COLLAPSE = 'COLLAPSE',
  REDRAW = 'REDRAW'
}

type CanvasRendererState = {
  dragging: boolean,
  queue: any[],
  stale: boolean
}

class CanvasRenderer extends EventEmitter {
  canvas: HTMLCanvasElement
  data: Element[]
  network: NetworkState
  selection: NetworkSelection
  ctx: CanvasRenderingContext2D
  state: CanvasRendererState
  _intervalID: any
  _tick: number
  _isRunning: boolean
  _queue: (() => void)[]
  _events: any
  _startTime: number | null
  _assets: any[]

  constructor (canvas: HTMLCanvasElement, data: Element[]) {
    super()
    this.canvas = canvas
    this.data = data
    this.network = new NetworkState(this.data)

    this.canvas.width = window.innerWidth * config.Canvas.scale
    this.canvas.height = window.innerHeight * config.Canvas.scale
    this.canvas.style.width = `100vw`
    this.canvas.style.height = `100vh`

    this.ctx = this.canvas.getContext('2d')
    this.state = {
      dragging: false,
      queue: [],
      stale: false
    }
    this._queue = []
    this._events = []
    this._tick = 0
    this._isRunning = false
    this._startTime = null
  }

  resetIdleStartTime () {
    this._startTime = Date.now()
  }

  process () {
    while (this._queue.length) {
      const fn = this._queue.shift()
      fn()
    }
  }

  drawVertex (node: Node, elapsed: number) {
    const cv = new CanvasVertex(this.ctx, this.network)
    cv.render(node, templates[node.label], elapsed)
  }


  drawEdge (edge: Edge, i: number, n: number) {
    const cv = new CanvasEdge(this.ctx, this.network)
    cv.render(edge, i, n)
  }

  bindEvents () {
    SUBSCRIBED_EVENTS.forEach(event => {
      window.addEventListener(event, this.resetIdleStartTime)
    })
    this.canvas.addEventListener('mouseup', onMouseUp.bind(this))
    this.canvas.addEventListener('mousemove', onMouseMove.bind(this))
    this.canvas.addEventListener('mousedown', onMouseDown.bind(this))

    this.canvas.addEventListener('dblclick', (evt) => {
      const rootNode = this.network.getElementAtPosition(evt)
      if (rootNode) {  
        this.network.selection.selectVertex(rootNode.id)    
        const collapseEvent = new CollapseEvent(this.network, rootNode)
        this._events.push(collapseEvent)
        this.start()
      }
    })
  }

  stop = debounce(() => {
    clearInterval(this._intervalID)
    this._isRunning = false
  }, 500)

  redraw () {
    return new Promise(resolve => {
      window.requestAnimationFrame((timestamp) => {
        if (!this._startTime) {
          this._startTime = timestamp
        }

        const elapsed = timestamp - this._startTime
        this.emit(Events.TICK, [elapsed])
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.network.getVertices()
          .reverse()
          .forEach((vertex) => {
            this.drawVertex(vertex, elapsed)
          })
        const groupedEdges = this.network.getEdgeClusters()

        Object.values(groupedEdges).forEach(edges => {
          edges.forEach((edge, i) => {
            this.drawEdge(edge, i, edges.length)
          })
        })
          
        resolve()
      })
    })
  }

  start () {
    this.emit(Events.REDRAW)
  }

  loadAssets (src): Promise<any[]> {
    return new Promise(resolve => {
      const image = new Image()
      image.src = src
      image.addEventListener('load', () => {
        resolve([image]) 
      })
    })
  }

  layout () {
    this.network.cache.clear()
    this.network.getRootNodes().forEach(node => {
      this.network.setInitialPositions(node)
    })
  }

  async render () {
    // @ts-ignore
    window.__renderer = this
    this.layout()
    // @ts-ignore
    window.layout = () => {
      const nodes = this.network.getRootNodes()
      this._events.push({
        beforeStart() {},
        afterEnd() {},
        onNextTick: (tick) => {
          this.network.arrange(nodes[0], tick)
        }
      })
      this.start()
    }

    this.on(Events.TICK, async () => {
      if (!this._events.length) {
        this._startTime = null
        this._tick = 0
        return
      }

      const event = this._events[0]

      if (this._tick === 0) {
        event.beforeStart.call(event)
      }

      await event.onNextTick.call(event, this._tick)
      this._tick++

      if (this._tick >= 10) {
        event.afterEnd.call(event, this)
        this._events.shift()
      } else {
        return setTimeout(() => this.start(), 10)
      }
    })

    this.on(Events.REDRAW, () => {
      this.redraw()
    })

    this.start()
  }
}

export default CanvasRenderer

