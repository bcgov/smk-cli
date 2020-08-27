export default {
    filters: {
        'select': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 6,
                    position: 'list-menu',
                    icon: 'select_all',
                    title: 'Selected Features',
                    command: {
                        clear: true,
                        remove: true,
                    }
                }, tool )
            },
        }
    },
    actions: {
    },
}
