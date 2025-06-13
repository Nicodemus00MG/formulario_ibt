// ===== SCRIPT DE DEBUG PARA IDENTIFICAR EL PROBLEMA =====

// 🔍 POSIBLES SERVICE IDs (uno de estos debe funcionar)
const POSSIBLE_SERVICE_IDS = [
    "service_p9efz9f",  // De tu captura
    "service_p9ef29f",  // Variante
    "service_p9efzpf",  // Otra variante
    "default_service",  // Por si es el default
    "gmail_service"     // Por si es así
];

const EMAILJS_CONFIG = {
    publicKey: "vCEpn-B_Inhh-QqeM",
    currentServiceId: "service_p9efz9f", // Empezamos con este
    templateCliente: "template_l45fbgl",
    templateEquipo: "template_ho27i8c",
    emailEquipo: "jonimates2000@gmail.com"
};

// ===== INICIALIZACIÓN CON DEBUG =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 === DEBUG MODE - EMAILJS ===');
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS no está cargado!');
        alert('❌ EmailJS no está cargado. Revisa que el script esté incluido.');
        return;
    }
    
    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        console.log('✅ EmailJS inicializado con Public Key:', EMAILJS_CONFIG.publicKey);
    } catch (error) {
        console.error('❌ Error inicializando EmailJS:', error);
        return;
    }
    
    // Mostrar configuración actual
    debugCurrentConfig();
    setupForm();
});

// ===== FUNCIÓN PARA MOSTRAR CONFIGURACIÓN ACTUAL =====
function debugCurrentConfig() {
    console.log('📋 === CONFIGURACIÓN ACTUAL ===');
    console.log('🔑 Public Key:', EMAILJS_CONFIG.publicKey);
    console.log('🆔 Service ID:', EMAILJS_CONFIG.currentServiceId);
    console.log('📧 Template Cliente:', EMAILJS_CONFIG.templateCliente);
    console.log('📊 Template Equipo:', EMAILJS_CONFIG.templateEquipo);
    console.log('📮 Email Equipo:', EMAILJS_CONFIG.emailEquipo);
    
    console.log('\n🔍 === FUNCIONES DE DEBUG DISPONIBLES ===');
    console.log('• testAllServiceIds() - Probar todos los Service IDs posibles');
    console.log('• testSpecificServiceId("ID") - Probar un Service ID específico');
    console.log('• showEmailJSInfo() - Mostrar info de EmailJS');
    console.log('• testSimpleEmail() - Test básico de envío');
}

// ===== TEST DE TODOS LOS SERVICE IDS POSIBLES =====
window.testAllServiceIds = async function() {
    console.log('🧪 === TESTING TODOS LOS SERVICE IDS POSIBLES ===');
    
    const testParams = {
        to_email: "test@ejemplo.com",
        from_name: "Debug Test",
        subject: "Test de Service ID",
        message: "Este es un test para encontrar el Service ID correcto",
        name: "Test User",
        email: "test@ejemplo.com"
    };
    
    for (let serviceId of POSSIBLE_SERVICE_IDS) {
        console.log(`\n🔍 Probando Service ID: ${serviceId}`);
        
        try {
            const response = await emailjs.send(
                serviceId,
                EMAILJS_CONFIG.templateEquipo, // Usar template que sabemos que existe
                testParams
            );
            
            console.log(`✅ ¡ÉXITO! Service ID correcto: ${serviceId}`, response);
            alert(`✅ ¡Service ID encontrado: ${serviceId}!`);
            
            // Actualizar configuración
            EMAILJS_CONFIG.currentServiceId = serviceId;
            console.log(`🔧 Service ID actualizado a: ${serviceId}`);
            return serviceId;
            
        } catch (error) {
            console.log(`❌ Falló ${serviceId}:`, error.text || error.message);
        }
    }
    
    console.log('❌ Ningún Service ID funcionó. Verifica tu dashboard de EmailJS.');
    alert('❌ Ningún Service ID funcionó. Ve a tu dashboard de EmailJS y copia el Service ID exacto.');
};

