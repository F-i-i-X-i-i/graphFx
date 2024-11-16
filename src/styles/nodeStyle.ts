const NodeStyle = {
    'DEFAULT' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'lightblue',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray'
    },
    'DRAGGING'  : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'steelblue',
        'stroke-dasharray': '5,2',
        'font-weight': 'bold',
        'fill-rect': '#C0C0C0',
        'stroke-rect': 'black'
    },
    'PATH' : {
        'stroke': '#700000', 
        'stroke-width': '2', 
        'fill': 'red',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray'

    }
  }

const enum NodeStyleKey  {
    DEFAULT = 'DEFAULT',
    DRAGGING = 'DRAGGING',
    PATH = 'PATH'

}

export { NodeStyle, NodeStyleKey }