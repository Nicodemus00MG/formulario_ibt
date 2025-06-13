// ===== CONFIGURACIÓN EMAILJS =====
const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",        // ✅ Tu Public Key actual
    serviceId: "service_p9ef29f",           // ✅ Tu Service ID actual  
    templateId: "template_ho27i8c"     // 🔥 CAMBIA ESTO por tu Template ID correcto
};

// ===== CONFIGURACIÓN DE LA APLICACIÓN =====
const APP_CONFIG = {
    company: {
        name: "IBT Business School",
        email: "info@edu-ibt.com",
        phone: "+593 0982184871"
    },
    recipient: {
        email: "jonimates2000@gmail.com",    // Email donde quieres recibir los leads
        name: "Jonathan Mateus"
    }
};

// ===== VARIABLES GLOBALES =====
let isSubmitting = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema EmailJS + Netlify...');
    
    // Inicializar EmailJS
    try {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey,
        });
        console.log('✅ EmailJS inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando EmailJS:', error);
    }
    
    // Configurar el formulario
    setupForm();
    
    // Validar configuración
    validateConfig();
});

// ===== CONFIGURACIÓN DEL FORMULARIO =====
function setupForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('❌ No se encontró el formulario');
        return;
    }
    
    // Interceptar el envío del formulario
    form.addEventListener('submit', handleFormSubmit);
    
    console.log('📝 Formulario configurado correctamente');
}

// ===== MANEJADOR PRINCIPAL DEL FORMULARIO =====
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevenir envío normal
    
    if (isSubmitting) {
        console.log('⏳ Formulario ya en proceso...');
        return;
    }
    
    console.log('📤 Iniciando envío del formulario...');
    
    // Verificar honeypot
    const honeypot = event.target.querySelector('[name="bot-field"]');
    if (honeypot && honeypot.value) {
        console.log('🚫 Spam detectado');
        return;
    }
    
    // Validar campos
    if (!validateForm(event.target)) {
        return;
    }
    
    // Mostrar estado de carga
    showLoading(true);
    isSubmitting = true;
    
    try {
        // 1. PRIMERO: Enviar con EmailJS (para email inmediato)
        await sendWithEmailJS(event.target);
        console.log('✅ EmailJS enviado correctamente');
        
        // 2. SEGUNDO: Enviar a Netlify (para backup y dashboard)
        await sendToNetlify(event.target);
        console.log('✅ Datos enviados a Netlify');
        
        // Mostrar éxito
        showSuccess();
        
    } catch (error) {
        console.error('❌ Error en el envío:', error);
        
        // Si EmailJS falla, intentar solo Netlify
        try {
            await sendToNetlify(event.target);
            console.log('✅ Enviado a Netlify como fallback');
            showSuccess();
        } catch (netlifyError) {
            console.error('❌ Error total:', netlifyError);
            showError();
        }
    } finally {
        showLoading(false);
        isSubmitting = false;
    }
}

// ===== ENVÍO CON EMAILJS =====
async function sendWithEmailJS(form) {
    const templateParams = {
     
        // Variables principales (que ya tienes)
    client_name: form.client_name.value.trim(),
    client_email: form.client_email.value.trim(), 
    client_phone: form.client_phone.value.trim(),
    client_occupation: form.client_occupation.value,
    client_city: form.client_city.value.trim(),
    client_message: generateCustomMessage(form),
    
    // Variables adicionales (que debes agregar)
    guide_interest: "Sí",
    submission_date: getCurrentDateTime(),
    form_source: "IBT Business School - Landing Page",
    company_name: "IBT Business School",
    company_email: "info@edu-ibt.com",
    company_phone: "+593 0982184871",
        
        // Mensaje personalizado basado en ocupación
        client_message: generateCustomMessage(form),
        
        // Preferencias (valores por defecto)
        guide_interest: "Sí",
        contact_preference: "Email",
        
        // Información del sistema
        submission_date: getCurrentDateTime(),
        form_source: "IBT Business School - Landing Page",
        
        // Información de destino
        to_email: APP_CONFIG.recipient.email,
        to_name: APP_CONFIG.recipient.name,
        
        // Información de la empresa
        company_name: APP_CONFIG.company.name,
        company_email: APP_CONFIG.company.email,
        company_phone: APP_CONFIG.company.phone
    };
    
    console.log('📊 Enviando con EmailJS:', templateParams);
    
    const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
    );
    
    return response;
}

