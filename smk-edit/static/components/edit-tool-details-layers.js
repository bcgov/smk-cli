import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/edit-tool-details.js',
    './components/dialog-choose-icon.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        data: function () {
            return {
                showGlyph: false,
                editGlyph: null
            }
        },
        computed: {
            commandAllVisibility: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.allVisibility
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', allVisibility: val } )
                }
            },
            commandFilter: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.filter
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', filter: val } )
                }
            },
            commandLegend: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.legend
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', legend: val } )
                }
            },
            glyphVisible: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).glyph.visible
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'glyph', visible: val } )
                }
            },
            glyphHidden: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).glyph.hidden
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'glyph', hidden: val } )
                }
            },
            glyph: function () {
                if ( !this.editGlyph ) return
                return this[ 'glyph' + this.editGlyph ]
            }
        },
        methods: {
            setGlyph: function ( editGlyph ) {
                this.editGlyph = editGlyph
                this.showGlyph = true
            },
            selectGlyph: function ( icon ) {
                if ( !this.editGlyph ) return
                this[ 'glyph' + this.editGlyph ] = icon
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
