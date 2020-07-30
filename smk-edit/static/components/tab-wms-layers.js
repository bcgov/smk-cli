import { vueComponent, importComponents } from '../vue-util.js'

var wmsCatalogCache

export default importComponents( [
    './components/catalog-item.js',
    './components/catalog-tree.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                catalogLoading: false,
                layerFilter: null,
                wmsUrl: 'https://openmaps.gov.bc.ca/geo/pub/wms?version=1.3.0&service=wms&request=GetCapabilities'
            }
        },
        computed: {
            wmsLayers: function () {
                return this.$store.getters.wmsLayers
            },
            wmsCatalog: function () {
                return this.catalogLoading ? [] : wmsCatalogCache || []
            },
        },
        methods: {
            loadCatalog: function () {
                var self = this

                this.catalogLoading = true
                return fetch( `/wms-catalog/${ encodeURIComponent( this.wmsUrl ) }` )
                    .then( function ( resp ) {
                        if ( !resp.ok ) throw Error( 'request failed' )
                        return resp.json()
                    } )
                    .then( function ( catalog ) {
                        wmsCatalogCache = convertCatalog( catalog )
                    } )
                    .catch( function ( err ) {
                        M.toast( {
                            html: 'Error: ' + JSON.stringify( err )
                        } )
                    } )
                    .finally( function () {
                        self.catalogLoading = false
                    } )
            },
            addLayer: function ( item ) {
                self.$store.commit( 'configLayersAppend', item )
            },
            clearFilter: function () {
                this.layerFilter = null
            }
        }
    } )
} )

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
        title: catalogItem.title,
        folder: children.length > 0,
        expanded: false,
        data: catalogItem,
        children: children
    }
}

