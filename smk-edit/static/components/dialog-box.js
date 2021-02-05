import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: {
        showDialog: Boolean,
        dismissible: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        showDialog: function ( val ) {
            if ( val ) {
                M.Modal.getInstance( this.$refs.dialog ).open()
                this.$onUpdate = function () { this.$emit( 'opened' ) }
            }
            else {
                M.Modal.getInstance( this.$refs.dialog ).close()
                this.$onUpdate = function () { this.$emit( 'closed' ) }
            }
        }
    },
    mounted: function () {
        var self = this

        M.Modal.init( this.$refs.dialog, {
            dismissible: this.dismissible,
            onCloseEnd: function () {
                self.$emit( 'update:showDialog', false )
            }
        } )
    },
    updated: function () {
        if ( !this.$onUpdate ) return

        this.$onUpdate.call( this )
        this.$onUpdate = null
    }
} )
