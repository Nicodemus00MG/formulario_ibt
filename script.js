// ===== CONFIGURACIÓN EMAILJS FINAL =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",          
    serviceId: "service_p9efz9f",             
    templateId: "template_ho27i8c"            
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === IBT Business School - Sistema con Captura de Datos ===');
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
        
        // CAPTURA CORRECTA DE DATOS DEL FORMULARIO
        const clientName = document.getElementById('client_name').value.trim();
        const clientEmail = document.getElementById('client_email').value.trim();
        const clientPhone = document.getElementById('client_phone').value.trim();
        const clientOccupation = document.getElementById('client_occupation').value;
        const clientCity = document.getElementById('client_city').value.trim();
        
        console.log('📊 === DATOS CAPTURADOS DEL FORMULARIO ===');
        console.log('👤 Nombre:', clientName);
        console.log('📧 Email:', clientEmail);
        console.log('📱 Teléfono:', clientPhone);
        console.log('💼 Ocupación:', clientOccupation);
        console.log('🏙️ Ciudad:', clientCity);
        
        // Validar campos obligatorios
        if (!clientName || !clientEmail || !clientOccupation || !clientCity) {
            alert('Por favor, completa todos los campos obligatorios.');
            console.log('❌ Validación falló - campos vacíos');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
            alert('Por favor, ingresa un email válido.');
            console.log('❌ Email inválido:', clientEmail);
            return;
        }
        
        console.log('✅ Validación exitosa - enviando datos');
        
        // Mostrar estado de carga
        showLoading(true);
        
        try {
            // MAPEO CORRECTO DE VARIABLES PARA EL TEMPLATE
            const templateParams = {
                // Variables principales del template original
                name: clientName,                    // {{name}} en el template
                email: clientEmail,                  // {{email}} en el template  
                message: `🎓 NUEVA SOLICITUD - IBT BUSINESS SCHOOL

📋 INFORMACIÓN COMPLETA DEL CLIENTE:

👤 Nombre: ${clientName}
📧 Email: ${clientEmail}
📱 Teléfono: ${clientPhone || 'No proporcionado'}
💼 Ocupación: ${clientOccupation}
🏙️ Ciudad: ${clientCity}

📚 SOLICITUD:
El cliente está interesado en conocer más sobre las oportunidades en Inteligencia Artificial para emprendedores y desea recibir la guía gratuita "¿Quieres Trabajar en la Inteligencia Artificial?".

📅 INFORMACIÓN DEL SISTEMA:
• Fecha: ${new Date().toLocaleDateString('es-EC')}
• Hora: ${new Date().toLocaleTimeString('es-EC')}
• Fuente: Landing Page IBT Business School
• Estado: NUEVO LEAD - ALTA PRIORIDAD

🎯 ACCIÓN REQUERIDA:
Contactar al cliente en las próximas 24 horas para:
✅ Envío de guía de IA
✅ Seguimiento comercial  
✅ Información sobre programas

💬 CONTACTO PREFERIDO: ${clientPhone ? 'WhatsApp/Teléfono' : 'Email'}`,

                time: new Date().toLocaleString('es-EC', { 
                    timeZone: 'America/Guayaquil',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric', 
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                
                // Variables adicionales que podrían usar otros templates
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone || 'No proporcionado',
                client_occupation: clientOccupation,
                client_city: clientCity,
                client_message: `Solicitud de guía IA - Ocupación: ${clientOccupation}, Ciudad: ${clientCity}`,
                guide_interest: "Sí",
                contact_preference: clientPhone ? "WhatsApp" : "Email",
                submission_date: new Date().toLocaleString('es-EC'),
                form_source: "IBT Business School - Landing Page"
            };
            
            console.log('📧 === ENVIANDO CON EMAILJS ===');
            console.log('📨 Parámetros completos:', templateParams);
            
            // Enviar con EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );
            
            console.log('✅ ¡EMAIL CON DATOS ENVIADO EXITOSAMENTE!', response);
            console.log('📊 Status:', response.status);
            console.log('📧 Email enviado a jonimates2000@gmail.com con todos los datos');
            
            // Mostrar mensaje de éxito
            showSuccess();
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('❌ === ERROR AL ENVIAR ===');
            console.error('📄 Error:', error);
            console.error('📊 Status:', error.status);
            console.error('📧 Text:', error.text);
            
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
    
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => {
        console.log('🔄 Redirigiendo a success.html');
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

// ===== FUNCIONES DE DEBUG Y TESTING =====
window.IBTDebug = {
    // Test con datos reales del formulario
    testWithRealData: function() {
        console.log('🧪 === TEST CON DATOS REALES ===');
        
        // Llenar formulario con datos de prueba
        document.getElementById('client_name').value = "Juan Carlos Pérez";
        document.getElementById('client_email').value = "juan.perez@email.com";
        document.getElementById('client_phone').value = "+593987654321";
        document.getElementById('client_occupation').value = "emprendedor";
        document.getElementById('client_city').value = "Quito";
        
        console.log('✅ Formulario llenado con datos de prueba');
        
        // Obtener datos como lo hace el formulario real
        const clientName = document.getElementById('client_name').value.trim();
        const clientEmail = document.getElementById('client_email').value.trim();
        const clientPhone = document.getElementById('client_phone').value.trim();
        const clientOccupation = document.getElementById('client_occupation').value;
        const clientCity = document.getElementById('client_city').value.trim();
        
        console.log('📊 Datos capturados:');
        console.log('- Nombre:', clientName);
        console.log('- Email:', clientEmail);
        console.log('- Teléfono:', clientPhone);
        console.log('- Ocupación:', clientOccupation);
        console.log('- Ciudad:', clientCity);
        
        // Preparar parámetros igual que el formulario
        const testParams = {
            name: clientName,
            email: clientEmail,
            message: `🎓 TEST CON DATOS REALES - IBT BUSINESS SCHOOL

📋 INFORMACIÓN DEL CLIENTE:
👤 Nombre: ${clientName}
📧 Email: ${clientEmail}
📱 Teléfono: ${clientPhone}
💼 Ocupación: ${clientOccupation}
🏙️ Ciudad: ${clientCity}

🧪 Este es un email de prueba con datos reales capturados del formulario.`,
            time: new Date().toLocaleString('es-EC'),
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            client_occupation: clientOccupation,
            client_city: clientCity
        };
        
        console.log('📤 Enviando test con datos reales...');
        console.log('📨 Parámetros:', testParams);
        
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, testParams)
            .then(response => {
                console.log('✅ ¡TEST CON DATOS REALES EXITOSO!', response);
                alert('✅ Email enviado con datos reales. Revisa jonimates2000@gmail.com');
            })
            .catch(error => {
                console.error('❌ Test con datos falló:', error);
                alert('❌ Test falló. Revisa consola.');
            });
    },
    
    // Verificar campos del formulario
    checkFormFields: function() {
        console.log('🔍 === VERIFICACIÓN DE CAMPOS ===');
        
        const fields = [
            'client_name',
            'client_email', 
            'client_phone',
            'client_occupation',
            'client_city'
        ];
        
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                console.log(`✅ ${fieldId}:`, element.value || '(vacío)');
            } else {
                console.log(`❌ ${fieldId}: NO ENCONTRADO`);
            }
        });
    },
    
    // Simular envío completo
    simulateFormSubmit: function() {
        console.log('📝 === SIMULANDO ENVÍO COMPLETO ===');
        
        // Llenar formulario
        document.getElementById('client_name').value = "María González";
        document.getElementById('client_email').value = "maria.gonzalez@empresa.com";
        document.getElementById('client_phone').value = "+593999888777";
        document.getElementById('client_occupation').value = "empresario";
        document.getElementById('client_city').value = "Guayaquil";
        
        console.log('✅ Formulario llenado para simulación');
        
        // Disparar evento de envío
        const form = document.getElementById('contact-form');
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(submitEvent);
        
        console.log('🚀 Evento de envío disparado');
    }
};

// ===== LOGS DE INICIALIZACIÓN =====
console.log('✅ === SCRIPT IBT - CAPTURA DE DATOS CORRECTA ===');
console.log('🎯 Versión: CAPTURA DE DATOS FUNCIONAL');
console.log('📧 Datos se envían a: jonimates2000@gmail.com');
console.log('🛠️ Comandos de debug:');
console.log('  • IBTDebug.testWithRealData() - Test con datos del formulario');
console.log('  • IBTDebug.checkFormFields() - Verificar campos');
console.log('  • IBTDebug.simulateFormSubmit() - Simular envío completo');
console.log('🚀 ¡Sistema listo para capturar datos correctamente!');