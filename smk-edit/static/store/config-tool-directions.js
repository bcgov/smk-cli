export default {
    filters: {
        'directions': {
            get: function ( tool ) {
                return Object.assign( {
                    order: 4,
                    position: [ 'shortcut-menu', 'list-menu' ],
                    icon: 'directions_car',
                    title: 'Route Planner',
                    geocoderService: {},
                    routePlannerService: {},
                    optimal: false,
                    roundTrip: false,
                    criteria: 'shortest',
                    truck: false,
                    truckRoute: null,
                    truckHeight: null,
                    truckWidth: null,
                    truckLength: null,
                    truckWeight: null,
                    command: {
                        optimal: true,
                        roundTrip: true,
                        criteria: true,
                        vehicleType: true,
                        truckRoute: true,
                        truckHeight: true,
                        truckWidth: true,
                        truckLength: true,
                        truckWeight: true,
                        truckHeightUnit: true,
                        truckWidthUnit: true,
                        truckLengthUnit: true,
                        truckWeightUnit: true,
                    }
                }, tool )
            },
        },
    },
    actions: {
    },
}
