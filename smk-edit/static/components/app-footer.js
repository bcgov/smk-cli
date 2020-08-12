import { importComponents, vueComponent } from '../vue-util.js'

export default importComponents( [
    './components/dialog-box.js',
    './components/smk-map.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                viewMap: false
            }
        },
        computed: {
            needsSave: function () {
                return this.$store.state.dirtyConfig
            },
            mapConfig: function () {
                return this.$store.getters.config
            }
        },
        methods: {
            save: function () {
                this.$store.dispatch( 'saveConfig' )
            },
            view: function () {
                this.viewMap = true
            }
        },
    } )
} )