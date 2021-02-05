export default {
    filters: {
        'zoom': {
            get: function ( tool ) {
                return Object.assign( {
                    // order: 1,
                    mouseWheel: true,
                    doubleClick: true,
                    box: true,
                    control: true,
                }, tool )
            },
        }
    },
    actions: {
    },
}
