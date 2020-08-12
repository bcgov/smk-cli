import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: [ 'config' ],
    computed: {
        doc: function () { return `
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SMK</title>
        <style>
            #smk-map-frame {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
                padding: 0;
            }
        </style>
    </head>

    <body>
        <div id="smk-map-frame"></div>

        <script src="${ this.$store.state.smkUrl }"></script>
        <script>
            SMK.INIT( {
                containerSel: '#smk-map-frame',
                config: ${ JSON.stringify( [].concat( this.config ) ) }
            } )
            .then( function ( smk ) {
                smk.$viewer.changedView( function () {
                    emit( 'changed-view', smk.$viewer.getView() )
                } )
            } )

            function emit( event, arg ) {
                window.parent.postMessage( {
                    event: event,
                    args: [].slice.call( arguments, 1 )
                }, '*' )
            }
        </script>
    </body>
</html>
        ` }
    },
    methods: {
        receiveMessage: function ( event ) {
            // console.log( event )
            if ( event.data.event )
                this.$emit( event.data.event, ...event.data.args )
        }
    },
    mounted: function () {
        this.$messageListener = this.receiveMessage.bind( this )
        window.addEventListener( 'message', this.$messageListener, false )
    },
    destroyed: function () {
        if ( this.$messageListener )
            window.removeEventListener( 'message', this.$messageListener, false )
    }
} )
