<template>
  <div class="container">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">CRM</h1>
        <!-- <a href="/login" class="btn btn-primary">Comenzar</a> -->
      </div>
    </header>

    <main>
      <section class="hero">
        <h2 class="hero-title">Convierte visitas en clientes</h2>
        <p class="hero-text">
          Un <strong>lead</strong> es una persona interesada en tus servicios. Con LeadCRM, puedes capturarlos, darles seguimiento y cerrar más ventas con facilidad.
        </p>
        <!-- <a href="/login" class="btn btn-primary btn-large">Empieza gratis</a> -->
      </section>

      <section class="features">
        <div class="feature">
          <h3>📩 Captura Leads</h3>
          <p>Formulario integrado para recopilar información de clientes potenciales en segundos.</p>
        </div>
        <div class="feature">
          <h3>📊 Organiza y Clasifica</h3>
          <p>Visualiza todos tus leads en un panel claro, con filtros por estado y prioridad.</p>
        </div>
        <div class="feature">
          <h3>📈 Mejora tus conversiones</h3>
          <p>Haz seguimiento de cada contacto, optimiza tus campañas y aumenta tus cierres de venta.</p>
        </div>
      </section>

      <section class="contact-section">
        <h1>📝 Formulario de Contacto</h1>
        <p>Completa los campos a continuación y nos pondremos en contacto contigo.</p>

        <form @submit.prevent="handleSubmit" class="contact-form">
          <label for="name">Nombre completo:</label>
          <input id="name" v-model="form.name" required placeholder="Tu nombre completo" />

          <label for="email">Correo:</label>
          <input id="email" type="email" v-model="form.email" required placeholder="ejemplo@correo.com" />

          <label for="phone">Teléfono:</label>
          <input id="phone" v-model="form.phone" required placeholder="+52 55 1234 5678" />

          <label for="message">Mensaje:</label>
          <textarea id="message" v-model="form.message" rows="5" required placeholder="Cuéntanos más..."></textarea>

          <div class="terms">
            <input type="checkbox" id="terms" v-model="form.acceptedTerms" />
            <label for="terms">Acepto los</label>
            <button type="button" @click="showTerms = true" class="link-button">Términos y condiciones</button>
          </div>

          <!-- <div
            class="g-recaptcha"
            ref="recaptcha"
            :data-sitekey="recaptchaSiteKey"
          ></div> -->

          <button type="submit" class="btn btn-primary btn-submit" :disabled="isLoading">
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Enviar</span>
          </button>

          <p v-if="success" class="message success">✅ Enviado correctamente</p>
          <p v-if="error" class="message error">❌ {{ error }}</p>
        </form>
      </section>
    </main>

    <div v-if="showTerms" class="modal-overlay">
        <div class="modal">
          <h2>Términos y Condiciones</h2>
          <p><strong>1. Aceptación de los términos</strong></p>
          <p>Al enviar este formulario, usted acepta que la información proporcionada será utilizada únicamente con fines de contacto y seguimiento comercial, de acuerdo con nuestras políticas de privacidad.</p>

          <p><strong>2. Uso de la información</strong></p>
          <p>Los datos recopilados no serán compartidos con terceros sin su consentimiento, salvo en los casos en que sea requerido por ley.</p>

          <p><strong>3. Comunicación</strong></p>
          <p>Usted acepta que podemos comunicarnos con usted mediante correo electrónico o teléfono con respecto a su consulta o para ofrecerle servicios relacionados.</p>

          <p><strong>4. Protección de datos</strong></p>
          <p>Sus datos serán tratados con confidencialidad y almacenados de forma segura conforme a la legislación vigente en materia de protección de datos personales.</p>

          <p><strong>5. Modificaciones</strong></p>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las actualizaciones estarán disponibles en este sitio web.</p>

          <p>Para más información, puede contactarnos directamente a través del formulario.</p>

          <button @click="showTerms = false" class="btn btn-close">Cerrar</button>
        </div>
      </div>


    <footer>
      © 2025 LeadCRM — Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// import { useRouter } from 'vue-router'
import emailjs from 'emailjs-com'

// const router = useRouter()

const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailjsUserId = import.meta.env.VITE_EMAILJS_USER_ID

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  acceptedTerms: false
})

const success = ref(false)
const error = ref('')
const showTerms = ref(false)

// const recaptcha = ref(null)
// const recaptchaWidgetId = ref(null)

