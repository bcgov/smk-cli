import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            commandSelect: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.select
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', select: val } )
                }
            },
            commandRadius: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.radius
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', radius: val } )
                    if ( !val ) this.commandRadiusUnit = null
                }
            },
            commandRadiusUnit: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.radiusUnit
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', radiusUnit: val } )
                }
            },
            commandNearBy: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.nearBy
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', nearBy: val } )
                }
            },
            commandAttributeMode: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.attributeMode
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', attributeMode: val } )
                }
            },
            radius: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).radius
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, radius: val } )
                }
            },
            radiusUnit: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).radiusUnit
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, radiusUnit: val } )
                }
            },
            showWidget: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showWidget
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showWidget: val } )
                }
            },
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
