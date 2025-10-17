// ============================================
// PERFUMICHIC - JAVASCRIPT EN ESPAÑOL
// ============================================

// ===== VARIABLES GLOBALES =====

// Lista que guarda los productos del carrito
let carrito = [];

// Número de WhatsApp de la tienda
const NUMERO_WHATSAPP = '59164384438';

// ===== CUANDO LA PÁGINA CARGA =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página cargada correctamente');
    
    inicializarEventos();
    iniciarFrasesRotativas();
    cargarCarritoGuardado();
    actualizarContadorCarrito();
    mostrarCarrito();
    
    console.log('🎉 Sistema PERFUMICHIC iniciado');
    console.log('📱 WhatsApp: ' + NUMERO_WHATSAPP);
});

// ===== FUNCIÓN 1: INICIALIZAR EVENTOS =====

function inicializarEventos() {
    
    // Conecta el formulario de contacto
    const formularioContacto = document.getElementById('formulario-contacto');
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', enviarContactoWhatsApp);
    }
    
    // Conecta el formulario de pedido
    const formularioPedido = document.getElementById('formulario-pedido');
    if (formularioPedido) {
        formularioPedido.addEventListener('submit', enviarPedidoWhatsApp);
    }
    
    // Conecta el botón "Finalizar Compra"
    const botonFinalizar = document.querySelector('.boton-finalizar-compra');
    if (botonFinalizar) {
        botonFinalizar.addEventListener('click', abrirVentanaFinalizar);
    }
    
    // Conecta el botón de cerrar ventana (X)
    const botonCerrar = document.querySelector('.boton-cerrar');
    if (botonCerrar) {
        botonCerrar.addEventListener('click', cerrarVentanaFinalizar);
    }
    
    // Cierra la ventana si haces clic fuera de ella
    window.addEventListener('click', function(evento) {
        const ventana = document.getElementById('ventana-finalizar');
        if (evento.target === ventana) {
            cerrarVentanaFinalizar();
        }
    });
    
    // Conecta el botón flotante de WhatsApp
    const botonWhatsAppFlotante = document.querySelector('.whatsapp-flotante');
    if (botonWhatsAppFlotante) {
        botonWhatsAppFlotante.addEventListener('click', abrirWhatsAppDirecto);
    }
    
    // Configura el desplazamiento suave
    configurarDesplazamientoSuave();
}

// ===== FUNCIÓN 2: AÑADIR AL CARRITO =====

function anadirAlCarrito(idProducto) {
    
    // Busca el botón del producto
    const boton = document.querySelector(`.boton-anadir-carrito[data-id="${idProducto}"]`);
    
    if (!boton) {
        console.error('No se encontró el producto');
        return;
    }
    
    // Obtiene la información del producto
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const imagen = boton.getAttribute('data-imagen');
    
    // Verifica que la información esté completa
    if (!nombre || !precio || !imagen) {
        alert('Error: Falta información del producto');
        return;
    }
    
    // Busca si el producto ya está en el carrito
    let productoExistente = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            productoExistente = carrito[i];
            break;
        }
    }
    
    // Si existe, aumenta la cantidad
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        // Si es nuevo, lo añade al carrito
        carrito.push({
            id: idProducto,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }
    
    // Guarda y actualiza
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('✅ Producto añadido: ' + nombre, 'exito');
}

// ===== FUNCIÓN 3: CAMBIAR CANTIDAD =====

function actualizarCantidad(idProducto, cambio) {
    
    // Busca el producto en el carrito
    let producto = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            producto = carrito[i];
            break;
        }
    }
    
    if (producto) {
        producto.cantidad = producto.cantidad + cambio;
        
        // Si la cantidad es 0 o menos, elimina el producto
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
            return;
        }
        
        // Actualiza
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// ===== FUNCIÓN 4: ELIMINAR DEL CARRITO =====

function eliminarDelCarrito(idProducto) {
    
    // Crea un nuevo array sin el producto eliminado
    const nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== idProducto) {
            nuevoCarrito.push(carrito[i]);
        }
    }
    carrito = nuevoCarrito;
    
    // Actualiza
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('🗑️ Producto eliminado', 'informacion');
}

// ===== FUNCIÓN 5: MOSTRAR CARRITO =====

