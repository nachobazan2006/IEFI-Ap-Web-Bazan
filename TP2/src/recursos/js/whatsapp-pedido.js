import { numeroWhatsAppDestino } from './whatsapp-config.js'

function crearMensajePedido(pedido) {
    const metodosPago = {
        transferencia: 'Transferencia bancaria',
        tarjeta: 'Tarjeta de crédito / débito',
        mercadopago: 'Mercado Pago'
    }
    const lineas = pedido.articulos.map((articulo, indice) => {
        const totalLinea = articulo.precio * articulo.cantidad
        return `${indice + 1}. ${articulo.nombre}\n   Talle: ${articulo.talle} · Color: ${articulo.color}\n   Cantidad: ${articulo.cantidad} · Precio unitario: $${articulo.precio} · Subtotal: $${totalLinea}`
    })

    return [
        'Hola, quiero finalizar este pedido de cba.urban.',
        '',
        `Comprador: ${pedido.nombre}`,
        `Dirección de entrega: ${pedido.direccion}`,
        `Código postal: ${pedido.codigoPostal || 'No informado'}`,
        `Método de pago elegido: ${metodosPago[pedido.metodoPago] || pedido.metodoPago || 'No informado'}`,
        '',
        'Productos:',
        ...lineas,
        '',
        `Subtotal: $${pedido.subtotal}`,
        `Envío: $${pedido.envio}`,
        `Total: $${pedido.total}`
    ].join('\n')
}

function crearUrlWhatsApp(pedido, numeroDestino = numeroWhatsAppDestino) {
    const numero = String(numeroDestino).replace(/\D/g, '')
    if (!numero) return null

    return `https://wa.me/${numero}?text=${encodeURIComponent(crearMensajePedido(pedido))}`
}

export { crearMensajePedido, crearUrlWhatsApp }
