import { vueComponent, importComponents } from '../vue-util.js'

function configToolCommand( cmd ) {
    return {
        get: function () {
            return this.$store.getters.configTool( this.toolType, this.toolInstance ).command[ cmd ]
        },
        set: function ( val ) {
            this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', [ cmd ]: val } )
        }
    }
}

function configTool( opt ) {
    return {
        get: function () {
            return this.$store.getters.configTool( this.toolType, this.toolInstance )[ opt ]
        },
        set: function ( val ) {
            this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, [ opt ]: val } )
        }
    }
}

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            optimal: configTool( 'optimal' ),
            commandOptimal: configToolCommand( 'optimal' ),

            roundTrip: configTool( 'roundTrip' ),
            commandRoundTrip: configToolCommand( 'roundTrip' ),

            criteria: configTool( 'criteria' ),
            commandCriteria: configToolCommand( 'criteria' ),

            vehicleType: configTool( 'truck' ),
            commandVehicleType: configToolCommand( 'vehicleType' ),

            truckRoute: configTool( 'truckRoute' ),
            commandTruckRoute: configToolCommand( 'truckRoute' ),

            truckHeight: configTool( 'truckHeight' ),
            commandTruckHeight: configToolCommand( 'truckHeight' ),

            truckWidth: configTool( 'truckWidth' ),
            commandTruckWidth: configToolCommand( 'truckWidth' ),

            truckLength: configTool( 'truckLength' ),
            commandTruckLength: configToolCommand( 'truckLength' ),

            truckWeight: configTool( 'truckWeight' ),
            commandTruckWeight: configToolCommand( 'truckWeight' ),
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
