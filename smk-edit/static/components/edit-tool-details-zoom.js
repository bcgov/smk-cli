import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            mouseWheel: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).mouseWheel
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, mouseWheel: val } )
                }
            },
            doubleClick: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).doubleClick
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, doubleClick: val } )
                }
            },
            box: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).box
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, box: val } )
                }
            },
            control: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).control
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, control: val } )
                }
            },
        },
        mounted: function () {
            M.updateTextFields()
        },
        updated: function () {
        }
    } )
} )
