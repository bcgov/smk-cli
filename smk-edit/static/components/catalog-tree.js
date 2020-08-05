import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: [ 'filter', 'src' ], // 'items',
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
                self.$emit( 'filtered', hits )
            }
            else {
                tree.clearFilter()
            }
        },
        // items: function () {
        //     if ( !this.$refs.container ) return
        //     $( this.$refs.container ).fancytree( 'getTree' ).reload( this.items )
        // }
    },
    methods: {
        load: function () {
            var self = this

            if ( !this.src ) return

            this.loading = true
            this.loaded = false
            fetch( this.src )
                .then( function ( resp ) {
                    // if ( !resp.ok ) throw Error( 'request failed' )
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
            extensions: [ 'filter' ],
            quicksearch: true,
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
                mode: 'hide'
            },
            source: [],
            dblclick: function(event, data) {
                if ( data.node.folder ) return
                self.$emit( 'select-item', data.node.data )
            }
        } )

        this.load()
    }
} )
