import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    data: function () {
        return {
            viewMap: false
        }
    },
    computed: {
        needsSave: function () {
            return this.$store.state.dirtyConfig
        },
        map: function () {
            var self = this

            return {
                create: function ( el ) {
                    var map = this

                    return SMK.INIT( {
                        containerSel: el,
                        config: [ self.$store.getters.config ],
                    } ).then( function ( smk ) {
                        map.smk = smk
                    } )
                },
                destroy: function ( el ) {
                    this.smk.destroy()
                }
            }
        }
    },
    methods: {
        save: function () {
            this.$store.dispatch( 'saveConfig' )
        },
        view: function () {
            M.Modal.getInstance( this.$refs.mapDialog ).open()
            this.viewMap = true
        }
    },
    mounted: function () {
        var self = this

        M.Modal.init( this.$refs.mapDialog, {
            onCloseEnd: function () {
                self.viewMap = false
            }
        } )
    }
} )
