// ===== CONFIGURACIÓN EMAILJS DUAL =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",
    serviceId: "service_p9efz9f",
    
    // 📧 TEMPLATES DUALES - IDs CORRECTOS
    templateCliente: "template_l45fbgi",    // Template para el CLIENTE (guía de IA)
    templateEquipo: "template_ho27i8c",     // Template para INGENIERO RAMIRO (notificación)
    
    // 📍 CONFIGURACIÓN DE EMAILS
    emailEquipo: "jonimates2000@gmail.com",      // Email del Ing. Ramiro
    guiaDownloadUrl: "https://drive.google.com/file/d/19WrtQH7UZguUYKdEFpyqMMihA71WZGBv/view" // 🔧 CAMBIAR POR TU ENLACE
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === IBT BUSINESS SCHOOL - SISTEMA DUAL DE EMAILS ===');
    console.log('📋 Configuración:', EMAILJS_CONFIG);
    
    // Verificar EmailJS
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS no está cargado!');
        return;
    }
    
    // Inicializar EmailJS
    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        console.log('✅ EmailJS inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando EmailJS:', error);
        return;
    }
    
    setupForm();
});

// ===== CONFIGURACIÓN DEL FORMULARIO =====
function setupForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    console.log('📝 Formulario encontrado, configurando evento dual...');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('📤 === INICIO PROCESO DUAL DE EMAILS ===');
        
        // Verificar honeypot
        const honeypot = form.querySelector('[name="bot-field"]');
        if (honeypot && honeypot.value) {
            console.log('🚫 Spam detectado');
            return;
        }
        
        // CAPTURA DE DATOS
        const datosCliente = {
            nombre: document.getElementById('client_name').value.trim(),
            email: document.getElementById('client_email').value.trim(),
            telefono: document.getElementById('client_phone').value.trim(),
            ocupacion: document.getElementById('client_occupation').value,
            ciudad: document.getElementById('client_city').value.trim()
        };
        
        console.log('📊 === DATOS CAPTURADOS ===');
        console.log('👤 Nombre:', datosCliente.nombre);
        console.log('📧 Email:', datosCliente.email);
        console.log('📱 Teléfono:', datosCliente.telefono);
        console.log('💼 Ocupación:', datosCliente.ocupacion);
        console.log('🏙️ Ciudad:', datosCliente.ciudad);
        
        // Validaciones
        if (!datosCliente.nombre || !datosCliente.email || !datosCliente.ocupacion || !datosCliente.ciudad) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosCliente.email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        // Mostrar carga
        showLoading(true);
        
        try {
            // ===== 📧 ENVÍO DUAL DE EMAILS =====
            await enviarEmailsDuales(datosCliente);
            
            console.log('🎉 === PROCESO DUAL COMPLETADO EXITOSAMENTE ===');
            showSuccess();
            form.reset();
            
        } catch (error) {
            console.error('❌ === ERROR EN PROCESO DUAL ===', error);
            
            // Fallback a Netlify
            try {
                await enviarFallbackNetlify(form);
                showSuccess();
                form.reset();
            } catch (netlifyError) {
                console.error('❌ Error total:', netlifyError);
                showError();
            }
        } finally {
            showLoading(false);
        }
    });
    
    console.log('✅ Sistema dual configurado correctamente');
}

