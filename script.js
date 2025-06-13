// ===== CONFIGURACIÓN EMAILJS FINAL CORRECTA =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",          // ✅ Correcto
    serviceId: "service_p9efz9f",             // ✅ CORREGIDO - Exacto de tu dashboard
    templateId: "template_ho27i8c"            // ✅ Correcto - Exacto de tu dashboard
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === IBT Business School - Sistema de Formulario FINAL ===');
    console.log('📋 Configuración EmailJS DEFINITIVA:', EMAILJS_CONFIG);
    
    // Verificar que EmailJS esté disponible
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS no está cargado!');
        return;
    }
    
    // Inicializar EmailJS
    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        console.log('✅ EmailJS inicializado correctamente');
        console.log('🔧 Service ID CORRECTO:', EMAILJS_CONFIG.serviceId);
        console.log('📧 Template ID CORRECTO:', EMAILJS_CONFIG.templateId);
    } catch (error) {
        console.error('❌ Error inicializando EmailJS:', error);
        return;
    }
    
    // Configurar el formulario
    setupForm();
});

// ===== CONFIGURACIÓN DEL FORMULARIO =====
function setupForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    console.log('📝 Formulario encontrado, configurando evento...');
    
    // Evento de envío del formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('📤 === ENVÍO DE FORMULARIO INICIADO ===');
        console.log('🎯 Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
        
        // Verificar honeypot
        const honeypot = form.querySelector('[name="bot-field"]');
        if (honeypot && honeypot.value) {
            console.log('🚫 Spam detectado');
            return;
        }
        
        // Obtener datos del formulario
        const formData = {
            client_name: form.client_name.value.trim(),
            client_email: form.client_email.value.trim(),
            client_phone: form.client_phone.value.trim(),
            client_occupation: form.client_occupation.value,
            client_city: form.client_city.value.trim()
        };
        
        console.log('📊 Datos capturados del formulario:', formData);
        
        // Validar campos obligatorios
        if (!formData.client_name || !formData.client_email || !formData.client_occupation || !formData.client_city) {
            alert('Por favor, completa todos los campos obligatorios.');
            console.log('❌ Validación falló - campos vacíos');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.client_email)) {
            alert('Por favor, ingresa un email válido.');
            console.log('❌ Email inválido:', formData.client_email);
            return;
        }
        
        console.log('✅ Validación exitosa - iniciando envío');
        
        // Mostrar estado de carga
        showLoading(true);
        
        try {
            // Preparar datos para el template
            const templateParams = {
                // Variables principales que usa tu template
                name: formData.client_name,
                email: formData.client_email,
                message: `🎓 NUEVA SOLICITUD - IBT BUSINESS SCHOOL

👤 INFORMACIÓN DEL CLIENTE:
▪️ Nombre: ${formData.client_name}
▪️ Email: ${formData.client_email}
▪️ Teléfono: ${formData.client_phone}
▪️ Ocupación: ${formData.client_occupation}
▪️ Ciudad: ${formData.client_city}

💼 SOLICITUD:
El cliente está interesado en conocer más sobre las oportunidades en Inteligencia Artificial para emprendedores y desea recibir la guía gratuita "¿Quieres Trabajar en la Inteligencia Artificial?".

📅 INFORMACIÓN DEL SISTEMA:
▪️ Fecha y hora: ${new Date().toLocaleString('es-EC', { 
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}
▪️ Fuente: Landing Page IBT Business School
▪️ Estado: NUEVO LEAD - ALTA PRIORIDAD

🎯 ACCIÓN REQUERIDA:
Contactar al cliente en las próximas 24 horas para:
• Envío de guía de IA
• Seguimiento comercial
• Información sobre programas`,
                
                time: new Date().toLocaleString('es-EC', { 
                    timeZone: 'America/Guayaquil'
                })
            };
            
            console.log('📧 Enviando email con EmailJS...');
            console.log('📨 Parámetros del template:', templateParams);
            
            // Enviar con EmailJS usando credenciales correctas
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,    // service_p9efz9f
                EMAILJS_CONFIG.templateId,   // template_ho27i8c
                templateParams
            );
            
            console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!', response);
            console.log('📊 Detalles de la respuesta:');
            console.log('  - Status:', response.status);
            console.log('  - Text:', response.text);
            console.log('📧 Email enviado a jonimates2000@gmail.com');
            
            // Mostrar mensaje de éxito
            showSuccess();
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('❌ === ERROR AL ENVIAR EMAIL ===');
            console.error('📄 Error completo:', error);
            console.error('📊 Detalles:');
            console.error('  - Status:', error.status);
            console.error('  - Text:', error.text);
            console.error('  - Message:', error.message);
            
            // Análisis detallado del error
            if (error.status === 400) {
                console.error('🚨 ERROR 400 - Bad Request');
                if (error.text && error.text.includes('service ID not found')) {
                    console.error('❌ SERVICE ID INCORRECTO');
                    console.error('🔧 Service ID usado:', EMAILJS_CONFIG.serviceId);
                    console.error('📝 Verifica en: https://dashboard.emailjs.com/admin/email');
                    alert('❌ Service ID incorrecto. Contacta al administrador.');
                } else if (error.text && error.text.includes('template')) {
                    console.error('❌ TEMPLATE ID INCORRECTO');
                    console.error('📧 Template ID usado:', EMAILJS_CONFIG.templateId);
                    alert('❌ Template ID incorrecto. Contacta al administrador.');
                } else {
                    console.error('❌ Otro error 400:', error.text);
                    alert('❌ Error en los datos enviados. Contacta al administrador.');
                }
            } else if (error.status === 401) {
                console.error('🚨 ERROR 401 - No autorizado');
                console.error('❌ PUBLIC KEY INCORRECTO:', EMAILJS_CONFIG.publicKey);
                alert('❌ Error de autorización. Contacta al administrador.');
            } else if (error.status === 404) {
                console.error('🚨 ERROR 404 - No encontrado');
                alert('❌ Servicio no encontrado. Contacta al administrador.');
            } else {
                console.error('🚨 ERROR DESCONOCIDO');
                alert('❌ Error desconocido. Contacta al administrador.');
            }
            
            // Intentar envío a Netlify como respaldo
            try {
                console.log('🔄 === INTENTANDO RESPALDO CON NETLIFY ===');
                
                const formDataNetlify = new FormData(form);
                const netlifResponse = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formDataNetlify).toString()
                });
                
                if (netlifResponse.ok) {
                    console.log('✅ Datos enviados a Netlify exitosamente');
                    showSuccess();
                    form.reset();
                } else {
                    throw new Error(`Error Netlify: ${netlifResponse.status}`);
                }
                
            } catch (netlifyError) {
                console.error('❌ Error total - EmailJS y Netlify fallaron:', netlifyError);
                showError();
            }
        } finally {
            showLoading(false);
        }
    });
    
    console.log('✅ Formulario configurado correctamente');
}