// ===== TEST DE UN SERVICE ID ESPECÍFICO =====
window.testSpecificServiceId = async function(serviceId) {
    console.log(`🧪 === TESTING SERVICE ID ESPECÍFICO: ${serviceId} ===`);
    
    if (!serviceId) {
        const userInput = prompt('Ingresa el Service ID exacto desde tu dashboard:');
        if (!userInput) return;
        serviceId = userInput.trim();
    }
    
    const testParams = {
        to_email: "test@ejemplo.com",
        from_name: "Debug Test Específico",
        subject: "Test de Service ID Específico",
        message: `Probando Service ID: ${serviceId}`,
        name: "Test User",
        email: "test@ejemplo.com"
    };
    
    try {
        const response = await emailjs.send(
            serviceId,
            EMAILJS_CONFIG.templateEquipo,
            testParams
        );
        
        console.log(`✅ ¡ÉXITO! Service ID ${serviceId} funciona:`, response);
        alert(`✅ Service ID ${serviceId} es correcto!`);
        
        EMAILJS_CONFIG.currentServiceId = serviceId;
        return true;
        
    } catch (error) {
        console.error(`❌ Service ID ${serviceId} falló:`, error);
        alert(`❌ Service ID ${serviceId} no funciona: ${error.text || error.message}`);
        return false;
    }
};

// ===== MOSTRAR INFO DE EMAILJS =====
window.showEmailJSInfo = function() {
    console.log('📧 === INFORMACIÓN DE EMAILJS ===');
    
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS está cargado');
        console.log('📦 Versión EmailJS:', emailjs.version || 'Desconocida');
        console.log('🔧 EmailJS objeto:', emailjs);
    } else {
        console.error('❌ EmailJS no está disponible');
    }
    
    // Verificar formulario
    const form = document.getElementById('contact-form');
    if (form) {
        console.log('✅ Formulario encontrado');
        
        // Verificar campos
        const campos = ['client_name', 'client_email', 'client_phone', 'client_occupation', 'client_city'];
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            console.log(`${elemento ? '✅' : '❌'} Campo ${campo}: ${elemento ? 'encontrado' : 'NO encontrado'}`);
        });
    } else {
        console.error('❌ Formulario contact-form NO encontrado');
    }
};

// ===== TEST SIMPLE DE EMAIL =====
window.testSimpleEmail = async function() {
    console.log('📧 === TEST SIMPLE DE EMAIL ===');
    
    // Pedir Service ID al usuario
    const serviceId = prompt('Copia y pega tu Service ID exacto desde EmailJS dashboard:');
    if (!serviceId) {
        alert('Cancelado');
        return;
    }
    
    const testParams = {
        to_email: EMAILJS_CONFIG.emailEquipo,
        from_name: "Test Simple",
        subject: "Test Simple IBT",
        message: "Este es un test simple para verificar conexión",
        name: "Test Simple User",
        email: EMAILJS_CONFIG.emailEquipo
    };
    
    console.log('📤 Enviando con Service ID:', serviceId);
    console.log('📋 Parámetros:', testParams);
    
    try {
        const response = await emailjs.send(
            serviceId,
            EMAILJS_CONFIG.templateEquipo,
            testParams
        );
        
        console.log('✅ TEST SIMPLE EXITOSO:', response);
        alert(`✅ ¡Funciona! Email enviado con Service ID: ${serviceId}`);
        
        // Guardar el Service ID que funciona
        EMAILJS_CONFIG.currentServiceId = serviceId;
        console.log(`🔧 Service ID guardado: ${serviceId}`);
        
        return serviceId;
        
    } catch (error) {
        console.error('❌ Test simple falló:', error);
        alert(`❌ Test falló: ${error.text || error.message}\n\nVerifica que el Service ID sea exacto.`);
    }
};

// ===== FORMULARIO BÁSICO =====
function setupForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('🔧 Modo debug activo. Usa las funciones de test en la consola primero.');
        console.log('🔧 Usa: testAllServiceIds() o testSimpleEmail()');
    });
}

// ===== INSTRUCCIONES AUTOMÁTICAS =====
setTimeout(() => {
    console.log('\n🎯 === INSTRUCCIONES DE DEBUG ===');
    console.log('1. Abre tu dashboard de EmailJS');
    console.log('2. Ve a "Email Services"');
    console.log('3. Copia el Service ID EXACTO');
    console.log('4. Ejecuta: testSpecificServiceId("TU_SERVICE_ID_AQUI")');
    console.log('\nO ejecuta: testAllServiceIds() para probar automáticamente');
    console.log('\n🚀 ¡Una vez que encuentres el Service ID correcto, podemos continuar!');
}, 2000);

console.log('🔍 === SCRIPT DE DEBUG CARGADO ===');
console.log('🎯 Objetivo: Encontrar el Service ID correcto');
console.log('📧 Ejecuta testAllServiceIds() para empezar');