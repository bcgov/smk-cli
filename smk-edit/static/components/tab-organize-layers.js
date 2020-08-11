import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/display-item.js',
    './components/edit-layer.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                layerFilter: null,
                selectedIds: [],
                displayItems: this.$store.getters.configToolLayersDisplay(),
                targetFolder: null,
                newFolderTitle: null,
                editItemId: null,
                showEditItem: false
            }
        },
        computed: {
            enabledIds: function () {
                var id = this.selectedIds[ 0 ]
                var enabled = []
                eachSiblingSet( this.displayItems, function ( siblings ) {
                    if ( id && !siblings.includes( id ) ) return
                    enabled = enabled.concat( siblings )
                } )
                return enabled
            },
            canMoveUp: function () {
                if ( !this.hasSelected ) return false
                return Math.min.apply( Math, this.selectedIdsSiblingIndexes ) > 0
            },
            canMoveDown: function () {
                if ( !this.hasSelected ) return false
                return Math.max.apply( Math, this.selectedIdsSiblingIndexes ) < ( this.selectedIdsSiblings.length - 1 )
            },
            hasSelected: function () {
                return this.selectedIds.length > 0
            },
            selectedIdsSiblings: function () {
                if ( !this.hasSelected ) return []

                var siblings, id = this.selectedIds[ 0 ]
                eachSiblingSet( this.displayItems, function ( ss ) {
                    if ( !ss.includes( id ) ) return
                    siblings = ss
                } )
                return siblings
            },
            selectedIdsSiblingIndexes: function () {
                if ( !this.hasSelected ) return []
                var siblings = this.selectedIdsSiblings
                return this.selectedIds.map( function ( id ) { return siblings.indexOf( id ) } )
            },
            folders: function () {
                var folders = []
                var id = this.selectedIds[ 0 ]
                eachSiblingSet( this.displayItems, function ( ss, items, parent ) {
                    if ( ss.includes( id ) ) return
                    folders.push( parent )
                }, { title: 'Top level', id: '-top-' } )
                return folders
            }
        },
        methods: {
            layerSelected: function ( selected, itemId ) {
                if ( selected ) {
                    if ( !this.selectedIds.includes( itemId ) ) this.selectedIds.push( itemId )
                }
                else {
                    this.selectedIds = this.selectedIds.filter( function ( id ) { return id != itemId } )
                }
            },
            moveUp: function () {
                var id = this.selectedIds[ 0 ]
                var sibIndex = this.selectedIdsSiblingIndexes.sort()
                var disp = JSON.parse( JSON.stringify( this.displayItems ) )
                eachSiblingSet( disp, function ( ss, items ) {
                    if ( !ss.includes( id ) ) return

                    sibIndex.forEach( function ( p ) {
                        items.splice( p - 1, 2, items[ p ], items[ p - 1 ] )
                    } )
                } )
                this.updateDisplay( disp )
            },
            moveDown: function () {
                var id = this.selectedIds[ 0 ]
                var sibIndex = this.selectedIdsSiblingIndexes.sort().reverse()
                var disp = JSON.parse( JSON.stringify( this.displayItems ) )
                eachSiblingSet( disp, function ( ss, items ) {
                    if ( !ss.includes( id ) ) return

                    sibIndex.forEach( function ( p ) {
                        items.splice( p, 2, items[ p + 1 ], items[ p ] )
                    } )
                } )
                this.updateDisplay( disp )
            },
            moveToFolder: function () {
                M.Modal.getInstance( this.$refs.moveToFolder ).open()
            },
            selectNewFolder: function () {
                var el = this.$refs.folderName
                setTimeout( function () { el.focus() }, 500 )
            },
            completeMove: function () {
                var self = this

                var disp = JSON.parse( JSON.stringify( this.displayItems ) )

                var folder
                if ( this.targetFolder == '-new-' ) {
                    var id = this.folders.length + 2
                    folder = {
                        id: 'folder-' + id ,
                        title: this.newFolderTitle,
                        type: 'folder',
                        items: []
                    }
                }
                else {
                    folder = allFolders( disp ).find( function ( f ) { return f.id == self.targetFolder } )
                }

                var id = this.selectedIds[ 0 ]
                var sibIndex = this.selectedIdsSiblingIndexes.sort().reverse()
                eachSiblingSet( disp, function ( ss, items ) {
                    if ( !ss.includes( id ) ) return

                    sibIndex.forEach( function ( p ) {
                        folder.items.unshift( items[ p ] )
                        items.splice( p, 1 )
                    } )
                } )

                if ( this.targetFolder == '-new-' )
                    disp.push( folder )

                this.updateDisplay( disp )
                this.selectNone()
            },
            selectNone: function () {
                this.selectedIds = []
            },
            updateDisplay: function ( display ) {
                var self = this
                this.$store.dispatch( 'configToolLayersDisplay', display ).then( function () {
                    self.displayItems = self.$store.getters.configToolLayersDisplay()
                } )
            },
            editItem: function ( itemId ) {
                this.editItemId = itemId
                this.showEditItem = true
            },
            removeItem: function ( itemId ) {
            }
        },
        mounted: function () {
            M.Modal.init( this.$refs.moveToFolder )
        }
    } )
} )

function eachSiblingSet( items, cb, parent ) {
    var siblings = items.map( function ( item ) { return item.id } )
    cb( siblings, items, parent )
    items.forEach( function ( item ) {
        if ( !item.items ) return
        eachSiblingSet( item.items, cb, item )
    } )
}

function allFolders( items ) {
    var folders = []
    eachSiblingSet( items, function ( ss, items, parent ) {
        folders.push( parent )
    }, { title: 'Top level', id: '-top-' } )
    return folders
}
