import { vueComponent, importComponents } from '../vue-util.js'

var mpcmCatalogCache

export default importComponents( [
    './components/catalog-item.js',
    './components/catalog-tree.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                catalogLoading: false,
                layerFilter: null
            }
        },
        computed: {
            mpcmLayers: function () {
                return this.$store.getters.mpcmLayers
            },
            mpcmCatalog: function () {
                return this.catalogLoading ? [] : mpcmCatalogCache || []
            },
        },
        methods: {
            addLayer: function ( item ) {
                var self = this

                // console.log(item)
                fetch( '/mpcm-catalog/' + item.mpcmId )
                    .then( function ( resp ) {
                        if ( !resp.ok ) throw Error( 'request failed' )
                        return resp.json()
                    } )
                    .then( function ( layer ) {
                        self.$store.commit( 'configLayersAppend', layer )
                    } )
                    .catch( function ( err ) {
                        M.toast( {
                            html: 'Error: ' + JSON.stringify( err )
                        } )
                    } )
            },
            clearFilter: function () {
                this.layerFilter = null
            }
        },
        mounted: function () {
            var self = this
            this.catalogLoading = true
            loadMpcmCatalog().finally( function () {
                self.catalogLoading = false
            } )
        }
    } )
} )


function loadMpcmCatalog() {
    if ( mpcmCatalogCache ) return Promise.resolve()

    return fetch( '/mpcm-catalog' )
        .then( function ( resp ) {
            if ( !resp.ok ) throw Error( 'request failed' )
            return resp.json()
        } )
        .then( function ( catalog ) {
            mpcmCatalogCache = convertCatalog( catalog )
        } )
        .catch( function ( err ) {
            M.toast( {
                html: 'Error: ' + JSON.stringify( err )
            } )
        } )
}

function convertCatalog( catalog ) {
    if ( !catalog ) return []
    return catalog.map( function ( i ) {
        return convertCatalogItem( i )
    } )
}

function convertCatalogItem( catalogItem ) {
    var children = [].concat( catalogItem.folders ).concat( catalogItem.layers )
        .filter( function ( item ) { return !!item } )
        .map( function ( item ) { return convertCatalogItem( item ) } )

	return {
        title: catalogItem.label,
        folder: children.length > 0,
        expanded: false,
        data: catalogItem,
        children: children
    }
}



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
