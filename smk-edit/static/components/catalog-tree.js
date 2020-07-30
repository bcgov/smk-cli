import { vueComponent } from '../vue-util.js'

vueComponent( import.meta.url, {
    props: [ 'items', 'filter' ],
    watch: {
        filter: function () {
            if ( !this.$refs.container ) return
            var tree = $( this.$refs.container ).fancytree( 'getTree' )

            if ( this.filter && this.filter.length > 1 ) {
                var hits = tree.filterBranches( this.filter )
            }
            else {
                tree.clearFilter()
            }
        },
        items: function () {
            if ( !this.$refs.container ) return
            $( this.$refs.container ).fancytree( 'getTree' ).reload( this.items )
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

        $( this.$refs.container ).fancytree( 'getTree' ).reload( this.items )
    },
} )