// ===== FUNCIONES DE INTERFAZ =====
function showLoading(show) {
    const loadingMessage = document.getElementById('loadingMessage');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    if (show) {
        if (loadingMessage) loadingMessage.style.display = 'block';
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        submitBtn.style.opacity = '0.7';
        console.log('⏳ Mostrando estado de carga');
    } else {
        if (loadingMessage) loadingMessage.style.display = 'none';
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        submitBtn.style.opacity = '1';
        console.log('🔄 Ocultando estado de carga');
    }
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const form = document.getElementById('contact-form');
    
    if (successMessage) successMessage.style.display = 'block';
    if (errorMessage) errorMessage.style.display = 'none';
    if (form) form.style.display = 'none';
    
    console.log('🎉 Mostrando mensaje de éxito');
    
    // Scroll al mensaje de éxito
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Redirigir a página de éxito después de 4 segundos
    setTimeout(() => {
        console.log('🔄 Redirigiendo a página de éxito');
        window.location.href = './success.html';
    }, 4000);
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (errorMessage) errorMessage.style.display = 'block';
    if (successMessage) successMessage.style.display = 'none';
    
    console.log('❌ Mostrando mensaje de error');
    
    // Scroll al mensaje de error
    if (errorMessage) {
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== FUNCIONES DE DEBUG Y TESTING =====
window.IBTDebug = {
    // Test inmediato con credenciales correctas
    testEmailJS: function() {
        console.log('🧪 === TEST EMAILJS CON CREDENCIALES CORRECTAS ===');
        console.log('🔧 Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
        console.log('🔑 Public Key:', EMAILJS_CONFIG.publicKey);
        
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS no disponible');
            return;
        }
        
        const testParams = {
            name: "Test Usuario Final IBT",
            email: "test@example.com",
            message: `🧪 TEST FINAL DEL FORMULARIO IBT BUSINESS SCHOOL

Este es un email de prueba para verificar que el sistema de EmailJS está funcionando correctamente con las credenciales exactas del dashboard.

✅ Service ID: ${EMAILJS_CONFIG.serviceId}
✅ Template ID: ${EMAILJS_CONFIG.templateId}
✅ Timestamp: ${new Date().toLocaleString('es-EC')}

Si recibes este email, ¡el sistema está funcionando perfectamente!`,
            time: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
        };
        
        console.log('📤 Enviando email de prueba...');
        console.log('📨 Parámetros:', testParams);
        
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, testParams)
            .then(response => {
                console.log('✅ ¡TEST EXITOSO!', response);
                alert('✅ ¡Email de prueba enviado exitosamente! Revisa jonimates2000@gmail.com');
            })
            .catch(error => {
                console.error('❌ Test falló:', error);
                console.error('📄 Detalles:', {
                    status: error.status,
                    text: error.text,
                    message: error.message
                });
                alert('❌ Test falló. Revisa la consola para detalles.');
            });
    },
    
    // Verificar configuración actual
    checkConfig: function() {
        console.log('🔍 === VERIFICACIÓN DE CONFIGURACIÓN ===');
        console.log('📧 EmailJS disponible:', typeof emailjs !== 'undefined');
        console.log('🔑 Public Key:', EMAILJS_CONFIG.publicKey);
        console.log('🔧 Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
        console.log('📝 Formulario encontrado:', document.getElementById('contact-form') !== null);
        
        // Verificar campos del formulario
        const fields = ['client_name', 'client_email', 'client_phone', 'client_occupation', 'client_city'];
        console.log('🔍 Campos del formulario:');
        fields.forEach(field => {
            const element = document.getElementById(field);
            console.log(`  ${field}:`, element ? '✅ OK' : '❌ No encontrado');
        });
    },
    
    // Simular envío completo del formulario
    simulateFormSubmit: function() {
        console.log('📝 === SIMULANDO ENVÍO COMPLETO ===');
        
        // Llenar formulario automáticamente
        document.getElementById('client_name').value = "Usuario de Prueba IBT";
        document.getElementById('client_email').value = "prueba@ibtsistemas.com";
        document.getElementById('client_phone').value = "+593987654321";
        document.getElementById('client_occupation').value = "emprendedor";
        document.getElementById('client_city').value = "Quito";
        
        console.log('✅ Formulario llenado automáticamente');
        
        // Simular envío
        const form = document.getElementById('contact-form');
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(submitEvent);
        
        console.log('🚀 Evento de envío simulado');
    }
};

// ===== LOGS DE INICIALIZACIÓN =====
console.log('✅ === SCRIPT IBT BUSINESS SCHOOL CARGADO ===');
console.log('🎯 Versión: FINAL DEFINITIVA');
console.log('📋 Credenciales: VERIFICADAS');
console.log('🛠️ Comandos de debug disponibles:');
console.log('  • IBTDebug.testEmailJS() - Test directo de EmailJS');
console.log('  • IBTDebug.checkConfig() - Verificar configuración');
console.log('  • IBTDebug.simulateFormSubmit() - Simular envío completo');
console.log('📧 Emails se envían a: jonimates2000@gmail.com');
console.log('🚀 ¡Sistema listo para funcionar!');