// ===== FUNCIÓN PRINCIPAL: ENVÍO DUAL =====
async function enviarEmailsDuales(datos) {
    console.log('🔄 === INICIANDO ENVÍO DUAL ===');
    
    const fechaHora = {
        fecha: new Date().toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' }),
        hora: new Date().toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil' }),
        completo: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    };
    
    // ===== 1️⃣ EMAIL AL CLIENTE (Respuesta automática con guía) =====
    console.log('📧 === ENVIANDO EMAIL AL CLIENTE ===');
    
    const parametrosCliente = {
        // Variables para template del cliente
        client_name: datos.nombre,
        client_email: datos.email,
        client_phone: datos.telefono || 'No proporcionado',
        client_occupation: datos.ocupacion,
        client_city: datos.ciudad,
        current_date: fechaHora.fecha,
        current_time: fechaHora.hora,
        download_url: EMAILJS_CONFIG.guiaDownloadUrl,
        
        // Variables estándar para compatibilidad
        name: datos.nombre,
        email: datos.email,
        to_email: datos.email,
        to_name: datos.nombre,
        from_name: "IBT Business School",
        subject: `¡Hola ${datos.nombre}! Tu Guía de IA está lista 🎉`,
        
        // Mensaje personalizado para el cliente
        welcome_message: `¡Hola ${datos.nombre}! Gracias por tu interés en la Inteligencia Artificial. Tu guía personalizada está lista para descargar.`
    };
    
    console.log('📨 Enviando a:', datos.email);
    console.log('📋 Template Cliente:', EMAILJS_CONFIG.templateCliente);
    
    const respuestaCliente = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateCliente,
        parametrosCliente
    );
    
    console.log('✅ EMAIL AL CLIENTE ENVIADO:', respuestaCliente.status);
    
    // ===== 2️⃣ EMAIL AL EQUIPO (Notificación de lead) =====
    console.log('📊 === ENVIANDO NOTIFICACIÓN AL EQUIPO ===');
    
    const parametrosEquipo = {
        // Variables para template del equipo
        client_name: datos.nombre,
        client_email: datos.email,
        client_phone: datos.telefono || 'No proporcionado',
        client_occupation: datos.ocupacion,
        client_city: datos.ciudad,
        current_date: fechaHora.fecha,
        current_time: fechaHora.hora,
        timestamp: fechaHora.completo,
        
        // Variables estándar
        name: `NUEVO LEAD: ${datos.nombre}`,
        email: EMAILJS_CONFIG.emailEquipo,
        to_email: EMAILJS_CONFIG.emailEquipo,
        to_name: "Equipo IBT Business School",
        from_name: "Sistema IBT",
        subject: `🚨 NUEVO LEAD: ${datos.nombre} - ${datos.ocupacion} de ${datos.ciudad}`,
        
        // Información completa del lead
        lead_source: "Formulario Web - Guía IA",
        lead_priority: "ALTA - Interés en IA",
        
        // Mensaje detallado para el equipo
        message: `🎓 NUEVO LEAD CAPTURADO - IBT BUSINESS SCHOOL

📋 INFORMACIÓN COMPLETA:
👤 Nombre: ${datos.nombre}
📧 Email: ${datos.email}
📱 Teléfono: ${datos.telefono || 'No proporcionado'}
💼 Ocupación: ${datos.ocupacion}
🏙️ Ciudad: ${datos.ciudad}

📚 INTERÉS:
Cliente solicita guía "¿Quieres Trabajar en la Inteligencia Artificial?"

⏰ REGISTRO:
📅 Fecha: ${fechaHora.fecha}
🕐 Hora: ${fechaHora.hora}
🌐 Fuente: Landing Page IBT

🎯 ACCIÓN REQUERIDA:
✅ Contactar en 24 horas
✅ Enviar guía de IA
✅ Evaluar para programas premium
✅ Agregar al CRM

💬 CONTACTO SUGERIDO: ${datos.telefono ? 'WhatsApp/Teléfono' : 'Email'}

⚡ PRIORIDAD: ALTA (Interés específico en IA)`,

        // URLs de acción directa
        contact_email_url: `mailto:${datos.email}?subject=IBT%20Business%20School%20-%20Siguiente%20Paso&body=Hola%20${encodeURIComponent(datos.nombre)},%0D%0A%0D%0AGracias%20por%20tu%20interés%20en%20IA.%20Me%20gustaría%20programar%20una%20llamada.`,
        contact_phone_url: `tel:${datos.telefono?.replace(/\D/g, '') || ''}`,
        whatsapp_url: `https://wa.me/${datos.telefono?.replace(/\D/g, '') || ''}?text=Hola%20${encodeURIComponent(datos.nombre)},%20vi%20tu%20interés%20en%20IA`
    };
    
    console.log('📨 Enviando a:', EMAILJS_CONFIG.emailEquipo);
    console.log('📋 Template Equipo:', EMAILJS_CONFIG.templateEquipo);
    
    const respuestaEquipo = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateEquipo,
        parametrosEquipo
    );
    
    console.log('✅ EMAIL AL EQUIPO ENVIADO:', respuestaEquipo.status);
    
    // ===== RESUMEN FINAL =====
    console.log('🎉 === ENVÍO DUAL COMPLETADO ===');
    console.log('📧 Cliente notificado:', datos.email);
    console.log('📊 Equipo notificado:', EMAILJS_CONFIG.emailEquipo);
    console.log('📋 Templates usados:', {
        cliente: EMAILJS_CONFIG.templateCliente,
        equipo: EMAILJS_CONFIG.templateEquipo
    });
    
    return {
        cliente: respuestaCliente,
        equipo: respuestaEquipo,
        success: true
    };
}

