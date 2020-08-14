import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
