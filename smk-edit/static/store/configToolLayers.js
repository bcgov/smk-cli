export default {
    getters: {
        configToolLayersDisplay: function ( state, getters ) {
            return function () {
                var d = getters.configTool( 'layers' ).display
                if ( d ) return d

                return getters.configLayers.map( function ( ly ) {
                    return {
                        id: ly.id
                    }
                } )
            }
        },
        configToolLayersDisplayItem: function ( state, getters ) {
            return function ( itemId ) {
                var items = displayItemsFind( getters.configToolLayersDisplay(), function ( item ) {
                    return item.id == itemId
                } )
                if ( items.length != 1 ) throw Error( `Display item "${ itemId }" not found` )
                return items[ 0 ]
            }
        }
    },
    actions: {
        configToolLayersDisplay: function ( context, display ) {
            var tool = context.getters.configTool( 'layers' )
            tool.display = display
            context.commit( 'configTool', tool )
        }
    },
}

function displayItemsFind( items, pred ) {
    return items.reduce( function ( acc, item ) {
        if ( pred( item ) ) acc.push( item )
        if ( !item.items ) return acc
        return acc.concat( displayItemsFind( item.items, pred ) )
    }, [] )
}