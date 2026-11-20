import { normalizarCarrito } from './carrito-reglas.js'

function obtenerCarrito() {
    try {
        const guardado = localStorage.getItem('carrito')
        return guardado ? normalizarCarrito(JSON.parse(guardado)) : []
    } catch (error) {
        console.log(error)
        return []
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem('carrito', JSON.stringify(normalizarCarrito(carrito)))
    } catch (error) {
        console.log(error)
    }
}

function vaciarCarrito() {
    try {
        localStorage.removeItem('carrito')
    } catch (error) {
        console.log(error)
    }
}

function obtenerIdProductoSeleccionado() {
    try {
        const parametros = new URLSearchParams(window.location.search)
        const idParam = parametros.get('id')
        if (idParam) return parseInt(idParam)
    } catch (error) {
        console.log(error)
    }

    try {
        const idGuardado = localStorage.getItem('productoSeleccionado')
        if (idGuardado) return parseInt(idGuardado)
    } catch (error) {
        console.log(error)
    }

    return 1
}

export { obtenerCarrito, guardarCarrito, vaciarCarrito, obtenerIdProductoSeleccionado }
