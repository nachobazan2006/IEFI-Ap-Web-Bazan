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
    const imagenes = producto.imagenes?.length ? producto.imagenes : [producto.imagen]
    const etiquetasCategoria = {
        camperas: 'Campera urbana',
        pantalones: 'Pantalón urbano',
        remeras: 'Remera urbana',
        buzos: 'Buzo urbano'
    }
    const categoria = etiquetasCategoria[producto.categoria] || 'Prenda urbana'
    const precio = new Intl.NumberFormat('es-AR').format(producto.precio)

    contenedor.innerHTML = `
        <div class="producto-superior">
            <section class="producto-galeria" aria-label="Imágenes de ${producto.nombre}">
                <div class="producto-miniaturas" aria-label="Vistas del producto">
                    ${imagenes.map((imagen, indice) => `
                        <button class="miniatura-producto${indice === 0 ? ' activa' : ''}" type="button" data-imagen="${imagen}" aria-label="Ver imagen ${indice + 1} de ${producto.nombre}" aria-pressed="${indice === 0}">
                            <img src="${imagen}" alt="">
                        </button>
                    `).join('')}
                </div>
                <div class="producto-imagen-marco">
                    <img class="imagen-producto-principal" src="${imagenes[0]}" alt="${producto.nombre}">
                    <button class="boton-ampliar-imagen" type="button" aria-label="Ampliar imagen de ${producto.nombre}">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"></circle><path d="m16 16 4.5 4.5M10.8 7.5v6.6M7.5 10.8h6.6"></path></svg>
                    </button>
                </div>
                <dialog class="dialogo-ampliacion" aria-label="Imagen ampliada de ${producto.nombre}">
                    <form method="dialog"><button class="cerrar-ampliacion" aria-label="Cerrar imagen ampliada">×</button></form>
                    <img class="imagen-ampliada" src="${imagenes[0]}" alt="${producto.nombre}, imagen ampliada">
                </dialog>
            </section>

            <section class="producto-datos" aria-labelledby="titulo-producto">
                <h1 id="titulo-producto">${producto.nombre}</h1>
                <p class="producto-subtitulo"><span aria-hidden="true"></span>${categoria}</p>
                <p class="precio">$${precio}</p>
                <p class="cuotas">3 cuotas sin interés</p>
                <p class="disponibilidad"><span aria-hidden="true"></span><strong>Stock disponible</strong></p>

                <form class="form-compra">
                    <input type="hidden" name="id" value="${producto.id}">
                    <div class="opciones-producto">
                        <div class="campo-producto">
                            <label for="select-color">Color:</label>
                            <select id="select-color" name="color" required>${opcionesColores}</select>
                        </div>
                        <div class="campo-producto">
                            <label for="select-talle">Talle:</label>
                            <select id="select-talle" name="talle" required>${opcionesTalles}</select>
                        </div>
                    </div>
                    <div class="acciones-compra">
                        <div class="campo-producto campo-cantidad">
                            <label for="input-cantidad">Cantidad:</label>
                            <input type="number" id="input-cantidad" name="cantidad" value="1" min="1" required>
                        </div>
                        <button type="submit" id="boton-agregar-detalle" data-id="${producto.id}">Agregar al carrito <span aria-hidden="true">→</span></button>
                    </div>
                </form>
            </section>
        </div>

        <div class="producto-complementos">
            <section class="panel-producto panel-detalles" aria-labelledby="titulo-detalles-producto">
                <h2 id="titulo-detalles-producto">Detalles del producto</h2>
                <p class="subtitulo-panel">Información general</p>
                <p>${producto.descripcion}</p>
            </section>

            <section class="panel-producto guia-medidas" aria-labelledby="titulo-medidas-producto">
                <h2 id="titulo-medidas-producto">Tabla de medidas</h2>
                <p class="subtitulo-panel">Medidas en centímetros</p>
                <table>
                    <thead><tr><th scope="col">Talle</th><th scope="col">Ancho</th><th scope="col">Largo</th></tr></thead>
                    <tbody>
                        <tr><td>S</td><td>54 cm</td><td>72 cm</td></tr>
                        <tr><td>M</td><td>56 cm</td><td>74 cm</td></tr>
                        <tr><td>L</td><td>58 cm</td><td>76 cm</td></tr>
                        <tr><td>XL</td><td>60 cm</td><td>78 cm</td></tr>
                    </tbody>
                </table>
            </section>

            <section class="panel-producto calculo-envio" aria-labelledby="titulo-envio-producto">
                <h2 id="titulo-envio-producto">Calcular envío</h2>
                <p class="subtitulo-panel">Consultá el costo y el tiempo de entrega</p>
                <form class="form-envio" action="#" method="get">
                    <label class="etiqueta-envio" for="cp-envio-producto">Código Postal:</label>
                    <input type="text" id="cp-envio-producto" name="cp" inputmode="numeric" placeholder="5000">
                    <button type="button" id="boton-calcular-envio-producto">Calcular</button>
                </form>
                <p id="costo-envio-producto" class="resultado-envio" aria-live="polite"></p>
            </section>
        </div>
    `

    const rutaProducto = document.getElementById('ruta-producto')
    if (rutaProducto) rutaProducto.textContent = producto.nombre

    document.title = `cba.urban - ${producto.nombre}`
    const tituloDetalleH1 = document.getElementById('titulo-detalle-h1')
    if (tituloDetalleH1) tituloDetalleH1.textContent = `Detalle del producto: ${producto.nombre}`
}
export { renderizarCatalogo, renderizarDetalleProducto }
