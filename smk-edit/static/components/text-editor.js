import { vueComponent, importComponents } from '../vue-util.js'

const editorButton = {
    props: [ 'icon', 'title', 'disabled' ],
    data: function () {
        return {
            state: false,
        }
    },
    template: `
        <span class="editor-button" ref="button"
            v-bind:title="title"
            v-bind:class="[ state ? 'active' : state == null ? 'unknown' : 'inactive', disabled && 'disabled' ]"
            v-on:click="onClick"
        ><i class="material-icons">{{ icon }}</i></span>
    `,
    methods: {
        onClick: function () {
            if ( this.disabled ) return

            this.$emit( 'click' )
        },
    },
}

const editorCommand = {
    mixins: [ editorButton ],
    props: [ 'command' ],
    methods: {
        onClick: function () {
            if ( this.disabled ) return
            if ( !this.editor ) return

            this.execCommand()
        },
        execCommand: function ( arg ) {
            this.editor.contentWindow.document.execCommand( this.command, false, arg || null );
            this.syncState()

            var win = this.editor.contentWindow
            var range = win.document.createRange()
            range.setStart( win.document.body, 0 )
            range.setEnd( win.document.body, 0 )
            win.document.body.focus()
            win.getSelection().addRange( range )

            this.$parent.changedContent()
        },
        syncState: function () {
            if ( this.disabled ) return
            this.state = this.editor.contentWindow.document.queryCommandState( this.command )
        }
    },
    mounted: function () {
        var self = this

        this.editor = this.$parent.$refs.editor
        this.syncState()
        this.editor.contentWindow.document.addEventListener( "selectionchange", function() {
            self.syncState()
        } )
    }
}

const editorSpectrum = {
    mixins: [ editorCommand ],
    watch: {
        disabled: function ( val ) {
            $( this.$refs.button ).spectrum( val ? 'disable' : 'enable' )
        }
    },
    methods: {
        onClick: function () {}
    },
    mounted: function () {
        var self = this

        $( this.$refs.button ).spectrum( {
            color: '#00000000',
            disabled: this.disabled,
            showButtons: true,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'More >>',
            togglePaletteLessText: '<< Less',
            hideAfterPaletteSelect:true,
            clickoutFiresChange: true,
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ],
            hide: function ( color ) {
                self.execCommand( color.toName() || color.toHexString() )
                $( self.$refs.button ).spectrum( 'set', '#00000000' )
            }
        } )
    },
}

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        components: {
            'editor-button': editorButton,
            'editor-command': editorCommand,
            'editor-spectrum': editorSpectrum,
        },
        props: {
            value: String
        },
        data: function () {
            return {
                display: 'styled',
                formatBlock: '',
                raw: null
            }
        },
        watch: {
            formatBlock: function ( val ) {
                if ( !val ) return
                this.$refs.editor.contentWindow.document.execCommand( 'formatBlock', false, val )
                this.changedContent()
                this.formatBlock = ''
            },
            raw: function ( val ) {
                this.$emit( 'input', val )
            }
        },
        computed: {
            showStyled: function () { return this.display == 'styled' },
            showRaw: function () { return this.display == 'raw' },
        },
        methods: {
            loadContent: function () {
                if ( this.$refs.editor.contentWindow.document.body.innerHTML != this.value )
                    this.$refs.editor.contentWindow.document.body.innerHTML = this.value

                if ( this.showRaw )
                    this.raw = this.value
            },
            changedContent: function () {
                this.$emit( 'input', this.$refs.editor.contentWindow.document.body.innerHTML )
            },
            makePretty: function () {
                this.raw = html_beautify( this.raw, true, true )
            }
        },
        mounted: function () {
            var self = this

            this.$refs.editor.contentWindow.document.designMode = "on";
            this.$refs.editor.contentWindow.document.addEventListener( "keyup", function() {
                self.changedContent()
            } )

            this.loadContent()
        },
        updated: function () {
            this.loadContent()
        },
        destroyed: function () {
        }
    } )
} )
