import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/catalog-tree.js',
    './components/edit-item.js',
    './components/materialize.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                showFilter: false,
                layerFilter: null,
                appliedLayerFilter: null,
                editItemId: null,
                showEditItem: false
            }
        },
        computed: {
            mpcmLayers: function () {
                return this.$store.getters.configLayersMpcm
            },
        },
        methods: {
            addLayer: function ( item ) {
                var self = this

                fetch( '/catalog/mpcm/' + item.id )
                    .then( function ( resp ) {
                        if ( !resp.ok ) throw Error( 'request failed' )
                        return resp.json()
                    } )
                    .then( function ( layer ) {
                        self.$store.commit( 'configLayersAppend', layer )
                    } )
                    .catch( function ( err ) {
                        M.toast( { html: err.toString().replace( /^(Error: )+/, '' ) } )
                    } )
            },
            applyFilter: function () {
                this.appliedLayerFilter = this.layerFilter
            },
            clearFilter: function () {
                this.layerFilter = null
                this.appliedLayerFilter = null
                M.Collapsible.getInstance( this.$refs.collapsible ).close( 0 )
            },
            catalogError: function ( err ) {
                M.toast( { html: 'Failed to loaded MPCM catalog' } )
            },
            catalogLoaded: function () {
                M.toast( { html: 'Loaded MPCM catalog' } )
            },
            catalogFiltered: function ( count ) {
                M.toast( { html: `Found ${ count } MPCM catalog items matching filter` } )
            },
            editItem: function ( itemId ) {
                this.editItemId = itemId
                this.showEditItem = true
            },
            removeItem: function ( itemId ) {
                this.$store.dispatch( 'configToolLayersDisplayItemRemove', itemId )
            }
        },
        mounted: function () {
            var self = this

            M.Collapsible.init( this.$refs.collapsible, {
                onOpenEnd: function ( el ) {
                    if ( el.dataset.index == 1 )
                        self.showFilter = true
                },
                onCloseEnd: function () {
                    self.showFilter = false
                    self.showAddCatalogUrl = false
                }
            } )
        },

    } )
} )



// function addSelectedCatalogLayer()
// {
// 	var nodes = $("#catalog-tree").fancytree('getTree').getSelectedNodes();

// 	nodes.forEach(function(node)
//    	{
// 		if(node.folder == false && node.data.mpcmId != 0)
// 		{
// 			$.ajax
// 			({
// 				url: serviceUrl + 'LayerLibrary/' + node.data.mpcmId,
// 				type: 'get',
// 				dataType: 'json',
// 				contentType:'application/json',
// 				success: function (catalogItem)
// 				{
// 					if(catalogItem.mpcmWorkspace == "MPCM_ALL_PUB")
// 					{
// 						catalogItem.isVisible = true;
// 						catalogItem.isQueryable = true;

// 						addLayerToConfig(catalogItem);
// 					}
// 					else
// 					{
// 						M.toast({ html: 'Error loading MPCM Layer. This layer may be secure.'});
// 					}
// 				},
// 				error: function (status)
// 				{
// 					M.toast({ html: 'Error loading MPCM Layer. This layer may be secure.'});
// 				}
// 			});
// 		}

// 		node.setSelected(false);
//    	});
// }
