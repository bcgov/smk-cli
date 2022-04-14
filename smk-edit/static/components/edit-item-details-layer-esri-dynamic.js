import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            hasLabels: function() {
                const layer = this.$store.getters.configLayer( this.itemId );
                if (layer.dynamicLayers) {
                    for (const dynamicLayer of layer.dynamicLayers) {
                        const dynamicJson = JSON.parse(dynamicLayer);
                        if(dynamicJson.drawingInfo && dynamicJson.drawingInfo.labelingInfo) {
                            return true;
                        }
                    };
                }
                return false;
            },
            showLabels: {
                get: function () {
                    const layer = this.$store.getters.configLayer( this.itemId );
                    if (layer.dynamicLayers) {
                        for (const dynamicLayer of layer.dynamicLayers) {
                            const dynamicJson = JSON.parse(dynamicLayer);
                            if(dynamicJson.drawingInfo 
                                && dynamicJson.drawingInfo.labelingInfo 
                                && dynamicJson.drawingInfo.showLabels) {
                                    return true;
                            }
                        }
                    }
                    return false;
                },
                set: function ( val ) {
                    const layer = this.$store.getters.configLayer( this.itemId );
                    if (layer.dynamicLayers) {
                        for (let i = 0; i < layer.dynamicLayers.length; i++) {
                            const dynamicJson = JSON.parse(layer.dynamicLayers[i]);
                            if(dynamicJson.drawingInfo && dynamicJson.drawingInfo.labelingInfo) {
                                dynamicJson.drawingInfo.showLabels = val;
                                layer.dynamicLayers[i] = JSON.stringify(dynamicJson);
                            }
                        }
                        this.$store.dispatch( 'configLayer', layer );
                    }
                }
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