function mostrarCarrito() {
    
    // Obtiene los elementos HTML
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const botonFinalizar = document.querySelector('.boton-finalizar-compra');
    
    if (!listaCarrito || !totalCarrito) {
        return;
    }
    
    // Limpia el contenido anterior
    listaCarrito.innerHTML = '';
    
    // Inicializa el total
    let total = 0;
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align: center; color: #777;">Tu carrito está vacío. ¡Explora nuestros perfumes!</p>';
        totalCarrito.textContent = '0.00';
        if (botonFinalizar) {
            botonFinalizar.style.display = 'none';
        }
        return;
    }
    
    // Muestra el botón de finalizar compra
    if (botonFinalizar) {
        botonFinalizar.style.display = 'block';
    }
    
    // Recorre cada producto del carrito
    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        
        // Calcula el total del producto
        const totalProducto = producto.precio * producto.cantidad;
        total = total + totalProducto;
        
        // Crea el elemento de lista
        const itemLi = document.createElement('li');
        itemLi.className = 'item-carrito';
        
        // Crea el HTML interno
        itemLi.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-item-carrito">
            
            <div class="informacion-item-carrito">
                <h4>${producto.nombre}</h4>
                <p>Precio Unitario: Bs ${producto.precio.toFixed(2)}</p>
            </div>
            
            <div class="control-cantidad">
                <button onclick="actualizarCantidad('${producto.id}', -1)">-</button>
                <span>${producto.cantidad}</span>
                <button onclick="actualizarCantidad('${producto.id}', 1)">+</button>
            </div>
            
            <span class="total-item-carrito">Bs ${totalProducto.toFixed(2)}</span>
            
            <button class="boton-eliminar-item" onclick="eliminarDelCarrito('${producto.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Añade el producto a la lista
        listaCarrito.appendChild(itemLi);
    }
    
    // Muestra el total final
    totalCarrito.textContent = total.toFixed(2);
}

// ===== FUNCIÓN 6: ACTUALIZAR CONTADOR =====

function actualizarContadorCarrito() {
    
    // Cuenta el total de productos
    let totalProductos = 0;
    for (let i = 0; i < carrito.length; i++) {
        totalProductos = totalProductos + carrito[i].cantidad;
    }
    
    // Obtiene el elemento del contador
    const contador = document.getElementById('contador-carrito');
    
    // Actualiza el número
    if (contador) {
        contador.textContent = totalProductos;
        
        // Muestra u oculta el contador
        if (totalProductos > 0) {
            contador.style.display = 'block';
        } else {
            contador.style.display = 'none';
        }
    }
}

// ===== FUNCIÓN 7: GUARDAR CARRITO =====

function guardarCarrito() {
    try {
        const carritoTexto = JSON.stringify(carrito);
        localStorage.setItem('perfumichic_carrito', carritoTexto);
    } catch (error) {
        console.error('Error al guardar el carrito', error);
    }
}

// ===== FUNCIÓN 8: CARGAR CARRITO GUARDADO =====

function cargarCarritoGuardado() {
    try {
        const carritoTexto = localStorage.getItem('perfumichic_carrito');
        
        if (carritoTexto) {
            carrito = JSON.parse(carritoTexto);
        }
    } catch (error) {
        console.error('Error al cargar el carrito', error);
        carrito = [];
    }
}

// ===== FUNCIÓN 9: ABRIR VENTANA FINALIZAR =====

function abrirVentanaFinalizar() {
    
    // Verifica que haya productos
    if (carrito.length === 0) {
        mostrarNotificacion('⚠️ Tu carrito está vacío', 'advertencia');
        return;
    }
    
    // Obtiene la ventana
    const ventana = document.getElementById('ventana-finalizar');
    
    if (ventana) {
        // Genera el resumen del pedido
        const resumen = generarResumenPedido();
        document.getElementById('resumen-pedido').innerHTML = resumen;
        
        // Muestra la ventana
        ventana.style.display = 'block';
    }
}

// ===== FUNCIÓN 10: CERRAR VENTANA =====

function cerrarVentanaFinalizar() {
    const ventana = document.getElementById('ventana-finalizar');
    if (ventana) {
        ventana.style.display = 'none';
    }
}

// ===== FUNCIÓN 11: GENERAR RESUMEN DEL PEDIDO =====

