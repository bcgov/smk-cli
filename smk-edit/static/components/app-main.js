import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    computed: {
        activeTabComponent: function () {
            return this.$store.state.activeTab
        }
    }
} )
