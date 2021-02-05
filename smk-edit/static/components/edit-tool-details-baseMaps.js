import { vueComponent, importComponents } from '../vue-util.js'
import { baseMaps } from './presentation.js'

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            baseMaps: function () { return baseMaps },
            choices: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).choices || []
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, choices: val } )
                }
            },
            mapStyleWidth: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).mapStyle.width.slice( 0, -2 )
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'mapStyle', width: val + 'px' } )
                }
            },
            mapStyleHeight: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).mapStyle.height.slice( 0, -2 )
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'mapStyle', height: val + 'px' } )
                }
            },
        },
        methods: {
            setChoice: function ( id, val ) {
                var c = this.choices
                if ( val ) {
                    c.push( id )
                }
                else {
                    c = c.filter( function ( x ) { return x != id } )
                }
                this.choices = c
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
