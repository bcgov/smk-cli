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
                layerFilter: null,
                appliedLayerFilter: null,
                addCatalogUrl: null,
                editItemId: null,
                showEditItem: false,
                showAddCatalogUrl: false,
                addingCatalog: false
            }
        },
        computed: {
            wmsLayers: function () {
                return this.$store.getters.configLayersWms
            },
            catalogUrl: {
                get: function () {
                    if ( this.showAddCatalogUrl )
                        return '-other-'

                    return this.$store.state.wmsCatalogUrl
                },
                set: function ( url ) {
                    if ( url == '-other-' ) {
                        this.showAddCatalogUrl = true
                        return
                    }
                    this.showAddCatalogUrl = false
                    this.$store.commit( 'wmsCatalogUrl', url )
                }
            },
            catalogUrls: function () {
                return this.$store.state.wmsCatalogUrls
            }
        },
        methods: {
            loadCatalog: function () {
                try {
                    new URL( this.addCatalogUrl )
                    this.addingCatalog = true
                }
                catch ( e ) {
                    M.toast( { html: 'Invalid URL' } )
                }
            },
            addLayer: function ( item ) {
                var self = this

                fetch( `/catalog/wms/${ encodeURIComponent( this.catalogUrl ) }/${ item.id }` )
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
            },
            catalogError: function ( err ) {
                if ( this.addingCatalog ) {
                    M.toast( { html: 'Failed to loaded WMS catalog from ' + this.addCatalogUrl } )
                    this.addingCatalog = false
                }
                else {
                    M.toast( { html: 'Failed to loaded WMS catalog from ' + this.catalogUrl } )
                }
            },
            catalogLoaded: function () {
                if ( this.addingCatalog ) {
                    M.toast( { html: 'Loaded WMS catalog from ' + this.addCatalogUrl } )
                    this.$store.commit( 'addWmsCatalogUrl', this.addCatalogUrl )
                    this.addingCatalog = false
                    this.showAddCatalogUrl = false
                    this.catalogUrl = this.addCatalogUrl
                    this.addCatalogUrl = null
                    M.Collapsible.getInstance( this.$refs.collapsible ).close( 0 )
                }
                else {
                    M.toast( { html: 'Loaded WMS catalog from ' + this.catalogUrl } )
                    M.Collapsible.getInstance( this.$refs.collapsible ).close( 0 )
                }
            },
            catalogFiltered: function ( count ) {
                M.toast( { html: `Found ${ count } WMS catalog items matching filter` } )
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
            M.Collapsible.init( this.$refs.collapsible )
            M.FormSelect.init( this.$refs.catalogs )
        },
        updated: function () {
            M.FormSelect.init( this.$refs.catalogs )
        }
    } )
} )
