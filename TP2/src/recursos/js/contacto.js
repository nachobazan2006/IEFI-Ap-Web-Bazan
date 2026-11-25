import { numeroWhatsAppDestino } from './whatsapp-config.js'

const formulario = document.getElementById('form-contacto')
const estado = document.getElementById('estado-contacto')

// arma el mensaje y lo abre en whatsapp
formulario?.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (!formulario.checkValidity()) {
        formulario.reportValidity()
        return
    }

    const numero = String(numeroWhatsAppDestino || '').replace(/\D/g, '')
    if (!numero) {
        estado.textContent = 'No está configurado el número de WhatsApp del comercio.'
        estado.setAttribute('role', 'alert')
        return
    }

    const datos = new FormData(formulario)
    const tipoConsulta = formulario.elements.namedItem('tipo-consulta')
    const mensaje = [
        `Hola, soy ${datos.get('nombre')}.`,
        `Correo: ${datos.get('email')}.`,
        `Consulta: ${tipoConsulta.selectedOptions[0].textContent}.`,
        '',
        String(datos.get('comentario')).trim()
    ].join('\n')
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`

    estado.textContent = 'WhatsApp se abrirá con tu consulta lista. Revisala y presioná Enviar para completar el envío.'
    estado.setAttribute('role', 'status')
    window.open(url, '_blank', 'noopener,noreferrer')
})
