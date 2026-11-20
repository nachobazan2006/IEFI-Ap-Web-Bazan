import { cargarProductos } from './productos.js'
import {
    obtenerCarrito,
    guardarCarrito,
    obtenerIdProductoSeleccionado
} from './carrito-persistencia.js'
import { agregarProducto, eliminarProducto, crearPedido } from './carrito-reglas.js'
import { crearUrlWhatsApp } from './whatsapp-pedido.js'
import { renderizarDetalleProducto } from './catalogo-renderizado.js'
import {
    actualizarContadorCarrito,
    renderizarCarrito,
    renderizarConfirmacion
} from './carrito-renderizado.js'

const costoEnvioFijo = 3500

async function obtenerProductos() {
    try {
        return await cargarProductos()
    } catch (error) {
        console.error(error)
        const contenedor = document.getElementById('contenedor-carrito')
            || document.getElementById('contenedor-detalle-producto')
            || document.getElementById('confirmacion-compra')
        if (contenedor) contenedor.innerHTML = '<p role="alert">No se pudieron cargar los productos. Intentá recargar la página.</p>'
        return null
    }
}

function inicializarDetalleProducto(productos) {
    const contenedor = document.getElementById('contenedor-detalle-producto')
    if (!contenedor) return

    const idSeleccionado = obtenerIdProductoSeleccionado()
    const producto = productos.find((item) => item.id === idSeleccionado)
    if (!producto) {
        contenedor.textContent = 'No encontramos el producto seleccionado.'
        return
    }

    renderizarDetalleProducto(contenedor, producto)
    const formulario = document.querySelector('.form-compra')
    formulario?.addEventListener('submit', (evento) => agregarDesdeDetalle(evento, formulario, producto))
}

function agregarDesdeDetalle(evento, formulario, producto) {
    evento.preventDefault()
    const datosCompra = new FormData(formulario)
    const cantidad = Number(datosCompra.get('cantidad'))
    if (!Number.isInteger(cantidad) || cantidad < 1) {
        alert('Ingresá una cantidad válida.')
        return
    }

    const articulo = {
        id: producto.id,
        talle: datosCompra.get('talle'),
        color: datosCompra.get('color'),
        cantidad
    }
    guardarCarrito(agregarProducto(obtenerCarrito(), articulo))
    actualizarContadorCarrito(document.getElementById('productos-seleccionados'), obtenerCarrito())
    window.location.href = 'carrito.html'
}

function inicializarCalculoEnvio(boton, codigoPostal, costoEnvioTexto) {
    boton?.addEventListener('click', () => {
        if (!/^[0-9]{4,8}$/.test(codigoPostal.value.trim())) {
            costoEnvioTexto.textContent = 'Ingresá un código postal válido (de 4 a 8 números).'
            return
        }
        costoEnvioTexto.textContent = `Envío estimado: $${costoEnvioFijo}. Es un costo fijo de referencia.`
    })
}

function inicializarProductosSugeridos(productos, actualizarVista) {
    document.querySelectorAll('.boton-sugerido').forEach((boton) => {
        boton.addEventListener('click', () => {
            const producto = productos.find((item) => item.id === Number(boton.dataset.id))
            if (!producto) return

            const articulo = { id: producto.id, talle: producto.talles[0], color: producto.colores[0], cantidad: 1 }
            guardarCarrito(agregarProducto(obtenerCarrito(), articulo))
            actualizarVista()
        })
    })
}

function inicializarCheckout(formulario, codigoPostal, costoEnvioTexto, productos) {
    formulario?.addEventListener('submit', (evento) => {
        evento.preventDefault()
        if (!formulario.reportValidity()) return

        const carrito = obtenerCarrito()
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agregá un producto antes de continuar.')
            return
        }

        if (!/^[0-9]{4,8}$/.test(codigoPostal.value.trim())) {
            costoEnvioTexto.textContent = 'Ingresá un código postal válido (de 4 a 8 números).'
            codigoPostal.focus()
            return
        }

        const datosFormulario = new FormData(formulario)
        const pedido = crearPedido(carrito, productos, {
            nombre: datosFormulario.get('nombre'),
            direccion: datosFormulario.get('direccion'),
            codigoPostal: codigoPostal.value.trim(),
            metodoPago: datosFormulario.get('pago')
        }, costoEnvioFijo)
        sessionStorage.setItem('pedidoPendiente', JSON.stringify(pedido))

        const urlWhatsApp = crearUrlWhatsApp(pedido)
        if (urlWhatsApp) {
            try {
                window.open(urlWhatsApp, '_blank', 'noopener,noreferrer')
            } catch (error) {
                console.warn('No se pudo abrir WhatsApp automáticamente. El enlace seguirá disponible en la confirmación.', error)
            }
        }
        window.location.href = 'confirmacion.html'
    })
}

function inicializarCarrito(productos) {
    const contenedor = document.getElementById('contenedor-carrito')
    if (!contenedor) return

    const elementos = {
        contador: document.getElementById('productos-seleccionados'),
        titulo: document.getElementById('titulo-carrito'),
        resumenSubtotal: document.getElementById('resumen-subtotal'),
        resumenEnvio: document.getElementById('resumen-envio'),
        resumenTotal: document.getElementById('resumen-total'),
        costoEnvioTexto: document.getElementById('costo-envio-texto')
    }
    const formularioCheckout = document.getElementById('form-checkout')
    const botonCalcularEnvio = document.getElementById('boton-calcular-envio')
    const codigoPostal = document.getElementById('cp-calc')

    function actualizarVista() {
        const carrito = obtenerCarrito()
        renderizarCarrito(contenedor, carrito, productos, elementos, costoEnvioFijo)
        enlazarBotonesEliminar(contenedor, actualizarVista)
    }

    inicializarCalculoEnvio(botonCalcularEnvio, codigoPostal, elementos.costoEnvioTexto)
    inicializarProductosSugeridos(productos, actualizarVista)
    inicializarCheckout(formularioCheckout, codigoPostal, elementos.costoEnvioTexto, productos)
    actualizarVista()
}

function enlazarBotonesEliminar(contenedor, actualizarVista) {
    contenedor.querySelectorAll('.boton-eliminar').forEach((boton) => {
        boton.addEventListener('click', () => {
            const nuevoCarrito = obtenerCarrito()
            guardarCarrito(eliminarProducto(nuevoCarrito, Number(boton.dataset.indice)))
            actualizarVista()
        })
    })
}

function inicializarConfirmacion() {
    const contenedor = document.getElementById('confirmacion-compra')
    if (!contenedor) return

    const pedido = JSON.parse(sessionStorage.getItem('pedidoPendiente') || 'null')
    const urlWhatsApp = pedido ? crearUrlWhatsApp(pedido) : null
    if (renderizarConfirmacion(contenedor, pedido, urlWhatsApp) && urlWhatsApp) {
        sessionStorage.removeItem('pedidoPendiente')
    }
}

async function inicializarAplicacionCarrito() {
    actualizarContadorCarrito(document.getElementById('productos-seleccionados'), obtenerCarrito())
    const productos = await obtenerProductos()
    if (productos) {
        inicializarDetalleProducto(productos)
        inicializarCarrito(productos)
    }
    inicializarConfirmacion()
}

inicializarAplicacionCarrito()
