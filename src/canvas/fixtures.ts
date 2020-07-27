export enum DOMEvents {
  ON_MOUSE_MOVE = 'mousemove',
  ON_KEY_PRESS = 'keypress',
  ON_MOUSE_DOWN = 'mousedown',
  ON_TOUCH_START = 'touchstart',
  ON_CLICK = 'click'
}

export const SUBSCRIBED_EVENTS = [
  DOMEvents.ON_MOUSE_MOVE,
  DOMEvents.ON_KEY_PRESS,
  DOMEvents.ON_MOUSE_DOWN,
  DOMEvents.ON_TOUCH_START,
  DOMEvents.ON_CLICK,
]
