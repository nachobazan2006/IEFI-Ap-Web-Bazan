import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizarCarrito, calcularSubtotal } from '../src/recursos/js/carrito-reglas.js'

// dos prendas iguales se juntan en una sola línea con cantidad dos
test('normaliza dos unidades del mismo producto', () => {
    const carrito = [
        { id: 1, talle: 'M', color: 'Negro', cantidad: 1 },
        { id: 1, talle: 'M', color: 'Negro', cantidad: 1 }
    ]

    const resultado = normalizarCarrito(carrito)

    assert.deepEqual(resultado, [
        { id: 1, talle: 'M', color: 'Negro', cantidad: 2 }
    ])
})

// un carrito vacío no tiene líneas para mostrar
test('normaliza un carrito vacío', () => {
    assert.deepEqual(normalizarCarrito([]), [])
})

// una remera de 20000 y dos buzos de 15000 suman 50000
test('calcula el subtotal de dos productos', () => {
    const carrito = [
        { id: 1, cantidad: 1 },
        { id: 2, cantidad: 2 }
    ]
    const productos = [
        { id: 1, precio: 20000 },
        { id: 2, precio: 15000 }
    ]

    const resultado = calcularSubtotal(carrito, productos)

    assert.equal(resultado, 50000)
})

// si no hay prendas, el subtotal tiene que ser cero
test('calcula cero para un carrito vacío', () => {
    assert.equal(calcularSubtotal([], []), 0)
})
