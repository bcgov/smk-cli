export default {
    filters: {
        'version': {
            get: function ( tool ) {
                return Object.assign( {
                    title: 'Version Info',
                    position: 'list-menu',
                    order: 99,
                    icon: 'build',
                }, tool )
            },
        }
    },
    actions: {
    },
}
