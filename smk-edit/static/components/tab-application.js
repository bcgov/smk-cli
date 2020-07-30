import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
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
        }
    }
} )
