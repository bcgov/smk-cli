import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: [ 'showDialog' ],
    watch: {
        showDialog: function ( val ) {
            if ( val ) {
                M.Modal.getInstance( this.$refs.dialog ).open()
            }
            else {
                M.Modal.getInstance( this.$refs.dialog ).close()
            }
        }
    },
    mounted: function () {
        var self = this

        M.Modal.init( this.$refs.dialog, {
            onCloseEnd: function () {
                self.$emit( 'update:showDialog', false )
            }
        } )
    },
} )
