const NodeStyle = {
    'DEFAULT' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'lightblue',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray',
        'display-text-in-circle': 'None',
    },
    'DRAGGING'  : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'steelblue',
        'stroke-dasharray': '5,2',
        'font-weight': 'bold',
        'fill-rect': '#C0C0C0',
        'stroke-rect': 'black',
        'display-text-in-circle': 'None',
    },
    'PATH' : {
        'stroke': '#700000', 
        'stroke-width': '2', 
        'fill': 'red',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray',
        'display-text-in-circle': 'None',

    },
    'GROUP' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'lightblue',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray',
        'display-text-in-circle': 'None',
    },
    'ORDINAL' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': 'lightblue',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray',
        'display-text-in-circle': 'inline',
    },
    'SKELETON' : {
        'stroke': 'black', 
        'stroke-width': '2', 
        'fill': '#FFA500',
        'stroke-dasharray': 'none',
        'font-weight': 'normal',
        'fill-rect': '#F2F2F2',
        'stroke-rect': 'gray',
        'display-text-in-circle': 'None',
    },
  }

const enum NodeStyleKey  {
    DEFAULT = 'DEFAULT',
    DRAGGING = 'DRAGGING',
    PATH = 'PATH',
    GROUP = 'GROUP',
    ORDINAL = 'ORDINAL',
    SKELETON = 'SKELETON',

}

export { NodeStyle, NodeStyleKey }