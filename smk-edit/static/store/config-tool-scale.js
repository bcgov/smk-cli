export default {
    filters: {
        'scale': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 2,
                    showFactor: true,
                    showBar: true,
                    showZoom: false,
                }, tool )
            },
        }
    },
    actions: {
    },
}
