import { vueComponent } from '../vue-util.js'

Vue.directive( 'content', {
    bind: function ( el, binding ) {
        binding.value.create( el )
    },
    unbind: function ( el, binding ) {
        if ( binding.value.destroy ) binding.value.destroy( el )
    }
} )

export default vueComponent( import.meta.url, {
    data: function () {
        var self = this
        return {
            baseMaps: [],
            map: {
                create: function ( el ) {
                    var map = this

                    return SMK.INIT( {
                        containerSel: el,
                        config: [ 'hide-tool=all', 'show-tool=zoom,pan', {
                            viewer: {
                                baseMap: self.$store.getters.configViewerBaseMap,
                                location: JSON.parse( JSON.stringify( self.$store.getters.configViewerLocation ) )
                            }
                        } ]
                    } ).then( function ( smk ) {
                        self.$smk = smk

                        self.baseMaps = Object.entries( SMK.TYPE.Viewer.prototype.basemap )
                            .sort( function ( a, b ) { return a[ 1 ].order - b[ 1 ].order } )
                            .map( function ( kv ) { return { id: kv[ 0 ], title: kv[ 1 ].title } } )

                        smk.$viewer.changedView( function () {
                            var view = smk.$viewer.getView()
                            self.$store.commit( 'configViewerLocation', {
                                center: [ view.center.longitude, view.center.latitude ],
                                extent: view.extent,
                                zoom: view.zoom
                            } )
                        } )

                        map.update = function () {
                            smk.$viewer.map.invalidateSize()

                            var loc = self.$store.getters.configViewerLocation
                            var bx = loc.extent
                            smk.$viewer.map.fitBounds( [ [ bx[ 1 ], bx[ 0 ] ], [ bx[ 3 ], bx[ 2 ] ] ], { animate: false, duration: 0 } )
                            smk.$viewer.map.setZoom( loc.zoom, { animate: false } )
                            smk.$viewer.map.panTo( [ loc.center[ 1 ], loc.center[ 0 ] ], { animate: false } )
                        }
                    } )
                }
            }
        }
    },
    computed: {
        baseMap: {
            get: function () {
                return this.$store.getters.configViewerBaseMap
            },
            set: function ( val ) {
                var self = this
                if ( this.$smk ) {
                    this.$smk.$viewer.setBasemap( val )
                    Vue.nextTick( function () {
                        self.map.update()
                    } )
                }

                this.$store.commit( 'configViewerBaseMap', val )
            }
        },
    },
    destroyed: function () {
        this.$smk.destroy()
    }
} )
