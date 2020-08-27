export default {
    filters: {
        'location': {
            get: function ( tool ) {
                return Object.assign( {
                    showHeader: false
                }, tool )
            },
        }
    },
    actions: {
    },
}
