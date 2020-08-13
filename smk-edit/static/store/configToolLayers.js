export default {
    getters: {
        configToolLayersDisplay: function ( state, getters ) {
            return getters.version && function () {
                var d = getters.configTool( 'layers' ).display
                if ( !d ) d = getters.configLayers.map( function ( ly ) { return { id: ly.id } } )

                return {
                    id: '-top-',
                    type: 'folder',
                    title: 'Top Level',
                    items: d
                }
            }
        },
        configToolLayersDisplayItem: function ( state, getters ) {
            return getters.version && function ( itemId ) {
                if ( itemId == '-top-' ) return getters.configToolLayersDisplay()

                var items = displayItemsFind( getters.configToolLayersDisplay().items, function ( item ) {
                    return item.id == itemId
                } )
                if ( items.length != 1 ) throw Error( `Display item "${ itemId }" not found` )

                return items[ 0 ]
            }
        },
        configToolLayersDisplayItemCollections: function ( state, getters ) {
            return getters.version && function () {
                return allCollections( getters.configToolLayersDisplay() )
            }
        },
        configToolLayersDisplayItemParent: function ( state, getters ) {
            return getters.version && function ( itemId ) {
                return allCollections( getters.configToolLayersDisplay() ).find( function ( c ) {
                    return c.items.some( function ( i ) { return i.id == itemId } )
                } )
            }
        },
    },
    actions: {
        configToolLayersDisplay: function ( context, display ) {
            var tool = context.getters.configTool( 'layers' )

            if ( Array.isArray( display ) ) {
                tool.display = display
            }
            else if ( display.items ) {
                tool.display = display.items
            }
            else {
                throw Error( 'oops' )
            }

            context.commit( 'configTool', tool )
            context.commit( 'bumpVersion' )
        },
        configToolLayersDisplayItem: function ( context, item ) {
            var display = context.getters.configToolLayersDisplay()

            displayItemsFind( display, function ( displayItem ) {
                if ( displayItem.id == item.id ) {
                    Object.assign( displayItem, item )
                    return true
                }
            } )

            context.dispatch( 'configToolLayersDisplay', display )
        },
        configToolLayersDisplayCollection: function ( context, collection ) {
            var display = context.getters.configToolLayersDisplay()
            var col = allCollections( display ).find( function ( c ) {
                return c.id == collection.id
            } )

            col.items = collection.items

            context.dispatch( 'configToolLayersDisplay', display )
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

function allCollections( collection ) {
    return [ collection ].concat( collection.items.reduce( function ( acc, item ) {
        if ( !item.items ) return acc
        return acc.concat( allCollections( item ) )
    }, [] ) )
}
