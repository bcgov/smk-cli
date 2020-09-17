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
                        template: '<div>Custom content for tool</div>'
                    }
                }, tool )
            },
            set: function ( tool ) {
                if ( tool.useComponent )
                    if ( tool.component && tool.component.template )
                        if ( !/^</.test( tool.component.template.trim() ) )
                            tool.component.template = `<div>${ tool.component.template }</div>`

                return tool
            }
        }
    },
    actions: {
    },
}
