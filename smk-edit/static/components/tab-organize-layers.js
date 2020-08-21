import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/display-item.js',
    './components/edit-item.js',
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                layerFilter: null,
                selectedIds: [],
                selectedIdsParentId: null,
                targetFolders: null,
                showMoveToFolder: false,
                targetFolderId: null,
                newFolderTitle: null,
                editItemId: null,
                showEditItem: false
            }
        },
        computed: {
            displayItems: function () {
                return this.$store.getters.configToolLayersDisplay()
            },
            enabledIds: function () {
                if ( !this.selectedIdsParentId ) return

                return this.$store.getters.configToolLayersDisplayItem( this.selectedIdsParentId ).items.map( function ( item ) {
                    return item.id
                } )
            },
            canMoveUp: function () {
                if ( !this.hasSelected ) return false
                return Math.min.apply( Math, this.selectedIdsSiblingIndexes ) > 0
            },
            canMoveDown: function () {
                if ( !this.hasSelected ) return false
                return Math.max.apply( Math, this.selectedIdsSiblingIndexes ) < ( this.enabledIds.length - 1 )
            },
            hasSelected: function () {
                return this.selectedIds.length > 0
            },
            selectedIdsSiblingIndexes: function () {
                if ( !this.hasSelected ) return []
                var siblings = this.enabledIds
                return this.selectedIds.map( function ( id ) { return siblings.indexOf( id ) } )
            },
        },
        methods: {
            layerSelected: function ( selected, itemId ) {
                if ( selected ) {
                    if ( !this.selectedIds.includes( itemId ) ) this.selectedIds.push( itemId )
                }
                else {
                    this.selectedIds = this.selectedIds.filter( function ( id ) { return id != itemId } )
                }

                if ( this.selectedIds.length == 0 ) {
                    this.selectedIdsParentId = null
                }
                else if ( !this.selectedIdsParentId ) {
                    this.selectedIdsParentId = this.$store.getters.configToolLayersDisplayItemParent( this.selectedIds[ 0 ] ).id
                }
            },
            moveUp: function () {
                var sibIndex = this.selectedIdsSiblingIndexes.sort()
                var collection = this.$store.getters.configToolLayersDisplayItem( this.selectedIdsParentId )
                sibIndex.forEach( function ( p ) {
                    collection.items.splice( p - 1, 2, collection.items[ p ], collection.items[ p - 1 ] )
                } )

                this.$store.dispatch( 'configToolLayersDisplayCollection', collection )
            },
            moveDown: function () {
                var sibIndex = this.selectedIdsSiblingIndexes.sort().reverse()
                var collection = this.$store.getters.configToolLayersDisplayItem( this.selectedIdsParentId )
                sibIndex.forEach( function ( p ) {
                    collection.items.splice( p, 2, collection.items[ p + 1 ], collection.items[ p ] )
                } )

                this.$store.dispatch( 'configToolLayersDisplayCollection', collection )
            },
            isaParent: function ( itemId, childId ) {
                if ( childId == '-top-' ) return false
                var childParent = this.$store.getters.configToolLayersDisplayItemParent( childId )
                if ( childParent.id == itemId ) return true
                return this.isaParent( itemId, childParent.id )
            },
            moveToFolder: function () {
                var self = this

                this.targetFolders = this.$store.getters.configToolLayersDisplayItemCollections()
                    .filter( function ( item ) {
                        if ( item.id == self.selectedIdsParentId ) return false
                        if ( self.selectedIds.includes( item.id ) ) return false
                        if ( self.selectedIds.some( function ( id ) { return self.isaParent( id, item.id ) } ) ) return false
                        return true
                    } )

                this.newFolderTitle = null
                this.targetFolderId = this.targetFolders.length == 0 ? '-new-' : null
                this.showMoveToFolder = true
                this.selectNewFolder()
            },
            selectNewFolder: function () {
                var self = this

                setTimeout( function () { self.$refs.folderName.focus() }, 500 )
            },
            completeMoveToFolder: function () {
                var sourceCollection = this.$store.getters.configToolLayersDisplayItem( this.selectedIdsParentId )

                var targetCollection
                if ( this.targetFolderId == '-new-' ) {
                    targetCollection = {
                        id: 'folder-' + nextFolderId() ,
                        title: this.newFolderTitle,
                        type: 'folder',
                        items: []
                    }

                    sourceCollection.items.push( targetCollection )
                }
                else {
                    targetCollection = this.$store.getters.configToolLayersDisplayItem( this.targetFolderId )
                }

                var sibIndex = this.selectedIdsSiblingIndexes.sort().reverse()
                sibIndex.forEach( function ( p ) {
                    targetCollection.items.unshift( sourceCollection.items[ p ] )
                    sourceCollection.items.splice( p, 1 )
                } )

                this.$store.dispatch( 'configToolLayersDisplayCollection', sourceCollection )
                this.$store.dispatch( 'configToolLayersDisplayCollection', targetCollection )

                this.selectNone()
            },
            selectNone: function () {
                this.selectedIds = []
                this.selectedIdsParentId = null
            },
            editItem: function ( itemId ) {
                this.editItemId = itemId
                this.showEditItem = true
            },
            removeItem: function ( itemId ) {
                this.$store.dispatch( 'configToolLayersDisplayItemRemove', itemId )
            }
        },
        mounted: function () {
            M.Modal.init( this.$refs.moveToFolder )
        }
    } )
} )

var folderId = 100
function nextFolderId() {
    folderId += 1
    return folderId
}