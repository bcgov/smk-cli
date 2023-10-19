export const itemTypePresentation = {
    'folder': {
        title: 'Folder',
        colour: 'purple',
        icon: 'folder_open',
        collection: true,
    },
    'group': {
        title: 'Group',
        colour: 'orange',
        icon: 'folder',
        collection: true,
    },
    'wms': {
        title: 'WMS Layer',
        colour: 'green',
        icon: 'backup',
        layer: true,
    },
    'esri-dynamic': {
        title: 'ESRI Dynamic Layer',
        colour: 'blue',
        icon: 'description',
        layer: true,
    },
    'vector': {
        title: 'Vector Layer',
        colour: 'pink',
        icon: 'timeline', // 'edit',
        layer: true,
        style: true,
    }
}

export const toolTypePresentation = {
    'about': {
        title: 'About',
        details: 'edit-tool-details',
        content: 'edit-tool-content-about',
        default: {
            icon: 'help'
        }
    },
    'baseMaps': {
        title: 'Base Maps',
        details: 'edit-tool-details-baseMaps',
        default: {
            icon: 'map',
        }
    },
    'bespoke': {
        title: 'Bespoke',
        details: 'edit-tool-details-bespoke',
        content: 'edit-tool-content-bespoke',
        default: {
            instance: 'NEW',
            icon: 'now_widgets',
        }
    },
    'coordinate': {
        title: 'Coordinate',
        details: false,
        default: {}
    },
    'directions': {
        title: 'Directions',
        details: 'edit-tool-details-directions',
        default: {
            icon: 'directions_car',
        }
    },
    // 'dropdown': {
    //     title: '',
    //     icon: '',
    //     instance: false
    // },
    'geomark': {
        title: 'Geomark',
        details: 'edit-tool-details',
        default: {}
    },
    'identify': {
        title: 'Identify',
        details: 'edit-tool-details-identify',
        default: {
            icon: 'info_outline',
        }
    },
    'layers': {
        title: 'Layers',
        details: 'edit-tool-details-layers',
        default: {
            icon: 'layers',
        }
    },
    'legend': {
        title: 'Legend',
        details: false,
        default: {}
    },
    'list-menu': {
        title: 'List Menu',
        position: true,
        details: 'edit-tool-details',
        default: {
            icon: 'menu',
        }
    },
    'location': {
        title: 'Location',
        details: false,
        default: {}
    },
    'markup': {
        title: 'Markup',
        details: false,
        default: {}
    },
    'measure': {
        title: 'Measure',
        details: 'edit-tool-details',
        default: {
            icon: 'straighten',
        }
    },
    // 'menu': {
    //     title: 'Menu',
    //     position: true,
    //     details: 'edit-tool-details',
    //     default: {
    //         icon: 'menu',
    //     }
    // },
    'minimap': {
        title: 'Mini Map',
        details: false,
        default: {}
    },
    'pan': {
        title: 'Pan',
        details: false,
        default: {}
    },
    'query': {
        title: 'Query',
        available: false,
        details: 'edit-tool-details-query',
        default: {}
    },
    // 'query-place': {
    //     title: '',
    //     icon: '',
    //     instance: false
    // },
    'scale': {
        title: 'Scale',
        details: 'edit-tool-details-scale',
        default: {}
    },
    'search': {
        title: 'Search',
        details: 'edit-tool-details-search',
        default: {
            icon: 'search',
        }
    },
    'select': {
        title: 'Select',
        details: 'edit-tool-details-select',
        default: {
            icon: 'select_all',
        }
    },
    'shortcut-menu': {
        title: 'Shortcut Menu',
        position: true,
        details: false,
        default: {}
    },
    'toolbar': {
        title: 'Toolbar',
        position: true,
        details: false,
        default: {}
    },
    'version': {
        title: 'Version',
        details: 'edit-tool-details',
        default: {
            icon: 'build',
        }
    },
    'zoom': {
        title: 'Zoom',
        details: 'edit-tool-details-zoom',
        default: {}
    }
}

export const availableTools = Object.keys( toolTypePresentation )
    .filter( function ( t ) { return toolTypePresentation[ t ].available !== false } )
    .map( function ( t ) {
        return {
            proto: true,
            type: t,
            ...toolTypePresentation[ t ].default
        }
    } )

export const baseMaps = [
    {
        id: 'BCGov',
        title: 'BC Government',
        type: 'Open'
    },
    {
        id: 'BCGovHillshade',
        title: 'BC Government Hillshade',
        type: 'Open'
    },
    {
        id: 'Topographic',
        title: 'Topographic',
        type: 'ESRI'
    },
    {
        id: 'Streets',
        title: 'Streets',
        type: 'ESRI'
    },
    {
        id: 'Imagery',
        title: 'Imagery',
        type: 'ESRI'
    },
    {
        id: 'Oceans',
        title: 'Oceans',
        type: 'ESRI'
    },
    {
        id: 'ShadedRelief',
        title: 'Shaded Relief',
        type: 'ESRI'
    },
    {
        id: 'DarkGray',
        title: 'Dark Gray',
        type: 'ESRI'
    },
    {
        id: 'Gray',
        title: 'Gray',
        type: 'ESRI'
    }
]

export const zoomScale = []
zoomScale[  1 ] = 173000000
zoomScale[  2 ] = 89700000
zoomScale[  3 ] = 45200000
zoomScale[  4 ] = 22600000
zoomScale[  5 ] = 11300000
zoomScale[  6 ] = 5660000
zoomScale[  7 ] = 2830000
zoomScale[  8 ] = 1410000
zoomScale[  9 ] = 707000
zoomScale[ 10 ] = 354000
zoomScale[ 11 ] = 177000
zoomScale[ 12 ] = 88000
zoomScale[ 13 ] = 44000
zoomScale[ 14 ] = 22000
zoomScale[ 15 ] = 11000
zoomScale[ 16 ] = 5530
zoomScale[ 17 ] = 2760
zoomScale[ 18 ] = 1380
zoomScale[ 19 ] = 691