function generarResumenPedido() {
    
    // Inicia el HTML
    let html = '<h4>Resumen de tu Pedido</h4>';
    html += '<ul style="list-style: none; padding: 0;">';
    
    // Inicializa el total
    let total = 0;
    
    // Recorre cada producto
    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        const totalProducto = producto.precio * producto.cantidad;
        total = total + totalProducto;
        
        // Añade una línea por producto
        html += `
            <li style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ccc;">
                <span>${producto.nombre} (x${producto.cantidad})</span>
                <strong>Bs ${totalProducto.toFixed(2)}</strong>
            </li>
        `;
    }
    
    // Cierra la lista y añade el total
    html += '</ul>';
    html += `<h3 style="margin-top: 15px; border-top: 2px solid #4ecdc4; padding-top: 10px;">
        Total: <span style="color: #ff6b6b;">Bs ${total.toFixed(2)}</span>
    </h3>`;
    
    return html;
}

// ===== FUNCIÓN 12: ENVIAR PEDIDO POR WHATSAPP =====

function enviarPedidoWhatsApp(evento) {
    
    // Evita el envío tradicional
    evento.preventDefault();
    
    // Obtiene los valores del formulario
    const nombre = document.getElementById('nombre-pedido').value;
    const telefono = document.getElementById('telefono-pedido').value;
    const direccion = document.getElementById('direccion-pedido').value;
    
    // Verifica que los campos estén completos
    if (!nombre || !telefono || !direccion) {
        alert('⚠️ Por favor completa todos los campos');
        return;
    }
    
    // Verifica que haya productos
    if (carrito.length === 0) {
        mostrarNotificacion('⚠️ El carrito está vacío', 'advertencia');
        return;
    }
    
    // Construye el mensaje para WhatsApp
    let mensaje = '¡Hola PERFUMICHIC! 🌸 Tengo un nuevo pedido.\n\n';
    mensaje += '*DATOS DEL CLIENTE:*\n';
    mensaje += '👤 Nombre: ' + nombre + '\n';
    mensaje += '📞 Teléfono: ' + telefono + '\n';
    mensaje += '📍 Dirección: ' + direccion + '\n\n';
    mensaje += '*DETALLE DEL PEDIDO:*\n';
    
    // Inicializa el total
    let total = 0;
    
    // Añade cada producto al mensaje
    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        const totalProducto = producto.precio * producto.cantidad;
        total = total + totalProducto;
        
        mensaje += (i + 1) + '. ' + producto.nombre;
        mensaje += ' - Cantidad: ' + producto.cantidad;
        mensaje += ' - Total: Bs ' + totalProducto.toFixed(2) + '\n';
    }
    
    // Añade el total final
    mensaje += '\n*TOTAL FINAL: Bs ' + total.toFixed(2) + '*\n\n';
    mensaje += 'Espero la confirmación para la entrega. ¡Gracias! 😊';
    
    // Codifica el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crea el enlace de WhatsApp
    const urlWhatsApp = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + mensajeCodificado;
    
    // Abre WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // Cierra la ventana después de 1 segundo
    setTimeout(function() {
        cerrarVentanaFinalizar();
        mostrarNotificacion('✅ Pedido enviado por WhatsApp', 'exito');
    }, 1000);
}

// ===== FUNCIÓN 13: ENVIAR CONTACTO POR WHATSAPP =====

function enviarContactoWhatsApp(evento) {
    
    // Evita el envío tradicional
    evento.preventDefault();
    
    // Obtiene los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Verifica que los campos estén completos
    if (!nombre || !correo || !mensaje) {
        alert('⚠️ Por favor completa todos los campos');
        return;
    }
    
    // Construye el mensaje para WhatsApp
    let mensajeWhatsApp = '¡Hola PERFUMICHIC! 📩\n\n';
    mensajeWhatsApp += '*CONSULTA DE CLIENTE:*\n\n';
    mensajeWhatsApp += '👤 Nombre: ' + nombre + '\n';
    mensajeWhatsApp += '📧 Email: ' + correo + '\n\n';
    mensajeWhatsApp += '*Mensaje:*\n' + mensaje;
    
    // Codifica el mensaje
    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    
    // Crea el enlace de WhatsApp
    const urlWhatsApp = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + mensajeCodificado;
    
    // Abre WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // Limpia el formulario
    document.getElementById('formulario-contacto').reset();
    
    // Muestra confirmación
    mostrarNotificacion('✅ Mensaje enviado por WhatsApp', 'exito');
}

