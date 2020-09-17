import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        data: function () {
            return {
                newInstance: this.toolInstance
            }
        },
        destroyed: function () {
            if ( this.newInstance != this.toolInstance )
                this.$store.dispatch( 'configToolChangeInstance', { type: this.toolType, instance: this.toolInstance, newInstance: this.newInstance } )
        }
    } )
} )
