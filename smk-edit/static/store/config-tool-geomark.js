export default {
    filters: {
        'geomark': {
            get: function ( tool ) {
                return Object.assign( {
                    title: 'Geomark',
                    order: 3,
                    enableCreateFromFile: false
                }, tool )
            },
        }
    },
    actions: {
    }
}
