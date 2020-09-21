import { vueComponent, importComponents } from '../vue-util.js'
import { toolTypePresentation } from './presentation.js'

export default importComponents( [
    './components/dialog-choose-icon.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        data: function () {
            return {
                showIcons: false,
            }
        },
        computed: {
            toolTitle: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).title
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, title: val } )
                }
            },
            showTitle: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showTitle
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showTitle: val } )
                }
            },
            icon: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).icon
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, icon: val } )
                }
            },
            toolPosition: {
                get: function () {
                    return ( [].concat( this.$store.getters.configTool( this.toolType, this.toolInstance ).position ) )[ 0 ]
                },
                set: function ( val ) {
                    var pos = this.$store.getters.configTool( this.toolType, this.toolInstance ).position
                    if ( Array.isArray( pos ) )
                        val = [].concat( val ? val : [] ).concat( pos.filter( function ( p ) { return p != val } ) )
                    return this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, position: val } )
                }
            },
            positions: function () {
                var self = this
                return this.$store.getters.configEnabledTools
                    .filter( function ( t ) {
                        return self.toolType != t.type && toolTypePresentation[ t.type ].position
                    } )
                    .map( function ( t ) {
                        return t.type
                    } )
            },
            order: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).order
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, order: val } )
                }
            },
        },
        methods: {
            setIcon: function () {
                this.showIcons = true
            },
            selectIcon: function ( icon ) {
                this.icon = icon
            }
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
        },
        updated: function () {
        }
    } )
} )
