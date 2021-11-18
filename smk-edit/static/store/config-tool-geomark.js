export default {
    filters: {
        'geomark': {
            get: function ( tool ) {
                return Object.assign( {
                    title: 'Geomark',
                    order: 3,
                    geomarkService: {
                        url: 'https://apps.gov.bc.ca/pub/geomark'
                    },
                    enableCreateFromFile: false
                }, tool )
            },
        }
    },
    actions: {
    }
}
