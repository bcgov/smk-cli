import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    computed: {
        needsSave: function () {
            return this.$store.state.dirtyConfig
        }
    },
    methods: {
        save: function () {
            this.$store.dispatch( 'saveConfig' )
        }
    }
} )
