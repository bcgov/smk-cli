import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-item.js',
    './components/materialize.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                importType: null,
                importFile: null,
                importTitle: null,
                externalUrl: null,
                externalTitle: null,
                catalogKey: 1,
                editItemId: null,
                showEditItem: false,
                showImportOptions: false,
                importMethod: 'latlong',
                importLatProperty: null,
                importLongProperty: null,
                importProperties: null
            }
        },
        computed: {
            vectorLayers: function () {
                return this.$store.getters.configLayersVector
            },
            acceptFileTypes: function () {
                return ( {
                    geojson:'.json, .geojson, .zip',
                    kml:    '.kml, .kmz, .zip',
                    shape:  '.zip',
                    csv:    '.csv, .tsv, .zip',
                } )[ this.importType ]
            },
            vectorCatalog: function () {
                return []
            },
        },
        methods: {
            readFile: function ( ev ) {
                this.importTitle = null
                this.importFile = false

                this.$vectorFile = ev.target.files[ 0 ]
                if ( !this.$vectorFile ) return

                this.importFile = true

                var m = this.$vectorFile.name.match( /(^|[/\\])([^/\\.]+)[.](.+)$/ )
                this.importTitle = m ? m[ 2 ] : this.$vectorFile.name
            },
            importFilename: function () {
                if ( !this.$vectorFile ) return
                return this.$vectorFile.name
            },
            importLayer: function () {
                var self = this

                var formData = new FormData()
                formData.append( 'file', this.$vectorFile )

                return fetch( `/convert/${ this.importType }`, {
                    method: 'POST',
                    cache: 'no-cache',
                    body: formData
                } )
                .then( function( resp ) {
                    return resp.json()
                } )
                .then( function ( result ) {
                    if ( !result.ok ) throw Error( result.message )

                    M.toast( { html: result.message } )

                    return result.data
                } )
                .then( function ( data ) {
                    if ( self.importType != 'csv' ) return data

                    self.showImportOptions = true
                    self.importProperties = Object.keys( data[ 0 ] )
                    self.importLongProperty = self.importProperties.find( function ( p ) { return /^long/i.test( p ) } )
                    self.importLatProperty = self.importProperties.find( function ( p ) { return /^lat/i.test( p ) } )

                    return new Promise( function ( res, rej ) {
                        self.continueImportOptions = function ( ok ) { return ok ? res( data ) : rej() }
                    } )
                    .then( function ( data ) {
                        return {
                            type: 'FeatureCollection',
                            features: data.map( function ( row ) {
                                return {
                                    type: 'Feature',
                                    properties: row,
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [
                                            parseFloat( row[ self.importLongProperty ] ),
                                            parseFloat( row[ self.importLatProperty ] ),
                                        ]
                                    }
                                }
                            } )
                        }
                    } )
                } )
                .then( function ( data ) {
                    var formData = new FormData()
                    formData.append( 'file', JSON.stringify( data ) )
                    formData.append( 'layer', JSON.stringify( {
                        title: self.importTitle.trim()
                    } ) )

                    return fetch( '/catalog/local', {
                        method: 'POST',
                        cache: 'no-cache',
                        body: formData
                    } )
                } )
                .then( function( resp ) {
                    return resp.json()
                } )
                .then( function ( result ) {
                    if ( !result.ok ) throw Error( result.message )

                    self.catalogKey += 1
                    M.toast( { html: result.message } )
                    M.Collapsible.getInstance( self.$refs.collapsible ).close( 0 )
                    self.resetImport()
                } )
                .catch( function ( err ) {
                    if ( err )
                        M.toast( { html: err.toString().replace( /^(Error: )+/, '' ) } )
                } )

            },
            closeImportOptions: function ( ok ) {
                this.showImportOptions = false
                if ( !this.continueImportOptions ) return

                this.continueImportOptions( ok )
                this.continueImportOptions = null
            },
            resetImport: function () {
                this.importFile = false
                this.importTitle = null
                this.$refs.fileInputForm.reset()
                this.$vectorFile = null
            },
            addExternalLayer: function () {
                var self = this

                try {
                    new URL( this.externalUrl )
                }
                catch ( e ) {
                    M.toast( { html: 'Invalid URL' } )
                    return
                }

                var formData = new FormData()
                formData.append( 'layer', JSON.stringify( {
                    title: this.externalTitle.trim(),
                    dataUrl: this.externalUrl.trim()
                } ) )

                return fetch( `/catalog/local`, {
                    method: 'POST',
                    cache: 'no-cache',
                    body: formData
                } )
                .then( function( resp ) {
                    return resp.json()
                } )
                .then( function ( result ) {
                    if ( !result.ok ) throw Error( result.message )
                    self.catalogKey += 1
                    M.toast( { html: result.message } )
                    M.Collapsible.getInstance( self.$refs.collapsible ).close( 1 )
                    self.resetExternal()
                } )
                .catch( function ( err ) {
                    M.toast( { html: err.toString().replace( /^(Error: )+/, '' ) } )
                } )
            },
            resetExternal: function () {
                this.externalUrl = null
                this.externalTitle = null
            },
            addLayer: function ( item ) {
                var self = this

                fetch( '/catalog/local/' + item.id )
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
            catalogError: function ( err ) {
                M.toast( {
                    html: err
                } )
            },
            editItem: function ( itemId ) {
                this.editItemId = itemId
                this.showEditItem = true
            },
            removeItem: function ( itemId ) {
                this.$store.dispatch( 'configToolLayersDisplayItemRemove', itemId )
            }
        },
        watch: {
            importType: function () {
                this.resetImport()
            }
        },
        mounted: function () {
            M.Collapsible.init( this.$refs.collapsible )
            M.FormSelect.init( this.$refs.vectorType )
        },
        updated: function () {
            M.updateTextFields()
        }
    } )
} )