import { cargarProductos } from './productos.js'
import { renderizarCatalogo } from './catalogo-renderizado.js'
import { filtrarPorTalle, filtrarPorCategoria, filtrarPorTexto } from './catalogo-filtros.js'
import { obtenerCarrito, guardarCarrito } from './carrito-persistencia.js'
import { agregarProducto } from './carrito-reglas.js'
import { actualizarContadorCarrito } from './carrito-renderizado.js'

let temporizadorNotificacion

async function inicializarCatalogo() {
    const elementos = {
        contenedor: document.getElementById('contenedor-productos'),
        notificacion: document.getElementById('notificacion-carrito'),
        notificacionImagen: document.querySelector('.notificacion-imagen'),
        notificacionNombre: document.querySelector('.notificacion-nombre'),
        notificacionOpciones: document.querySelector('.notificacion-opciones'),
        notificacionCantidad: document.querySelector('.notificacion-cantidad'),
        notificacionPrecio: document.querySelector('.notificacion-precio'),
        cerrarNotificacion: document.querySelector('.notificacion-cerrar'),
        seguirComprando: document.querySelector('.notificacion-seguir'),
        contador: document.getElementById('productos-seleccionados'),
        botonLimpiar: document.getElementById('boton-limpiar-filtros'),
        categoria: document.getElementById('filtro-categoria'),
        talle: document.getElementById('filtro-talle'),
        orden: document.getElementById('orden-catalogo'),
        buscar: document.getElementById('buscar-nav'),
        cantidad: document.getElementById('cantidad-productos'),
        vistaCuadricula: document.getElementById('vista-cuadricula'),
        vistaLista: document.getElementById('vista-lista')
    }
    let productos

    try {
        productos = await cargarProductos()
    } catch (error) {
        console.error(error)
        if (elementos.contenedor) elementos.contenedor.innerHTML = '<p role="alert">No se pudieron cargar los productos. Intentá recargar la página.</p>'
        return
    }

    const carrito = obtenerCarrito()
    actualizarContadorCarrito(elementos.contador, carrito)
    elementos.cerrarNotificacion?.addEventListener('click', () => ocultarNotificacion(elementos.notificacion))
    elementos.seguirComprando?.addEventListener('click', () => ocultarNotificacion(elementos.notificacion))

    function actualizarCatalogo() {
        let productosFiltrados = filtrarPorTexto(productos, elementos.buscar?.value || '')
        if (elementos.categoria && elementos.categoria.value !== 'todas') {
            productosFiltrados = filtrarPorCategoria(productosFiltrados, elementos.categoria.value)
        }
        if (elementos.talle && elementos.talle.value !== 'todos') {
            productosFiltrados = filtrarPorTalle(productosFiltrados, elementos.talle.value)
        }
        if (elementos.orden?.value === 'precio-asc') {
            productosFiltrados.sort((a, b) => a.precio - b.precio)
        } else if (elementos.orden?.value === 'precio-desc') {
            productosFiltrados.sort((a, b) => b.precio - a.precio)
        } else if (elementos.orden?.value === 'nombre') {
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
        }
        if (elementos.cantidad) {
            const total = productosFiltrados.length
            elementos.cantidad.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`
        }
        renderizarCatalogo(elementos.contenedor, productosFiltrados)
        enlazarEventosProductos(elementos, productos, carrito)
    }

    const parametros = new URLSearchParams(window.location.search)
    if (elementos.buscar) elementos.buscar.value = parametros.get('q') || ''
    enlazarEventosFiltros(elementos, actualizarCatalogo)
    actualizarCatalogo()
}

function enlazarEventosProductos(elementos, productos, carrito) {
    elementos.contenedor.querySelectorAll('.boton-agregar-producto').forEach((boton) => {
        boton.addEventListener('click', () => {
            const producto = productos.find((item) => item.id === parseInt(boton.dataset.id))
            if (!producto) return

            const articulo = { id: producto.id, talle: producto.talles[0], color: producto.colores[0], cantidad: 1 }
            const carritoActualizado = agregarProducto(carrito, articulo)
            carrito.splice(0, carrito.length, ...carritoActualizado)
            guardarCarrito(carrito)
            actualizarContadorCarrito(elementos.contador, carrito)
            mostrarNotificacion(elementos, producto, articulo)
        })
    })

    elementos.contenedor.querySelectorAll('.enlace-ver-producto').forEach((enlace) => {
        enlace.addEventListener('click', () => localStorage.setItem('productoSeleccionado', parseInt(enlace.dataset.id)))
    })
}

// muestra el producto agregado y cierra el aviso a los cinco segundos
function mostrarNotificacion(elementos, producto, articulo) {
    const notificacion = elementos.notificacion
    if (!notificacion || !elementos.notificacionImagen || !elementos.notificacionNombre
        || !elementos.notificacionOpciones || !elementos.notificacionCantidad || !elementos.notificacionPrecio) return

    window.clearTimeout(temporizadorNotificacion)
    elementos.notificacionImagen.src = producto.imagen
    elementos.notificacionImagen.alt = producto.nombre
    elementos.notificacionNombre.textContent = producto.nombre
    elementos.notificacionOpciones.textContent = `${articulo.color}, Talle ${articulo.talle}`
    elementos.notificacionCantidad.textContent = `Cantidad: ${articulo.cantidad}`
    elementos.notificacionPrecio.textContent = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(producto.precio)

    notificacion.hidden = false
    window.requestAnimationFrame(() => notificacion.classList.add('visible'))
    temporizadorNotificacion = window.setTimeout(() => ocultarNotificacion(notificacion), 5000)
}

function ocultarNotificacion(notificacion) {
    if (!notificacion) return

    window.clearTimeout(temporizadorNotificacion)
    notificacion.classList.remove('visible')
    window.setTimeout(() => {
        if (!notificacion.classList.contains('visible')) notificacion.hidden = true
    }, 180)
}

function enlazarEventosFiltros(elementos, actualizarCatalogo) {
    elementos.categoria?.addEventListener('change', actualizarCatalogo)
    elementos.talle?.addEventListener('change', actualizarCatalogo)
    elementos.orden?.addEventListener('change', actualizarCatalogo)
    elementos.botonLimpiar?.addEventListener('click', () => {
        if (elementos.categoria) elementos.categoria.value = 'todas'
        if (elementos.talle) elementos.talle.value = 'todos'
        if (elementos.orden) elementos.orden.value = 'relevantes'
        if (elementos.buscar) elementos.buscar.value = ''
        actualizarCatalogo()
    })
    elementos.buscar?.addEventListener('input', actualizarCatalogo)

    // cambiamos solo la forma de mostrar las mismas prendas
    elementos.vistaCuadricula?.addEventListener('click', () => cambiarVista(elementos, false))
    elementos.vistaLista?.addEventListener('click', () => cambiarVista(elementos, true))
}

function cambiarVista(elementos, mostrarLista) {
    elementos.contenedor.classList.toggle('vista-lista', mostrarLista)
    elementos.vistaCuadricula.classList.toggle('vista-activa', !mostrarLista)
    elementos.vistaLista.classList.toggle('vista-activa', mostrarLista)
    elementos.vistaCuadricula.setAttribute('aria-pressed', String(!mostrarLista))
    elementos.vistaLista.setAttribute('aria-pressed', String(mostrarLista))
}

inicializarCatalogo()
