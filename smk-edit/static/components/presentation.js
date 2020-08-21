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
    },
    'baseMaps': {
        title: 'Base Maps',
        icon: 'map',
    },
    'bespoke': {
        title: 'Bespoke',
        instance: '-new-'
    },
    'coordinate': {
        title: 'Coordinate',
    },
    'directions': {
        title: 'Directions',
        icon: 'directions_car',
    },
    // 'dropdown': {
    //     title: '',
    //     icon: '',
    //     instance: false
    // },
    'identify': {
        title: 'Identify',
        icon: 'info_outline',
    },
    'layers': {
        title: 'Layers',
        icon: 'layers',
    },
    'legend': {
        title: 'Legend',
    },
    'list-menu': {
        title: 'List Menu',
        icon: 'menu',
    },
    'location': {
        title: 'Location',
    },
    'markup': {
        title: 'Markup',
    },
    'measure': {
        title: 'Measure',
        icon: 'straighten',
    },
    'menu': {
        title: 'Menu',
        icon: 'menu',
    },
    'minimap': {
        title: 'Mini Map',
    },
    'pan': {
        title: 'Pan',
    },
    'query': {
        title: 'Query',
        available: false
    },
    // 'query-place': {
    //     title: '',
    //     icon: '',
    //     instance: false
    // },
    'scale': {
        title: 'Scale',
    },
    'search': {
        title: 'Search',
        icon: 'search',
    },
    'select': {
        title: 'Select',
        icon: 'select_all',
    },
    'shortcut-menu': {
        title: 'Shortcut Menu',
    },
    'toolbar': {
        title: 'Toolbar',
    },
    'version': {
        title: 'Version',
        icon: 'build',
    },
    'zoom': {
        title: 'Zoom',
    }
}

export const availableTools = Object.keys( toolTypePresentation )
    .filter( function ( t ) { return toolTypePresentation[ t ].available !== false } )
    .map( function ( t ) {
        return {
            type: t,
            proto: true,
            ...toolTypePresentation[ t ]
        }
    } )
