function normalizarCarrito(carrito) {
    if (!Array.isArray(carrito)) return []

    const carritoNormalizado = []
    carrito.forEach((articulo) => {
        const linea = typeof articulo === 'number'
            ? { id: articulo, talle: 'Sin especificar', color: 'Sin especificar', cantidad: 1 }
            : { id: Number(articulo.id), talle: articulo.talle || 'Sin especificar', color: articulo.color || 'Sin especificar', cantidad: Math.max(1, Number(articulo.cantidad) || 1) }

        const existente = carritoNormalizado.find((item) => item.id === linea.id && item.talle === linea.talle && item.color === linea.color)
        if (existente) {
            existente.cantidad += linea.cantidad
        } else if (Number.isFinite(linea.id)) {
            carritoNormalizado.push(linea)
        }
    })

    return carritoNormalizado
}

function agregarProducto(carrito, articulo) {
    return normalizarCarrito([...carrito, articulo])
}

function eliminarProducto(carrito, indice) {
    return carrito.filter((articulo, indiceActual) => indiceActual !== indice)
}

function calcularSubtotal(carrito, productos) {
    return carrito.reduce((subtotal, linea) => {
        const producto = productos.find((item) => item.id === linea.id)
        return subtotal + (producto ? producto.precio * linea.cantidad : 0)
    }, 0)
}

function crearPedido(carrito, productos, datosComprador, costoEnvio) {
    const articulos = carrito.map((linea) => {
        const producto = productos.find((item) => item.id === linea.id)
        return {
            nombre: producto ? producto.nombre : 'Producto',
            talle: linea.talle,
            color: linea.color,
            cantidad: linea.cantidad,
            precio: producto ? producto.precio : 0
        }
    })
    const subtotal = calcularSubtotal(carrito, productos)

    return {
        nombre: datosComprador.nombre,
        direccion: datosComprador.direccion,
        codigoPostal: datosComprador.codigoPostal,
        metodoPago: datosComprador.metodoPago,
        articulos,
        subtotal,
        envio: costoEnvio,
        total: subtotal + costoEnvio
    }
}

export { normalizarCarrito, agregarProducto, eliminarProducto, calcularSubtotal, crearPedido }
