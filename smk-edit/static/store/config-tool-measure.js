export default {
    filters: {
        'measure': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 6,
                    position: [ 'shortcut-menu', 'list-menu' ],
                    icon: 'straighten',
                    title: 'Measurement'
                }, tool )
            },
        }
    },
    actions: {
    },
}
