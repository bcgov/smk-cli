export default {
    filters: {
        'about': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 1,
                    position: 'list-menu',
                    title: 'About SMK',
                    content: 'Welcome to SMK'
                }, tool )
            },
        }
    },
    actions: {
    },
}
