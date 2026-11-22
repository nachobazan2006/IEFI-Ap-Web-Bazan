function renderizarCatalogo(contenedor, productos) {
    if (!contenedor) return

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos que coincidan con la búsqueda.</p>'
        return
    }

    const formatoPrecio = new Intl.NumberFormat('es-AR')

    contenedor.innerHTML = productos.map((producto) => `
        <article class="articulo-catalogo">
            <img class="imagen-catalogo" src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${formatoPrecio.format(producto.precio)}</p>
            <div class="acciones-producto">
                <a href="producto.html?id=${producto.id}" class="enlace-ver-producto" data-id="${producto.id}">Ver producto</a>
                <button type="button" class="boton-agregar-producto" data-id="${producto.id}">Añadir al carro</button>
            </div>
        </article>
    `).join('')
}

function crearOpciones(productos, textoInicial = '') {
    return productos.map((producto) => `<option value="${producto}">${producto}</option>`).join('')
        .replace(/^/, textoInicial)
}

function renderizarDetalleProducto(contenedor, producto) {
    if (!contenedor || !producto) return

    const opcionesTalles = crearOpciones(producto.talles, '<option value="">Seleccionar talle</option>')
    const opcionesColores = crearOpciones(producto.colores)

    contenedor.innerHTML = `
        <section class="producto-imagenes">
            <img src="${producto.imagen}" alt="${producto.nombre}">
        </section>
        <section class="producto-datos">
            <h2>${producto.nombre}</h2>
            <p class="precio">Precio: $${producto.precio}</p>
            <p class="cuotas">3 cuotas sin interés</p>
            <p><strong>Stock disponible</strong></p>
            <p class="descripcion">Descripcion: ${producto.descripcion}</p>
            <form class="form-compra" action="carrito.html" method="get">
                <input type="hidden" name="id" value="${producto.id}">
                <label for="select-color">Color:</label>
                <select id="select-color" name="color" required>${opcionesColores}</select>
                <label for="select-talle">Talle:</label>
                <select id="select-talle" name="talle" required>${opcionesTalles}</select>
                <label for="input-cantidad">Cantidad:</label>
                <input type="number" id="input-cantidad" name="cantidad" value="1" min="1" required>
                <button type="submit" id="boton-agregar-detalle" data-id="${producto.id}">Agregar al carrito</button>
            </form>
            <section class="guia-medidas">
                <h3>Tabla de Medidas</h3>
                <table>
                    <caption>Medidas en centímetros</caption>
                    <thead><tr><th scope="col">Talle</th><th scope="col">Ancho</th><th scope="col">Largo</th></tr></thead>
                    <tbody>
                        <tr><td>S</td><td>54 cm</td><td>72 cm</td></tr>
                        <tr><td>M</td><td>56 cm</td><td>74 cm</td></tr>
                        <tr><td>L</td><td>58 cm</td><td>76 cm</td></tr>
                        <tr><td>XL</td><td>60 cm</td><td>78 cm</td></tr>
                    </tbody>
                </table>
            </section>
            <section class="calculo-envio">
                <h3>Calcular Envío</h3>
                <form class="form-envio" action="#" method="get">
                    <label for="cp-envio">Código Postal:</label>
                    <input type="text" id="cp-envio" name="cp" placeholder="5000">
                    <button type="button">Calcular</button>
                </form>
            </section>
        </section>
    `

    const rutaProducto = document.getElementById('ruta-producto')
    if (rutaProducto) rutaProducto.textContent = producto.nombre

    document.title = `cba.urban - ${producto.nombre}`
    const tituloDetalleH1 = document.getElementById('titulo-detalle-h1')
    if (tituloDetalleH1) tituloDetalleH1.textContent = `Detalle del producto: ${producto.nombre}`
}

export { renderizarCatalogo, renderizarDetalleProducto }
