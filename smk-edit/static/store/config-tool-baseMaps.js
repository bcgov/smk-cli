export default {
    filters: {
        'baseMaps': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 3,
                    position: [ 'shortcut-menu', 'list-menu' ],
                    icon: 'map',
                    title: 'Base Maps',
                    mapStyle: {
                        width: '110px',
                        height: '110px',
                    }
                }, tool )
            },
        }
    },
    actions: {
    },
}
