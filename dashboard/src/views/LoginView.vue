<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Iniciar sesión</h2>

      <form @submit.prevent="login" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="form-input"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              required
              class="form-input password-input"
              placeholder="Tu contraseña"
            />
            <div class="show-password">
              <input
                type="checkbox"
                id="showPwd"
                v-model="showPassword"
              />
              <label for="showPwd">Ver</label>
            </div>
          </div>
        </div>

        <!-- Botón -->
        <button type="submit" class="btn-submit">
          Entrar
        </button>
      </form>

      <!-- <div class="go-back">
        <a href="/">← Volver al inicio</a>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    router.push('/leads')
  } catch (ex) {
    alert('Credenciales inválidas')
  }
}
</script>

<style scoped>
/* Layout general */
.login-container {
  min-height: 100vh;
  background-color: #d1fae5; /* verde claro */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-box {
  background-color: #fff;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #bbf7d0; /* borde verde claro */
}

/* Título */
.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #15803d; /* verde-700 */
}

/* Formularios */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #374151;
}

.form-input {
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.3);
}

/* Password */
.password-wrapper {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.show-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #4b5563;
}

/* Botón */
.btn-submit {
  background-color: #16a34a;
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #15803d;
}

/* Link */
.go-back {
  margin-top: 1rem;
  text-align: center;
}

.go-back a {
  font-size: 0.875rem;
  color: #15803d;
  text-decoration: none;
}

.go-back a:hover {
  text-decoration: underline;
}
</style>