// ===== ENVÍO A NETLIFY =====
async function sendToNetlify(form) {
    const formData = new FormData(form);
    
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    });
    
    if (!response.ok) {
        throw new Error('Error enviando a Netlify');
    }
    
    return response;
}

// ===== FUNCIONES AUXILIARES =====
function validateForm(form) {
    const requiredFields = [
        'client_name',
        'client_phone', 
        'client_email',
        'client_occupation',
        'client_city'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = form.querySelector('#' + fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            if (field) {
                field.style.borderColor = '#ff4444';
                field.focus();
            }
        } else {
            if (field) field.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        }
    });
    
    // Validar email
    const email = form.client_email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        isValid = false;
        form.client_email.style.borderColor = '#ff4444';
    }
    
    if (!isValid) {
        alert('Por favor, completa todos los campos correctamente.');
    }
    
    return isValid;
}

function generateCustomMessage(form) {
    const occupation = form.client_occupation.value;
    const city = form.client_city.value;
    
    return `Hola, soy ${form.client_name.value} de ${city}. 
    Soy ${occupation} y estoy interesado/a en conocer más sobre las oportunidades 
    en Inteligencia Artificial para emprendedores. Me gustaría recibir la guía 
    gratuita y información sobre sus programas.`;
}

function getCurrentDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Guayaquil'
    };
    return now.toLocaleDateString('es-EC', options);
}

// ===== ESTADOS DE UI =====
function showLoading(show) {
    const loadingMessage = document.getElementById('loadingMessage');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    if (show) {
        loadingMessage.style.display = 'block';
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.style.opacity = '0.7';
    } else {
        loadingMessage.style.display = 'none';
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.style.opacity = '1';
    }
}

function showSuccess() {
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('contact-form').style.display = 'none';
    
    // Scroll al mensaje de éxito
    document.getElementById('successMessage').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Opcional: Redirect después de 3 segundos
    setTimeout(() => {
        window.location.href = './success.html';
    }, 3000);
}

function showError() {
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    
    // Scroll al mensaje de error
    document.getElementById('errorMessage').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// ===== VALIDACIÓN DE CONFIGURACIÓN =====
function validateConfig() {
    const issues = [];
    
    if (EMAILJS_CONFIG.publicKey === "TU_PUBLIC_KEY") {
        issues.push("❌ Public Key no configurado");
    }
    
    if (EMAILJS_CONFIG.templateId === "template_ibt_business") {
        issues.push("⚠️ Template ID debe ser actualizado");
    }
    
    if (issues.length > 0) {
        console.warn("🔧 Revisar configuración:");
        issues.forEach(issue => console.warn(issue));
    } else {
        console.log("✅ Configuración EmailJS válida");
    }
}

// ===== FUNCIONES GLOBALES PARA DEBUG =====
window.IBTDebug = {
    testEmailJS: function() {
        console.log("🧪 Probando EmailJS...");
        const testData = {
            client_name: "Usuario de Prueba",
            client_email: "test@example.com",
            client_phone: "+593999999999",
            client_occupation: "emprendedor",
            client_city: "Quito"
        };
        
        // Simular datos del formulario
        const mockForm = {
            client_name: { value: testData.client_name },
            client_email: { value: testData.client_email },
            client_phone: { value: testData.client_phone },
            client_occupation: { value: testData.client_occupation },
            client_city: { value: testData.client_city }
        };
        
        sendWithEmailJS(mockForm)
            .then(() => console.log("✅ Test EmailJS exitoso"))
            .catch(err => console.error("❌ Test EmailJS falló:", err));
    },
    
    checkConfig: function() {
        console.log("🔍 Configuración actual:", EMAILJS_CONFIG);
        validateConfig();
    }
};

console.log("🚀 IBT Business School - Sistema de formulario cargado");
console.log("🛠️ Para debug: IBTDebug.testEmailJS() o IBTDebug.checkConfig()");