const apiUrl = import.meta.env.VITE_API_URL
// const recaptchaSiteKey = import.meta.env.VITE_SITE_KEY

const isLoading = ref(false)

// if (!recaptchaSiteKey) {
//   console.error('❌ No se encontró VITE_SITE_KEY en tu archivo .env')
// }

// onMounted(() => {
//   const renderCaptcha = () => {
//     if (
//       window.grecaptcha &&
//       recaptcha.value &&
//       recaptcha.value.children.length === 0 &&
//       recaptchaWidgetId.value === null
//     ) {
//       recaptchaWidgetId.value = grecaptcha.render(recaptcha.value, {
//         sitekey: recaptchaSiteKey
//       })
//     }
//   }

//   if (window.grecaptcha) {
//     renderCaptcha()
//   } else {
//     const interval = setInterval(() => {
//       if (window.grecaptcha) {
//         renderCaptcha()
//         clearInterval(interval)
//       }
//     }, 300)
//   }
// })

const handleSubmit = async () => {
  if (!form.acceptedTerms) {
    error.value = 'Debes aceptar los términos y condiciones.'
    return
  }

  // if (!window.grecaptcha || recaptchaWidgetId.value === null) {
  //   error.value = 'reCAPTCHA aún no está listo.'
  //   return
  // }

  // const recaptchaToken = grecaptcha.getResponse(recaptchaWidgetId.value)
  // if (!recaptchaToken) {
  //   error.value = 'Completa el reCAPTCHA antes de continuar.'
  //   return
  // }
  
  isLoading.value = true
  try {
    const res = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form })
    })

    if (res.ok) {
      success.value = true
      error.value = ''
      // grecaptcha.reset(recaptchaWidgetId.value)

      // await emailjs.send(
      //   emailjsServiceId,
      //   emailjsTemplateId,
      //   {
      //     name: form.name,
      //     email: form.email,
      //     phone: form.phone,
      //     message: form.message
      //   },
      //   emailjsUserId
      // )

      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptedTerms: false
      })
    } else {
      error.value = 'Error al enviar. Intenta más tarde.'
    }
  } catch (e) {
    error.value = 'Error de red: ' + e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
/* Reset básico */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body, html, #app, .container {
  height: 100%;
  background-color: #f9fafb;
  color: #2d3748;
}

/* Contenedor principal */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #16a34a; /* verde */
  font-size: 1.75rem;
  font-weight: 700;
  user-select: none;
}

/* Botones */
.btn {
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  user-select: none;
}

.btn-primary {
  background-color: #16a34a;
  color: #fff;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  box-shadow: 0 3px 6px rgba(22, 163, 74, 0.4);
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #15803d;
  outline: none;
  box-shadow: 0 5px 12px rgba(21, 128, 61, 0.6);
}

.btn-large {
  font-size: 1.25rem;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
}

.btn-submit {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
}

/* Sección principal hero */
.hero {
  max-width: 720px;
  margin: 3rem auto 5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(to bottom, #d1fae5, #ffffff);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.15);
  text-align: center;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-text {
  font-size: 1.125rem;
  color: #374151;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Features */
.features {
  max-width: 1080px;
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature {
  background: #fff;
  padding: 1.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  flex: 1 1 280px;
  min-width: 280px;
  transition: box-shadow 0.3s ease;
}

.feature:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

/* Contact section */
.contact-section {
  background: #fff;
  max-width: 480px;
  margin: 0 auto 3rem;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contact-section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  user-select: none;
}

.contact-section p {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

/* Formulario */
.contact-form label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-align: left;
  color: #374151;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #111827;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: inherit;
  resize: none;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #9ca3af;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #16a34a;
  outline: none;
  box-shadow: 0 0 6px 2px rgba(22, 163, 74, 0.3);
}

/* Términos */
.terms {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  user-select: none;
}

.terms input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #16a34a;
}

.link-button {
  background: none;
  border: none;
  padding: 0;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.link-button:hover,
.link-button:focus {
  color: #1d4ed8;
  outline: none;
}

/* Mensajes */
.message {
  font-weight: 700;
  margin-top: 1rem;
  user-select: none;
}

.message.success {
  color: #16a34a;
}

.message.error {
  color: #dc2626;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}

.modal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  user-select: none;
}

.modal p {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.btn-close {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  user-select: none;
}

.btn-close:hover,
.btn-close:focus {
  background-color: #d1d5db;
  outline: none;
}

/* Footer */
footer {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 1rem 0;
  user-select: none;
}
</style>