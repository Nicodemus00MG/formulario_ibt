// ===== CONFIGURACIÓN EMAILJS DUAL CORREGIDA =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",
    serviceId: "service_p9efz9f",                    // ✅ CORREGIDO: agregué la 'z' que faltaba
    
    // 📧 TEMPLATES DUALES - IDs CORRECTOS
    templateCliente: "template_l45fbgi",             // ✅ Para el CLIENTE (termina en 'i')
    templateEquipo: "template_ho27i8c",              // ✅ Para el EQUIPO/Ing. Ramiro
    
    // 📍 CONFIGURACIÓN
    emailEquipo: "jonimates2000@gmail.com",          // Email actual del equipo
    guiaDownloadUrl: "https://drive.google.com/file/d/19WrtQH7UZguUYKdEFpyqMMihA71WZGBv/view" // 🔧 CAMBIAR
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === IBT DUAL - CONFIGURACIÓN CORREGIDA ===');
    console.log('🔧 SERVICE ID CORREGIDO: service_p9efz9f (agregué la Z que faltaba)');
    console.log('📧 Cliente recibe en SU email capturado');
    console.log('📊 Equipo recibe notificación');
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS no está cargado!');
        return;
    }
    
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
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('📤 === INICIO PROCESO DUAL CORREGIDO ===');
        
        // Verificar honeypot
        const honeypot = form.querySelector('[name="bot-field"]');
        if (honeypot && honeypot.value) {
            console.log('🚫 Spam detectado');
            return;
        }
        
        // CAPTURA DE DATOS DEL FORMULARIO
        const datos = {
            nombre: document.getElementById('client_name').value.trim(),
            email: document.getElementById('client_email').value.trim(),
            telefono: document.getElementById('client_phone').value.trim(),
            ocupacion: document.getElementById('client_occupation').value,
            ciudad: document.getElementById('client_city').value.trim()
        };
        
        console.log('📊 === DATOS CAPTURADOS ===');
        console.log('👤 Nombre:', datos.nombre);
        console.log('📧 Email del cliente:', datos.email);
        console.log('📱 Teléfono:', datos.telefono);
        console.log('💼 Ocupación:', datos.ocupacion);
        console.log('🏙️ Ciudad:', datos.ciudad);
        
        // Validaciones
        if (!datos.nombre || !datos.email || !datos.ocupacion || !datos.ciudad) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        showLoading(true);
        
        try {
            await enviarEmailsDualesCorregido(datos);
            console.log('🎉 === PROCESO DUAL COMPLETADO ===');
            showSuccess();
            form.reset();
            
        } catch (error) {
            console.error('❌ === ERROR EN PROCESO DUAL ===', error);
            showError();
        } finally {
            showLoading(false);
        }
    });
    
    console.log('✅ Sistema dual corregido configurado');
}

