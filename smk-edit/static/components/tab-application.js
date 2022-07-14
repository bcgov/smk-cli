import { vueComponent, importComponents } from '../vue-util.js'
import { baseMaps } from './presentation.js'

export default importComponents( [
    './components/smk-map.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                baseMaps: baseMaps
            }
        },
        computed: {
            name: {
                get: function () {
                    return this.$store.getters.configName
                }
            },
            viewerType: {
                get: function () {
                    return this.$store.getters.configViewerType
                },
                set: function ( val ) {
                    this.$store.commit( 'configViewerType', val )
                }
            },
            viewerDevice: {
                get: function () {
                    return this.$store.getters.configViewerDevice
                },
                set: function ( val ) {
                    this.$store.commit( 'configViewerDevice', val )
                }
            },
            baseMap: {
                get: function () {
                    return this.$store.getters.configViewerBaseMap
                },
                set: function ( val ) {
                    this.location = null
                    this.$store.commit( 'configViewerBaseMap', val )
                }
            },
            esriApiKey: {
                get: function () {
                    return this.$store.getters.configViewerEsriApiKey
                },
                set: function ( val ) {
                    this.location = null
                    this.$store.commit( 'configViewerEsriApiKey', val )
                }
            },
            selectedBasemapIsEsriType: function() {
                for (const bm of baseMaps) {
                    if(bm.id == this.$store.getters.configViewerBaseMap && bm.type === "ESRI") {
                        return true;
                    }
                }
                return false;
            },
            hasMapConfig: function () {
                return this.$store.getters.hasConfig
            },
            mapConfig: function () {
                if ( !this.location )
                    this.location = this.$store.getters.configViewerLocation

                return [
                    'hide-tool=all',
                    'show-tool=zoom,pan',
                    {
                        viewer: {
                            baseMap: this.$store.getters.configViewerBaseMap,
                            esriApiKey: this.$store.getters.configViewerEsriApiKey,
                            location: JSON.parse( JSON.stringify( this.location ) )
                        }
                    }
                ]
            }
        },
        methods: {
            changedView: function ( view ) {
                this.$store.commit( 'configViewerLocation', {
                    center: [ view.center.longitude, view.center.latitude ],
                    extent: view.extent,
                    zoom: view.zoom
                } )
            }
        },
    } )
} )