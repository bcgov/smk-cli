import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: {
        filter: String,
        src: String,
        allowedEdit: Function,
        allowedRemove: Function
    },
    data: function () {
        return {
            loading: false,
            loaded: false
        }
    },
    watch: {
        src: function () {
            this.load()
        },
        filter: function () {
            if ( !this.$refs.container ) return
            var tree = $( this.$refs.container ).fancytree( 'getTree' )

            if ( this.filter && this.filter.length > 1 ) {
                var hits = tree.filterBranches( this.filter )
                this.$emit( 'filtered', hits )
            }
            else {
                tree.clearFilter()
            }
        },
    },
    methods: {
        load: function () {
            var self = this

            if ( !this.src ) return

            this.loading = true
            this.loaded = false
            fetch( this.src )
                .then( function ( resp ) {
                    return resp.json()
                } )
                .then( function ( catalog ) {
                    if ( !self.$refs.container ) return

                    if ( catalog.error ) throw Error( catalog.error )

                    $( self.$refs.container ).fancytree( 'getTree' ).reload( catalog )
                    self.loaded = true
                    self.$emit( 'loaded' )
                } )
                .catch( function ( err ) {
                    self.$emit( 'load-error', err )
                } )
                .finally( function () {
                    self.loading = false
                } )
        }
    },
    mounted: function () {
        var self = this

        $( this.$refs.container ).fancytree( {
            source: [],
            extensions: [ 'filter', "edit" ],
            quicksearch: true,
            tooltip: function ( event, data ) {
                if ( !data.node.data.id ) return
                return 'ID: ' + data.node.data.id
            },
            filter: {
                autoApply: true,
                autoExpand: true,
                counter: true,
                fuzzy: false,
                hideExpandedCounter: true,
                hideExpanders: false,
                highlight: true,
                leavesOnly: false,
                nodata: true,
                mode: 'hide',
                extensions: [],
            },
            edit: {
                adjustWidthOfs: 50,
                triggerStart: [ "f2", "mac+enter", "shift+click", "clickActive" ],
                beforeEdit: function(event, data){
                    if ( !self.allowedEdit ) return false

                    return self.allowedEdit( data.node.data )
                },
                edit: function(event, data){
                    $( data.input ).addClass( 'browser-default' ) //.css( { width: 'auto' } )
                    $( data.node.span ).find( '.catalog-node-command' ).remove()
                },
                // beforeClose: function(event, data){
                save: function(event, data){
                    self.$emit( 'edit-item', data.node.data, data.input.val() )
                    return true;
                },
                // close: function(event, data){
            },
            dblclick: function(event, data) {
                if ( data.node.folder ) return
                self.$emit( 'select-item', data.node.data )
                $( data.node.span ).find( '.catalog-node-command' ).remove()
            },
            activate: function ( event, data ) {
                if ( self.allowedRemove && self.allowedRemove( data.node.data ) )
                    $( data.node.span ).append(
                        $( '<i class="material-icons catalog-node-command red-text">' )
                            .text( 'delete_forever' )
                            .click( function () {
                                self.$emit( 'remove-item', data.node.data )
                            } )
                    )
            },
            deactivate: function ( event, data ) {
                $( data.node.span ).find( '.catalog-node-command' ).remove()
            }
        } )

        this.load()
    }
} )