// ===== FALLBACK A NETLIFY =====
async function enviarFallbackNetlify(form) {
    console.log('🔄 === FALLBACK A NETLIFY ===');
    
    const formDataNetlify = new FormData(form);
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataNetlify).toString()
    });
    
    if (!response.ok) {
        throw new Error(`Netlify Error: ${response.status}`);
    }
    
    console.log('✅ Enviado a Netlify como respaldo');
}

// ===== FUNCIONES DE INTERFAZ =====
function showLoading(show) {
    const loadingMessage = document.getElementById('loadingMessage');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    if (show) {
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
            loadingMessage.innerHTML = `
                <div class="spinner"></div>
                <p>Enviando emails automáticos...</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">📧 Cliente + 📊 Equipo</p>
            `;
        }
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        submitBtn.style.opacity = '0.7';
        console.log('⏳ Mostrando estado de carga dual');
    } else {
        if (loadingMessage) loadingMessage.style.display = 'none';
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        submitBtn.style.opacity = '1';
    }
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const form = document.getElementById('contact-form');
    
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            ¡Perfecto! 🎉
            <br><br>
            ✅ <strong>Email enviado a ti</strong> con la guía de IA
            <br>
            ✅ <strong>Equipo IBT notificado</strong> para seguimiento
            <br><br>
            <em>Revisa tu email (incluyendo spam) en los próximos minutos.</em>
        `;
    }
    if (errorMessage) errorMessage.style.display = 'none';
    if (form) form.style.display = 'none';
    
    console.log('🎉 Mostrando mensaje de éxito dual');
    
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => {
        window.location.href = './success.html?status=dual-sent';
    }, 5000);
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            ❌ Hubo un error al enviar los emails automáticos.
            <br><br>
            Por favor, inténtalo de nuevo o contáctanos directamente:
            <br>
            📧 info@edu-ibt.com
        `;
    }
    if (successMessage) successMessage.style.display = 'none';
    
    console.log('❌ Mostrando mensaje de error');
}

// ===== FUNCIONES DE DEBUG Y TESTING =====
window.IBTDualTest = {
    // Test completo del sistema dual
    testSistemaDual: async function() {
        console.log('🧪 === TEST SISTEMA DUAL ===');
        
        const datosTest = {
            nombre: "Juan Pérez Test",
            email: "test@ejemplo.com", // CAMBIAR POR TU EMAIL PARA TESTING
            telefono: "+593987654321",
            ocupacion: "emprendedor",
            ciudad: "Quito"
        };
        
        try {
            const resultado = await enviarEmailsDuales(datosTest);
            console.log('✅ ¡TEST DUAL EXITOSO!', resultado);
            alert('✅ Sistema dual funcionando. Revisa ambos emails.');
        } catch (error) {
            console.error('❌ Test dual falló:', error);
            alert('❌ Test falló. Revisa consola.');
        }
    },
    
    // Verificar configuración
    verificarConfiguracion: function() {
        console.log('🔍 === VERIFICACIÓN DE CONFIGURACIÓN ===');
        
        const config = {
            'EmailJS cargado': typeof emailjs !== 'undefined',
            'Template Cliente': EMAILJS_CONFIG.templateCliente,
            'Template Equipo': EMAILJS_CONFIG.templateEquipo,
            'Service ID': EMAILJS_CONFIG.serviceId,
            'Email Equipo': EMAILJS_CONFIG.emailEquipo,
            'URL Guía configurada': EMAILJS_CONFIG.guiaDownloadUrl.includes('TU_FILE_ID') ? '❌ FALTA CONFIGURAR' : '✅ Configurada'
        };
        
        console.table(config);
        
        const errores = Object.entries(config)
            .filter(([key, value]) => value === false || value.includes('❌'))
            .map(([key]) => key);
        
        if (errores.length > 0) {
            console.error('❌ Errores encontrados:', errores);
            return false;
        } else {
            console.log('✅ Configuración completa');
            return true;
        }
    }
};

// ===== LOGS DE INICIALIZACIÓN =====
console.log('✅ === SCRIPT IBT DUAL - VERSIÓN FINAL ===');
console.log('🎯 Funcionalidad: ENVÍO DUAL AUTOMÁTICO');
console.log('📧 Template Cliente:', EMAILJS_CONFIG.templateCliente, '← template_l45fbgl');
console.log('📊 Template Equipo:', EMAILJS_CONFIG.templateEquipo, '← template_ho27i8c');
console.log('🛠️ Comandos de debug:');
console.log('  • IBTDualTest.testSistemaDual() - Test completo');
console.log('  • IBTDualTest.verificarConfiguracion() - Verificar setup');
console.log('🚀 ¡Sistema dual listo para capturar y convertir leads!');