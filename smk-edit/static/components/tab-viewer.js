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
            location: this.$store.getters.configViewerLocation,
            baseMaps: [
                {
                    id: 'Topographic',
                    title: 'Topographic',
                },
                {
                    id: 'Streets',
                    title: 'Streets'
                },
                {
                    id: 'Imagery',
                    title: 'Imagery',
                },
                {
                    id: 'Oceans',
                    title: 'Oceans'
                },
                {
                    id: 'NationalGeographic',
                    title: 'National Geographic'
                },
                {
                    id: 'ShadedRelief',
                    title: 'Shaded Relief'
                },
                {
                    id: 'DarkGray',
                    title: 'Dark Gray'
                },
                {
                    id: 'Gray',
                    title: 'Gray'
                },
                {
                    id: 'StamenTonerLight',
                    title: 'Stamen Toner Light'
                },
            ],
        }
    },
    computed: {
        baseMap: {
            get: function () {
                return this.$store.getters.configViewerBaseMap
            },
            set: function ( val ) {
                this.location = this.$store.getters.configViewerLocation
                this.$store.commit( 'configViewerBaseMap', val )
            }
        },
        mapConfig: function () {
            return [
                'hide-tool=all',
                'show-tool=zoom,pan',
                {
                    viewer: {
                        baseMap: this.$store.getters.configViewerBaseMap,
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
    }
} )
