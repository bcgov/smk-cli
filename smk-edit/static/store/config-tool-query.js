export default {
    filters: {
        'query': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 5,
                    within: false,
                    command: {
                        within: true,
                        select: true,
                    },
                }, tool )
            },
        }
    },
    actions: {
    },
}
