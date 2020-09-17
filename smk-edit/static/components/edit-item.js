import { vueComponent, importComponents } from '../vue-util.js'
import { itemTypePresentation } from './presentation.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/edit-item-details.js',
    './components/edit-item-style.js',
    './components/edit-item-attributes.js',
    './components/edit-item-queries.js',
    './components/edit-item-template.js',
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'showDialog' ],
        data: function () {
            return {
                viewMap: false
            }
        },
        computed: {
            type: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                if ( item.type && item.type != 'layer' ) return item.type
                return this.$store.getters.configLayer( this.itemId ).type
            },
            typeTitle: function () { return itemTypePresentation[ this.type ].title },
            hasStyle: function () { return itemTypePresentation[ this.type ].style },
            hasAttributes: function () { return itemTypePresentation[ this.type ].layer },
            hasQueries: function () { return itemTypePresentation[ this.type ].layer },
            hasTemplate: function () { return itemTypePresentation[ this.type ].layer },
            title: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                return item.title || this.$store.getters.configLayer( this.itemId ).title
            },
            mapConfig: function () {
                if ( !this.$store.getters.configHasLayer( this.itemId ) ) return
                var ly = this.$store.getters.configLayer( this.itemId )

                var q = {
                    tools: [ {
                        type: 'query',
                        instance: ly.id + '--all',
                        enabled: true,
                        position: 'toolbar',
                        onActivate: 'execute'
                    } ],
                    layers: [ {
                        id: ly.id,
                        title: this.title,
                        queries: [ {
                            id: 'all',
                            title: 'All features',
                            parameters: [ { id: 'p1', type: 'constant', value: 1 } ],
                            predicate: {
                                operator: 'and',
                                arguments: [
                                    { operator: 'equals', arguments: [ { operand: 'parameter', id: 'p1' }, { operand: 'parameter', id: 'p1' } ] }
                                ]
                            }
                        } ]
                    } ]
                }

                return [
                    'hide-tool=all',
                    'show-tool=pan,zoom,toolbar,layers,identify,scale,coordinate,baseMaps,legend',
                    {
                        viewer: {
                            baseMap: 'StamenTonerLight'
                        },
                        layers: [
                            this.$store.getters.configLayer( this.itemId )
                        ],
                        tools: [
                            { type: 'legend', order: 10 },
                        ]
                    },
                    q,
                ]
            }
        },
        methods: {
            openDialog: function () {
                M.Tabs.init( this.$refs.tabs, {} )
                var inst = M.Tabs.getInstance( this.$refs.tabs )
                inst.select( 'details' )
                setTimeout( function () {
                    inst.updateTabIndicator()
                }, 500 )
            },
            testLayer: function () {
                this.viewMap = true
            }
        },
    } )
} )
