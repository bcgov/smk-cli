export default {
    filters: {
        'list-menu': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 1,
                    icon: 'menu',
                    position: 'toolbar'
                }, tool )
            },
        }
    },
    actions: {
    },
}
