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
                config: [ ${ JSON.stringify( this.config ) } ]
            } )
            .then( function ( smk ) {
                // SMK initialized
            } )
        </script>
    </body>
</html>
        ` }
    }
} )
