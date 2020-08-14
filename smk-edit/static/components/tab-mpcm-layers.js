import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/catalog-tree.js',
    './components/edit-item.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                layerFilter: null,
                editItemId: null,
                showEditItem: false
            }
        },
        computed: {
            mpcmLayers: function () {
                return this.$store.getters.mpcmLayers
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
            clearFilter: function () {
                this.layerFilter = null
            },
            editItem: function ( itemId ) {
                this.editItemId = itemId
                this.showEditItem = true
            },
            removeItem: function ( itemId ) {
                this.$store.dispatch( 'configToolLayersDisplayItemRemove', itemId )
            }
        }
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
