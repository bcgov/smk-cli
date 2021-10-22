import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            geomarkServiceUrl: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).geomarkService.url
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'geomarkService', url: val } )
                }
            },
        }
    } )
} )