import { importComponents, vueComponent } from '../vue-util.js'

export default importComponents( [
    './components/tab-application.js',
    './components/tab-mpcm-layers.js',
    './components/tab-wms-layers.js',
    './components/tab-vector-layers.js',
    './components/tab-organize-layers.js',
    './components/tab-tools.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        components: {
            navTab : {
                template: `
                    <li v-bind:class="{ active: isActive }">
                        <a class="waves-effect"
                            v-bind:class="[ disabled ? 'grey-text' : 'white-text' ]"
                            v-on:click="openTab( name )"
                        ><i class="material-icons">{{ icon }}</i>{{ title }}</a>
                    </li>
                `,
                props: {
                    name: String,
                    title: String,
                    icon: String,
                    disabled: Boolean
                },
                methods: {
                    openTab: function ( tab ) {
                        if ( this.disabled ) return
                        this.$store.commit( 'activeTab', tab )
                    },
                },
                computed: {
                    isActive: function () {
                        return this.$store.state.activeTab == this.name;
                    },
                },
            }
        },
        computed: {
            layersActive: function () {
                return /layers/.test( this.$store.state.activeTab )
            }
        },
        mounted: function () {
            M.Sidenav.init( this.$refs.sidenav )
        }
    } )
} )