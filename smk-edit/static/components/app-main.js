import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    computed: {
        currentTabComponent: function () {
            if ( this.$store.state.currentTab )
                return this.$store.state.currentTab.toLowerCase();
        }
    }
} )
