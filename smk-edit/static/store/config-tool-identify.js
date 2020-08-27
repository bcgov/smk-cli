export default {
    filters: {
        'identify': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 5,
                    position: 'list-menu',
                    icon: 'info_outline',
                    title: 'Identify Features',
                    command: {
                        select: true,
                        radius: false,
                        radiusUnit: false,
                        nearBy: true
                    },
                    radius: 5,
                    radiusUnit: 'px',
                }, tool )
            },
        }
    },
    actions: {
    },
}
