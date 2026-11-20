import { calcularSubtotal } from './carrito-reglas.js'

function actualizarContadorCarrito(elemento, carrito) {
    if (!elemento) return
    const cantidad = carrito.reduce((total, articulo) => total + articulo.cantidad, 0)
    elemento.textContent = `(${cantidad})`
}

function renderizarCarrito(contenedor, carrito, productos, elementos, costoEnvioFijo) {
    const { titulo, resumenSubtotal, resumenEnvio, resumenTotal, costoEnvioTexto } = elementos
    actualizarContadorCarrito(elementos.contador, carrito)

    if (titulo) {
        const cantidadTotal = carrito.reduce((total, articulo) => total + articulo.cantidad, 0)
        titulo.textContent = `MI CARRITO (${cantidadTotal})`
    }

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-carrito-vacio">
                Tu carrito está actualmente vacío. Podés explorar nuestras prendas en el
                <a href="catalogo.html">Catálogo</a>.
            </p>
        `
        if (resumenSubtotal) resumenSubtotal.textContent = '$0'
        if (resumenEnvio) resumenEnvio.textContent = '$0'
        if (resumenTotal) resumenTotal.textContent = '$0'
        if (costoEnvioTexto) costoEnvioTexto.textContent = 'Costo de envío estimado: $0'
        return []
    }

    const productosUnicos = []
    carrito.forEach((linea) => {
        const yaAgregado = productosUnicos.some((articulo) => articulo.id === linea.id && articulo.talle === linea.talle && articulo.color === linea.color)
        if (!yaAgregado) productosUnicos.push(linea)
    })

    contenedor.innerHTML = productosUnicos.map((linea, indice) => {
        const producto = productos.find((item) => item.id === linea.id)
        if (!producto) return ''

        return `
            <article>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <h4>${producto.nombre}</h4>
                    <p>Color: ${linea.color} · Talle: ${linea.talle}</p>
                    <p>Precio unitario: $${producto.precio}</p>
                </div>
                <div>
                    <span>Cantidad: ${linea.cantidad}</span>
                    <button type="button" class="boton-eliminar" data-indice="${indice}">Eliminar producto</button>
                </div>
            </article>
        `
    }).join('')

    const subtotal = calcularSubtotal(carrito, productos)
    const costoEnvio = costoEnvioFijo
    const total = subtotal + costoEnvio
    if (resumenSubtotal) resumenSubtotal.textContent = `$${subtotal}`
    if (resumenEnvio) resumenEnvio.textContent = `$${costoEnvio}`
    if (resumenTotal) resumenTotal.textContent = `$${total}`
    if (costoEnvioTexto) costoEnvioTexto.textContent = `Costo de envío estimado: $${costoEnvio}`
    return productosUnicos
}

function renderizarConfirmacion(contenedor, pedido, urlWhatsApp) {
    if (!pedido || pedido.articulos.length === 0) {
        contenedor.innerHTML = '<h2>No hay un pedido pendiente</h2><p>Podés revisar el carrito y preparar tu pedido.</p><p><a href="carrito.html">Volver al carrito</a></p>'
        return false
    }

    const escaparHTML = (valor) => String(valor ?? '').replace(/[&<>"']/g, (caracter) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter])
    const productosHTML = pedido.articulos.map((articulo) => `<li>${escaparHTML(articulo.nombre)} - talle ${escaparHTML(articulo.talle)}, color ${escaparHTML(articulo.color)}, cantidad ${escaparHTML(articulo.cantidad)}</li>`).join('')
    const nombre = escaparHTML(pedido.nombre)
    const direccion = escaparHTML(pedido.direccion)
    const codigoPostal = escaparHTML(pedido.codigoPostal)
    const metodoPago = escaparHTML(pedido.metodoPago)
    const enlaceWhatsApp = urlWhatsApp
        ? `<p><a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp para enviar el pedido</a></p>`
        : '<p role="alert">Falta configurar el número de WhatsApp del comercio en recursos/js/whatsapp-config.js. El carrito se conservó.</p>'
    contenedor.innerHTML = `
        <h2>Pedido listo para enviar</h2>
        <p role="status" aria-live="polite">El mensaje está preparado. Revisalo en WhatsApp y tocá Enviar para completar el pedido.</p>
        ${enlaceWhatsApp}
        <p>Comprador: ${nombre}</p>
        <p>Dirección de entrega: ${direccion}</p>
        <p>Código postal: ${codigoPostal}</p>
        <p>Método de pago elegido: ${metodoPago}</p>
        <ul>${productosHTML}</ul>
        <p>Subtotal: $${pedido.subtotal}</p>
        <p>Envío estimado: $${pedido.envio}</p>
        <p>Total: <strong>$${pedido.total}</strong></p>
        <p><a href="carrito.html">Volver al carrito</a></p>
    `
    return true
}

export { actualizarContadorCarrito, renderizarCarrito, renderizarConfirmacion }