// ===== FUNCIÓN 14: ABRIR WHATSAPP DIRECTO =====

function abrirWhatsAppDirecto() {
    const mensajeInicial = '¡Hola PERFUMICHIC! 🌸 Me gustaría hacer una consulta sobre sus perfumes.';
    const mensajeCodificado = encodeURIComponent(mensajeInicial);
    const urlWhatsApp = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + mensajeCodificado;
    window.open(urlWhatsApp, '_blank');
}

// ===== FUNCIÓN 15: VACIAR CARRITO =====

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

// ===== FUNCIÓN 16: MOSTRAR NOTIFICACIONES =====

function mostrarNotificacion(mensaje, tipo) {
    
    // Crea el elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion ' + tipo;
    notificacion.textContent = mensaje;
    
    // Añade al body
    document.body.appendChild(notificacion);
    
    // Muestra la notificación
    setTimeout(function() {
        notificacion.classList.add('mostrar');
    }, 10);
    
    // Oculta y elimina después de 3 segundos
    setTimeout(function() {
        notificacion.classList.remove('mostrar');
        setTimeout(function() {
            notificacion.remove();
        }, 500);
    }, 3000);
}

// ===== FUNCIÓN 17: FRASES ROTATIVAS =====

// Lista de frases
const frases = [
    '¡Tu esencia, tu estilo, PERFUMICHIC!',
    'Perfumes que cuentan tu historia.',
    'El lujo que mereces, a tu alcance.',
    'La fragancia perfecta para cada momento.'
];

// Índice de la frase actual
let indiceFraseActual = 0;

// Inicia las frases rotativas
function iniciarFrasesRotativas() {
    
    // Obtiene el contenedor
    const contenedor = document.getElementById('contenedor-frases-rotativas');
    
    if (!contenedor) {
        return;
    }
    
    // Función que cambia la frase
    function cambiarFrase() {
        
        // Obtiene la frase actual
        const fraseActual = frases[indiceFraseActual];
        
        // Crea el elemento para la frase
        const elementoFrase = document.createElement('span');
        elementoFrase.className = 'subtitulo-animado';
        elementoFrase.textContent = fraseActual;
        
        // Aplica animación de entrada
        elementoFrase.style.animation = 'fraseEntrada 1.5s ease-out forwards';
        
        // Limpia y añade la frase
        contenedor.innerHTML = '';
        contenedor.appendChild(elementoFrase);
        
        // Avanza al siguiente índice
        indiceFraseActual = indiceFraseActual + 1;
        if (indiceFraseActual >= frases.length) {
            indiceFraseActual = 0;
        }
        
        // Después de 5 segundos, aplica animación de salida
        setTimeout(function() {
            elementoFrase.style.animation = 'fraseSalida 1.5s ease-in forwards';
            
            // Cambia a la siguiente frase
            setTimeout(cambiarFrase, 1000);
        }, 5000);
    }
    
    // Inicia el ciclo
    cambiarFrase();
}

// ===== FUNCIÓN 18: DESPLAZAMIENTO SUAVE =====

function configurarDesplazamientoSuave() {
    // Selecciona todos los enlaces internos
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    // Para cada enlace
    for (let i = 0; i < enlaces.length; i++) {
        enlaces[i].addEventListener('click', function(evento) {
            evento.preventDefault();
            
            // Obtiene el ID de la sección destino
            const href = this.getAttribute('href');
            const idSeccion = href.substring(1);
            const seccion = document.getElementById(idSeccion);
            
            if (seccion) {
                // Calcula la posición considerando la barra de navegación
                const alturaBarra = 80;
                const posicionSeccion = seccion.getBoundingClientRect().top;
                const posicionFinal = posicionSeccion + window.pageYOffset - alturaBarra;
                
                // Desplaza suavemente
                window.scrollTo({
                    top: posicionFinal,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ===== FIN DEL CÓDIGO =====

console.log('✅ JavaScript PERFUMICHIC cargado completamente');
console.log('📱 Configurado para WhatsApp: ' + NUMERO_WHATSAPP);