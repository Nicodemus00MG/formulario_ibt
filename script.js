// ===== CONFIGURACIÓN EMAILJS - PARA VERIFICAR =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",          
    serviceId: "service_p9efz9fi",             // 🔄 VOLVEMOS AL ORIGINAL PARA PROBAR
    templateId: "template_ho27i8c"            
};

// ===== INICIALIZACIÓN CON DEBUG COMPLETO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === IBT Business School - Sistema de Formulario (DEBUG MODE) ===');
    console.log('📋 Configuración EmailJS:', EMAILJS_CONFIG);
    
    // Verificar que EmailJS esté disponible
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
        
        console.log('📊 Datos del formulario:', formData);
        
        // Validar campos obligatorios
        if (!formData.client_name || !formData.client_email || !formData.client_occupation || !formData.client_city) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.client_email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        console.log('✅ Validación exitosa');
        
        // Mostrar loading
        showLoading(true);
        
        try {
            // Preparar datos SIMPLES para el template original
            const templateParams = {
                name: formData.client_name,
                email: formData.client_email,
                message: `Ocupación: ${formData.client_occupation}
Ciudad: ${formData.client_city}
Teléfono: ${formData.client_phone}

Mensaje: Estoy interesado/a en conocer más sobre las oportunidades en Inteligencia Artificial para emprendedores.`,
                time: new Date().toLocaleString('es-EC')
            };
            
            console.log('📧 === INTENTANDO ENVÍO CON EMAILJS ===');
            console.log('🔧 Service ID:', EMAILJS_CONFIG.serviceId);
            console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
            console.log('📋 Parámetros:', templateParams);
            
            // Enviar con EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,    
                EMAILJS_CONFIG.templateId,   
                templateParams
            );
            
            console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!', response);
            showSuccess();
            form.reset();
            
        } catch (error) {
            console.error('❌ === ERROR DETALLADO ===');
            console.error('Error completo:', error);
            console.error('Status:', error.status);
            console.error('Text:', error.text);
            console.error('Message:', error.message);
            
            // Análisis específico del error
            if (error.status === 400) {
                if (error.text && error.text.includes('service ID not found')) {
                    console.error('🚨 SERVICE ID INCORRECTO!');
                    console.error('🔧 Service ID usado:', EMAILJS_CONFIG.serviceId);
                    console.error('📝 Ve a https://dashboard.emailjs.com/admin/email');
                    console.error('📝 Copia el Service ID exacto de tu servicio Gmail');
                    alert('❌ Service ID incorrecto. Revisa la consola para instrucciones.');
                } else if (error.text && error.text.includes('template')) {
                    console.error('🚨 TEMPLATE ID INCORRECTO!');
                    console.error('📧 Template ID usado:', EMAILJS_CONFIG.templateId);
                    alert('❌ Template ID incorrecto. Revisa la consola.');
                } else {
                    console.error('🚨 ERROR 400 - Otros:', error.text);
                }
            } else if (error.status === 401) {
                console.error('🚨 PUBLIC KEY INCORRECTO!');
                console.error('🔑 Public Key usado:', EMAILJS_CONFIG.publicKey);
            } else if (error.status === 404) {
                console.error('🚨 RECURSO NO ENCONTRADO!');
            }
            
            // Fallback a Netlify
            try {
                console.log('🔄 === FALLBACK A NETLIFY ===');
                const formDataNetlify = new FormData(form);
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formDataNetlify).toString()
                });
                
                if (response.ok) {
                    console.log('✅ Enviado a Netlify exitosamente');
                    showSuccess();
                    form.reset();
                } else {
                    throw new Error(`Netlify Error: ${response.status}`);
                }
            } catch (netlifyError) {
                console.error('❌ Error total:', netlifyError);
                showError();
            }
        } finally {
            showLoading(false);
        }
    });
    
    console.log('✅ Formulario configurado correctamente');
}

// ===== FUNCIONES DE UI (IGUALES) =====
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
    
    if (successMessage) successMessage.style.display = 'block';
    if (errorMessage) errorMessage.style.display = 'none';
    if (form) form.style.display = 'none';
    
    console.log('🎉 Mostrando mensaje de éxito');
    
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => {
        window.location.href = './success.html';
    }, 4000);
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (errorMessage) errorMessage.style.display = 'block';
    if (successMessage) successMessage.style.display = 'none';
    
    console.log('❌ Mostrando mensaje de error');
    
    if (errorMessage) {
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== FUNCIONES DE DEBUG AVANZADAS =====
window.IBTDebug = {
    // Test con diferentes Service IDs
    testAllServiceIds: function() {
        console.log('🧪 === PROBANDO DIFERENTES SERVICE IDs ===');
        
        const possibleServiceIds = [
            'service_ddujhgi',      // Original
            'service_p9ef29f',      // El que vimos antes
            'service_default',      // Posible default
        ];
        
        possibleServiceIds.forEach((serviceId, index) => {
            setTimeout(() => {
                console.log(`🔄 Probando Service ID ${index + 1}: ${serviceId}`);
                
                const testParams = {
                    name: `Test ${index + 1}`,
                    email: "test@example.com",
                    message: `Test con Service ID: ${serviceId}`,
                    time: new Date().toLocaleString()
                };
                
                emailjs.send(serviceId, EMAILJS_CONFIG.templateId, testParams)
                    .then(response => {
                        console.log(`✅ Service ID CORRECTO: ${serviceId}`, response);
                        alert(`✅ Service ID correcto encontrado: ${serviceId}`);
                    })
                    .catch(error => {
                        console.log(`❌ Service ID ${serviceId} falló:`, error.text);
                    });
            }, index * 2000); // Esperar 2 segundos entre cada test
        });
    },
    
    // Obtener configuración actual
    getCurrentConfig: function() {
        console.log('📋 === CONFIGURACIÓN ACTUAL ===');
        console.log('🔑 Public Key:', EMAILJS_CONFIG.publicKey);
        console.log('🔧 Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
        console.log('📧 EmailJS disponible:', typeof emailjs !== 'undefined');
    },
    
    // Test simple
    testSimple: function() {
        console.log('🧪 === TEST SIMPLE ===');
        
        const testParams = {
            name: "Test Simple",
            email: "test@example.com", 
            message: "Test simple del formulario",
            time: new Date().toLocaleString()
        };
        
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, testParams)
            .then(response => {
                console.log('✅ Test simple exitoso!', response);
                alert('✅ Test exitoso! Revisa jonimates2000@gmail.com');
            })
            .catch(error => {
                console.error('❌ Test simple falló:', error);
                alert('❌ Test falló - revisa consola');
            });
    }
};

console.log('✅ === SCRIPT CARGADO CON DEBUG COMPLETO ===');
console.log('🛠️ Comandos disponibles:');
console.log('  - IBTDebug.testSimple() // Test rápido');
console.log('  - IBTDebug.testAllServiceIds() // Probar todos los Service IDs');
console.log('  - IBTDebug.getCurrentConfig() // Ver configuración');
console.log('📝 IMPORTANTE: Ve a https://dashboard.emailjs.com/admin/email');
console.log('📝 Copia el Service ID EXACTO de tu servicio Gmail');