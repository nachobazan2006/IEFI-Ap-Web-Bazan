function filtrarPorTalle(productos, talle) {
    return productos.filter((producto) => producto.talles.includes(talle.toUpperCase()))
}

function filtrarPorCategoria(productos, categoria) {
    return productos.filter((producto) => producto.categoria === categoria.toLowerCase())
}

function filtrarPorTexto(productos, texto) {
    const busqueda = texto.trim().toLowerCase()

    return productos.filter((producto) => {
        const datosProducto = `${producto.nombre} ${producto.descripcion} ${producto.categoria} ${producto.colores.join(' ')}`
        return datosProducto.toLowerCase().includes(busqueda)
    })
}

function filtrarPorPrecio(productos, precioMaximo) {
    return productos.filter((producto) => producto.precio <= precioMaximo)
}

export { filtrarPorTalle, filtrarPorCategoria, filtrarPorTexto, filtrarPorPrecio }
