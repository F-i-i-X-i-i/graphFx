const EdgeStyle = {
    'DEFAULT' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'none',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F7F7F7',
        'stroke-rect': 'gray',
    },
    'DRAGGING'  : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'none',
        'stroke-dasharray': 'none',
        'font-weight': 'bold',
        'fill-rect': '#C0C0C0',
        'stroke-rect': 'black',
    },
    'PATH' : {
        'stroke': 'red', 
        'stroke-width': '2', 
        'fill': 'none',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F7F7F7',
        'stroke-rect': 'gray',

    }
  }

const enum EdgeStyleKey  {
    DEFAULT = 'DEFAULT',
    DRAGGING = 'DRAGGING',
    PATH = 'PATH'

}

export { EdgeStyle, EdgeStyleKey }