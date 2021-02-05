export default {
    filters: {
        'search': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 2,
                    position: 'toolbar',
                    icon: 'search',
                    title: 'Search for Location',
                    showPanel: true,
                    showLocation: true,
                    command: {
                        identify: true,
                        measure: true,
                        directions: true,
                    }
                }, tool )
            },
        }
    },
    actions: {
    },
}