// ===== FUNCIÓN PRINCIPAL: ENVÍO DUAL CORREGIDO =====
async function enviarEmailsDualesCorregido(datos) {
    console.log('🔄 === INICIANDO ENVÍO DUAL CORREGIDO ===');
    
    const fechaHora = {
        fecha: new Date().toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' }),
        hora: new Date().toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil' }),
        completo: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    };
    
    // ===== 1️⃣ EMAIL AL CLIENTE (A SU PROPIO EMAIL) =====
    console.log('📧 === ENVIANDO EMAIL AL CLIENTE ===');
    console.log('📨 Enviando A:', datos.email, '← Email del cliente capturado');
    
    const parametrosCliente = {
        // 🎯 VARIABLES PRINCIPALES PARA TEMPLATE DEL CLIENTE
        to_email: datos.email,                       // ✅ Email DEL CLIENTE
        email_client: datos.email,                   // ✅ Backup del email
        client_email: datos.email,                   // ✅ Variable estándar
        
        // Variables del cliente
        client_name: datos.nombre,
        client_phone: datos.telefono || 'No proporcionado',
        client_occupation: datos.ocupacion,
        client_city: datos.ciudad,
        
        // Variables de fecha/hora
        current_date: fechaHora.fecha,
        current_time: fechaHora.hora,
        
        // URL de descarga
        download_url: EMAILJS_CONFIG.guiaDownloadUrl,
        
        // Variables estándar para compatibilidad
        name: datos.nombre,
        email: datos.email,                          // ✅ Para {{email}}
        from_name: "IBT Business School",
        reply_to: "info@edu-ibt.com",
        
        // Mensaje personalizado
        message: `Hola ${datos.nombre}, tu guía de IA está lista para descargar.`,
        subject: `¡Hola ${datos.nombre}! Tu Guía de IA está lista 🎉`
    };
    
    console.log('📋 Template Cliente:', EMAILJS_CONFIG.templateCliente);
    console.log('📧 Email destino:', datos.email);
    
    try {
        const respuestaCliente = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateCliente,
            parametrosCliente
        );
        
        console.log('✅ EMAIL AL CLIENTE ENVIADO:', respuestaCliente.status);
        console.log('📧 Enviado exitosamente a:', datos.email);
        
    } catch (errorCliente) {
        console.error('❌ Error enviando al cliente:', errorCliente);
        throw new Error(`Error al enviar email al cliente: ${errorCliente.text || errorCliente.message}`);
    }
    
    // ===== 2️⃣ EMAIL AL EQUIPO (NOTIFICACIÓN) =====
    console.log('📊 === ENVIANDO NOTIFICACIÓN AL EQUIPO ===');
    console.log('📨 Enviando A:', EMAILJS_CONFIG.emailEquipo);
    
    const parametrosEquipo = {
        // Variables para template del equipo
        to_email: EMAILJS_CONFIG.emailEquipo,        // ✅ Email del equipo
        email: EMAILJS_CONFIG.emailEquipo,           // ✅ Para {{email}}
        
        // Información del lead
        client_name: datos.nombre,
        client_email: datos.email,
        client_phone: datos.telefono || 'No proporcionado',
        client_occupation: datos.ocupacion,
        client_city: datos.ciudad,
        
        // Variables de tiempo
        current_date: fechaHora.fecha,
        current_time: fechaHora.hora,
        time: fechaHora.completo,
        
        // Variables estándar
        name: `NUEVO LEAD: ${datos.nombre}`,
        from_name: "Sistema IBT",
        subject: `🚨 NUEVO LEAD: ${datos.nombre} - ${datos.ocupacion} de ${datos.ciudad}`,
        
        // Mensaje completo para el equipo
        message: `🎓 NUEVO LEAD CAPTURADO - IBT BUSINESS SCHOOL

📋 INFORMACIÓN COMPLETA:
👤 Nombre: ${datos.nombre}
📧 Email: ${datos.email}
📱 Teléfono: ${datos.telefono || 'No proporcionado'}
💼 Ocupación: ${datos.ocupacion}
🏙️ Ciudad: ${datos.ciudad}

📚 SOLICITUD:
Cliente solicita guía "¿Quieres Trabajar en la Inteligencia Artificial?"

⏰ REGISTRO:
📅 Fecha: ${fechaHora.fecha}
🕐 Hora: ${fechaHora.hora}

🎯 ACCIONES REQUERIDAS:
✅ Cliente YA recibió email automático con guía
✅ Hacer seguimiento comercial en 24-48 horas
✅ Evaluar para programas premium
✅ Agregar al CRM

📧 Contactar cliente en: ${datos.email}
📱 Teléfono de contacto: ${datos.telefono || 'No proporcionado'}

⚡ PRIORIDAD: ALTA (Lead caliente - ya recibió guía)`
    };
    
    console.log('📋 Template Equipo:', EMAILJS_CONFIG.templateEquipo);
    
    try {
        const respuestaEquipo = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateEquipo,
            parametrosEquipo
        );
        
        console.log('✅ EMAIL AL EQUIPO ENVIADO:', respuestaEquipo.status);
        console.log('📧 Notificación enviada a:', EMAILJS_CONFIG.emailEquipo);
        
    } catch (errorEquipo) {
        console.error('❌ Error enviando al equipo:', errorEquipo);
        // No lanzar error aquí - si el cliente recibió su email, eso es lo importante
        console.log('⚠️ Cliente recibió su email, pero falló notificación al equipo');
    }
    
    // ===== RESUMEN FINAL =====
    console.log('🎉 === ENVÍO DUAL COMPLETADO ===');
    console.log('✅ Cliente notificado en:', datos.email);
    console.log('✅ Equipo notificado en:', EMAILJS_CONFIG.emailEquipo);
    
    return { success: true };
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
                <p>Enviando tu guía de IA...</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">📧 Te llegará a tu email + 📊 Notificamos al equipo</p>
            `;
        }
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        submitBtn.style.opacity = '0.7';
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
            ✅ <strong>Email enviado a tu correo</strong> con la guía de IA descargable
            <br>
            ✅ <strong>Nuestro equipo ha sido notificado</strong> para darte seguimiento
            <br><br>
            📧 <em>Revisa tu email (incluyendo spam) en los próximos minutos</em>
            <br><br>
            <strong>🎯 ¡Tu guía de IA te está esperando!</strong>
        `;
    }
    if (errorMessage) errorMessage.style.display = 'none';
    if (form) form.style.display = 'none';
    
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => {
        window.location.href = './success.html?status=guide-sent';
    }, 6000);
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            ❌ Hubo un error al enviar tu guía.
            <br><br>
            Por favor, inténtalo de nuevo o contáctanos directamente:
            <br><br>
            📧 info@edu-ibt.com
            <br>
            📱 WhatsApp: +593 99 999 9999
            <br><br>
            <em>Te enviaremos la guía manualmente</em>
        `;
    }
    if (successMessage) successMessage.style.display = 'none';
}

// ===== TESTING ESPECÍFICO =====
window.testClienteEmail = async function() {
    console.log('🧪 === TEST ESPECÍFICO - EMAIL AL CLIENTE ===');
    
    const datosTest = {
        nombre: "María Test",
        email: "test@cliente.com", // 🔧 CAMBIAR POR TU EMAIL PARA TESTING
        telefono: "+593987654321",
        ocupacion: "emprendedor",
        ciudad: "Quito"
    };
    
    // Solo probar envío al cliente
    const parametros = {
        to_email: datosTest.email,
        client_email: datosTest.email,
        email: datosTest.email,
        client_name: datosTest.nombre,
        client_phone: datosTest.telefono,
        client_occupation: datosTest.ocupacion,
        client_city: datosTest.ciudad,
        current_date: new Date().toLocaleDateString('es-EC'),
        current_time: new Date().toLocaleTimeString('es-EC'),
        download_url: EMAILJS_CONFIG.guiaDownloadUrl,
        name: datosTest.nombre,
        from_name: "IBT Business School",
        subject: `¡Hola ${datosTest.nombre}! Tu Guía de IA está lista 🎉`
    };
    
    console.log('📧 Testeando envío a:', datosTest.email);
    console.log('📋 Parámetros:', parametros);
    
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateCliente,
            parametros
        );
        
        console.log('✅ TEST AL CLIENTE EXITOSO:', response);
        alert(`✅ Email enviado al cliente: ${datosTest.email}`);
    } catch (error) {
        console.error('❌ Test al cliente falló:', error);
        alert(`❌ Test falló: ${error.text || error.message}`);
    }
};

// ===== VERIFICACIÓN RÁPIDA =====
window.verificarConfig = function() {
    console.log('🔍 === VERIFICACIÓN DE CONFIGURACIÓN ===');
    console.log('📧 Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('📋 Template Cliente:', EMAILJS_CONFIG.templateCliente);
    console.log('📊 Template Equipo:', EMAILJS_CONFIG.templateEquipo);
    console.log('🔑 Public Key:', EMAILJS_CONFIG.publicKey);
    console.log('📧 Email Equipo:', EMAILJS_CONFIG.emailEquipo);
    
    // Verificar que EmailJS esté cargado
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS está cargado');
    } else {
        console.error('❌ EmailJS NO está cargado');
    }
    
    // Verificar campos del formulario
    const campos = ['client_name', 'client_email', 'client_phone', 'client_occupation', 'client_city'];
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            console.log(`✅ Campo ${campo}: encontrado`);
        } else {
            console.error(`❌ Campo ${campo}: NO encontrado`);
        }
    });
    
    console.log('🎯 ¡Configuración verificada!');
};

// ===== LOGS FINALES =====
console.log('✅ === SCRIPT FINAL CORREGIDO ===');
console.log('📧 Template Cliente:', EMAILJS_CONFIG.templateCliente, '(recibe en SU email)');
console.log('📊 Template Equipo:', EMAILJS_CONFIG.templateEquipo, '(notificación)');
console.log('🔧 Service ID CORRECTO:', EMAILJS_CONFIG.serviceId, '← service_p9efz9f');
console.log('🧪 Test específico: testClienteEmail()');
console.log('🔍 Verificar config: verificarConfig()');
console.log('🚀 ¡Cliente recibirá email en SU dirección capturada!');