export default {
    filters: {
        'bespoke': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 1,
                    position: 'toolbar',
                    icon: 'now_widgets',
                    title: 'Bespoke Tool',
                    useComponent: true,
                    component: {
                        template: 'Custom content for tool'
                    }
                }, tool )
            },
        }
    },
    actions: {
    },
}
