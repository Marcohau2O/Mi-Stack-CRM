require('dotenv').config()

const express = require('express')
const cors = require('cors')
const axios = require('axios')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
const pool = require('./db');
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
const JWT_SECRET = process.env.JWT_SECRET

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',') || []

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origen no permitido por CORS'))
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
    res.json({ token })
  } catch (err) {
    console.error('🔥 Error en /api/login:', err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)

  try {
    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashed]
    )
    res.status(201).json({ message: 'Usuario creado correctamente' })
  } catch (err) {
    console.error('Error al registrar usuario:', err)
    res.status(500).json({ message: 'Error al registrar usuario' })
  }
})


app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body

  // Validar reCAPTCHA
  // try {
  //   const verify = await axios.post(
  //     'https://www.google.com/recaptcha/api/siteverify',
  //     new URLSearchParams({
  //       secret: RECAPTCHA_SECRET_KEY,
  //       response: recaptchaToken
  //     })
  //   )

  //   if (!verify.data.success) {
  //     return res.status(400).json({ error: 'Error de reCAPTCHA' })
  //   }
  // } catch (err) {
  //   return res.status(500).json({ error: 'Error validando reCAPTCHA' })
  // }

  const cleanName = validator.escape(validator.trim(name || ''))
  const cleanEmail = validator.normalizeEmail(email || '')
  const cleanPhone = validator.whitelist(phone || '', '0-9+ -()')
  const cleanMessage = validator.escape(validator.trim(message || ''))

  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Correo inválido' })
  }

  // Guardar
  await pool.query(
    `INSERT INTO contact_requests (name, email, phone, message) VALUES ($1, $2, $3, $4)`,
    [cleanName, cleanEmail, cleanPhone, cleanMessage]
  )

  res.status(200).json({ message: 'Enviado correctamente' })
})

app.get('/api/leads', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_requests ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener leads' })
  }
})

app.patch('/api/leads/:id', auth, (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['nuevo', 'contactado', 'descartado']

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Estado inválido' })
  }

  pool.query('UPDATE contact_requests SET status = $1 WHERE id = $2', [status, id])
  res.json({ message: 'Estado actualizado' })
})

// 🚀 Iniciar servidor
app.listen(4000, () => {
  console.log('API escuchando en http://localhost:4000')
})
