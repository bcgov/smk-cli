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
    './components/materialize.js',
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'queryId' ],
        data: function () {
            return {
                // queriesKey: 1,
                editPredicate: false,
                activeClauseIndex: null
            }
        },
        computed: {
            predicate: function () {
                return this.$store.getters.configLayerQueryPredicate( this.itemId, this.queryId )
            },
            // predicateOperator: attributeAccessor( 'operator' ),
            // predicateArguments: attributeAccessor( 'arguments' ),
            // attributes: function () {
                // return this.$store.getters.configLayer( this.itemId ).attributes
            // },
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
                    this.predicate.operator = val
                }
            },
            clauseOperator: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return this.clauses[ this.activeClauseIndex ].operator
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    this.clauses[ this.activeClauseIndex ].operator = val
                }
            },
            clauseOperatorMode: function () {
                if ( this.activeClauseIndex == null ) return
                return mode[ this.clauses[ this.activeClauseIndex ].operator ]
            },
            clauseOperand1: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return this.clauses[ this.activeClauseIndex ].arguments[ 0 ]
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    this.clauses[ this.activeClauseIndex ].arguments[ 0 ] = val
                }
            },
            clauseOperand2: {
                get: function () {
                    if ( this.activeClauseIndex == null ) return
                    return this.clauses[ this.activeClauseIndex ].arguments[ 1 ]
                },
                set: function ( val ) {
                    if ( this.activeClauseIndex == null ) return
                    this.clauses[ this.activeClauseIndex ].arguments[ 1 ] = val
                }
            },
            clauseParameterOperands: function () {
                return this.$store.getters.configLayerQueryParameters( this.itemId, this.queryId ).map( function ( p ) {
                    return { operand: 'parameter', id: p.id }
                } )
            },
            clauseAttributeOperands: function () {
                return this.$store.getters.configLayer( this.itemId ).attributes.map( function ( a ) {
                    return { operand: 'attribute', name: a.name }
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
            removeClause: function () {

            },
            addClause: function () {
                var cl = {
                    operator: 'equals',
                    arguments: [ {}, {} ]
                }
                // var cls = this.clauses
                // cls.push( cl )
                var pred = this.predicate
                pred.arguments.push( cl )
                this.$store.dispatch( 'configLayerQueryPredicate', { id: this.itemId, queryId: this.queryId, predicate: pred } )
            },
            getClauseSummary: function ( clause ) {
                return `${ clause.arguments[ 0 ].id || clause.arguments[ 0 ].name } ${ clause.operator } ${ clause.arguments[ 1 ].id || clause.arguments[ 1 ].name }`
            },
            operandSummary: function ( op ) {
                return `${ op.operand }: ${ op.name || op.id }`
            }
            // getClauseOperator: function () {},
            // setClauseOperator: function () {},
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
                onOpenStart: function ( el ) {
                    self.activeClauseIndex = 1 * el.dataset.index
                },
            } )
        },
    } )
} )

function attributeAccessor( prop ) {
    return {
        get: function () {
            if ( this.activePredicateIndex == null ) return
            return this.parameters[ this.activePredicateIndex ][ prop ]
        },
        set: function ( val ) {
            if ( this.activePredicateIndex == null ) return
            var ps = this.parameters
            ps[ this.activePredicateIndex ][ prop ] = val
            this.$store.dispatch( 'configLayerQueryParameters', { id: this.itemId, queryId: this.queryId, parameters: ps } )
        }
    }
}

