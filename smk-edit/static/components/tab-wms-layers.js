import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/catalog-tree.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                layerFilter: null,
                wmsUrl: 'https://openmaps.gov.bc.ca/geo/pub/wms',
            }
        },
        computed: {
            wmsLayers: function () {
                return this.$store.getters.wmsLayers
            },
            catalogUrl: function () {
                return this.$store.state.wmsCatalogUrl
            }
        },
        methods: {
            loadCatalog: function () {
                this.$store.commit( 'wmsCatalogUrl', `/catalog/wms/${ encodeURIComponent( this.wmsUrl ) }` )
            },
            addLayer: function ( item ) {
                var self = this

                fetch( `${ this.catalogUrl }/${ item.id }` )
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

                // self.$store.commit( 'configLayersAppend', item )
            },
            clearFilter: function () {
                this.layerFilter = null
            }
        },
        mounted: function () {
            M.textareaAutoResize( this.$refs.wmsUrl )
        }
    } )
} )
