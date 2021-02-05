import { vueComponent, importComponents } from '../vue-util.js'

const mode = {
    'and': 2,
    'or': 2,
    'not': 2,
    'equals': 1,
    'less-than': 1,
    'greater-than': 1,
    'contains': 1,
    'starts-with': 1,
    'ends-with': 1
}

export default importComponents( [
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'queryId' ],
        data: function () {
            return {
                editPredicate: false,
                activeClauseIndex: null
            }
        },
        computed: {
            predicate: function () {
                return this.$store.getters.configLayerQueryPredicate( this.itemId, this.queryId )
            },
            summary: function () {
                return JSON.stringify( this.predicate )
            },
            clauses: function () {
                return this.predicate.arguments
            },
            predicateOperator: {
                get: function () {
                    return this.predicate.operator
                },
                set: function ( val ) {
                    var pred = this.predicate
                    pred.operator = val
                    this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
                }
            },
            clauseOperator: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return this.clauses[ this.activeClauseIndex ].operator
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    var pred = this.predicate
                    pred.arguments[ this.activeClauseIndex ].operator = val
                    this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
                }
            },
            clauseOperatorMode: function () {
                if ( this.activeClauseIndex == null ) return
                return mode[ this.clauses[ this.activeClauseIndex ].operator ]
            },
            clauseOperand1: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return fromOperand( this.clauses[ this.activeClauseIndex ].arguments[ 0 ] )
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    var pred = this.predicate
                    pred.arguments[ this.activeClauseIndex ].arguments[ 0 ] = JSON.parse( val )
                    this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
                }
            },
            clauseOperand2: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return fromOperand( this.clauses[ this.activeClauseIndex ].arguments[ 1 ] )
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    var pred = this.predicate
                    pred.arguments[ this.activeClauseIndex ].arguments[ 1 ] = JSON.parse( val )
                    this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
                }
            },
            clauseParameterOperands: function () {
                return this.$store.getters.configLayerQueryParameters( this.itemId, this.queryId ).map( function ( p ) {
                    return { op: fromOperand( { operand: 'parameter', id: p.id } ), title: p.title }
                } )
            },
            clauseAttributeOperands: function () {
                return this.$store.getters.configLayer( this.itemId ).attributes.map( function ( a ) {
                    return { op: fromOperand( { operand: 'attribute', name: a.name } ), title: a.name }
                } )
            },
            clauseArgumentIndexes: function () {},
        },
        methods: {
            openPredicate: function () {
                this.editPredicate = true
            },
            openDialog: function () {

            },
            removeClause: function ( index ) {
                var pred = this.predicate
                pred.arguments.splice( index, 1 )
                this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
            },
            addClause: function () {
                var pred = this.predicate
                pred.arguments.push( {
                    operator: 'equals',
                    arguments: [ {}, {} ]
                } )
                this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
            },
            getClauseSummary: function ( clause ) {
                return `${ clause.arguments[ 0 ].id || clause.arguments[ 0 ].name } ${ clause.operator } ${ clause.arguments[ 1 ].id || clause.arguments[ 1 ].name }`
            },
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeClauseIndex = 1 * el.dataset.index
                },
            } )
        },
        updated: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenEnd: function ( el ) {
                    self.activeClauseIndex = 1 * el.dataset.index
                },
                onCloseStart: function () {
                    self.activeClauseIndex = null
                }
            } )
        },
    } )
} )

function fromOperand( op ) {
    if ( op.operand == 'attribute' )
        return JSON.stringify( { operand: 'attribute', name: op.name } )
    if ( op.operand == 'parameter' )
        return JSON.stringify( { operand: 'parameter', id: op.id } )
    return '{}'
}