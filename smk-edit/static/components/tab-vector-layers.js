import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    data: function () {
        return {
            importType: null,
            importFile: null,
            importTitle: null,
            externalUrl: null,
            externalTitle: null,
        }
    },
    computed: {
        vectorLayers: function () {
            return this.$store.getters.vectorLayers
        },
        acceptFileTypes: function () {
            return ( {
                geojson:'.json, .geojson',
                kml:    '.kml, .kmz',
                shape:  '.zip',
                csv:    '.csv, .tsv',
            } )[ this.importType ]
        }
    },
    methods: {
        readFile: function ( ev ) {
            this.importTitle = null
            this.importFile = false

            this.$vectorFile = ev.target.files[ 0 ]
            if ( !this.$vectorFile ) return

            this.importFile = true
            var m = this.$vectorFile.name.match( /([^/\\.]+)[.]([^.]+)$/ )
            if ( m ) {
                this.importTitle = m[ 1 ]
            }
            else {
                this.importTitle = this.$vectorFile.name
            }
        },
        importLayer: function () {
        },
        resetImport: function () {
            this.importFile = false
            this.importTitle = null
            this.$refs.fileInputForm.reset()
            this.$vectorFile = null
        },
        addExternalLayer: function () {
        },
        resetExternal: function () {
            this.externalUrl = null
            this.externalUrl = null
        }
    },
    watch: {
        importType: function () {
            this.resetImport()
            // this.importFile = false
            // this.importTitle = null
            // this.$refs.fileInputForm.reset()
            // this.$vectorFile = null
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
