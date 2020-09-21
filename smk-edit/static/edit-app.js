import { store } from './store.js'
import { importComponents } from './vue-util.js'

importComponents( [
    './components/app-header.js',
    './components/app-main.js',
    './components/app-footer.js',
    './components/materialize.js',
] ).then( function () {
    var app = new Vue( {
        el: '#app',
        store: store,
        computed: {
            serviceStatus: function () {
                return this.$store.state.serviceStatus
            }
        },
    } )

    app.$store.commit( 'activeTab', 'tab-application' )

    app.$store.dispatch( 'loadConfig' )

    app.$store.watch(
        function ( state ) {
            return state.serviceStatus
        },
        function ( val ) {
            if ( val ) return

            M.toast( { html: 'Service not responding. Please restart the SMK Edit service.' } )
        }
    )

    statusCheck()
    function statusCheck() {
        app.$store.dispatch( 'statusCheck' )

        setTimeout( statusCheck, app.$store.state.statusPingInterval )
    }
} )
