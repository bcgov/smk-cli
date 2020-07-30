import { vueComponent } from '../vue-util.js'

export default vueComponent( import.meta.url, {
    data: function () {
        return {
            lastTab: null
        }
    },
    methods: {
        tabSwitch: function (tab) {
            this.lastTab = this.$store.state.currentTab;
            this.$store.commit( 'currentTab', tab )
            // this.$store.currentTab = tab;
            // $('#contentPanel').show();
        },
    },
    computed: {
        currentTabComponent: function () {
            // this.componentKey += 1;
            if ( this.$store.state.currentTab )
                return this.$store.state.currentTab.toLowerCase();
        },
    },
    mounted: function () {
        M.Sidenav.init( this.$refs.sidenav )
        M.Collapsible.init( this.$refs.collapsible )
    }
} )
