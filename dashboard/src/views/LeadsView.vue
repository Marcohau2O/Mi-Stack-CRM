<template>
  <div class="leads-page">
    <!-- Navbar -->
    <Navbar @logout="logout" />

    <!-- Contenido -->
    <div class="content">
      <h1 class="title">📋 Gestión de Leads</h1>

      <div class="leads-table-container">
        <table v-if="leads.length" class="leads-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in paginatedLeads" :key="lead.id">
              <td>{{ lead.name }}</td>
              <td>{{ lead.email }}</td>
              <td>{{ lead.phone }}</td>
              <td>{{ lead.message }}</td>
              <td class="status">{{ lead.status }}</td>
              <td>
                <select v-model="lead.status" @change="updateStatus(lead)" class="select-status">
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="descartado">Descartado</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="no-leads">No hay leads disponibles por el momento.</p>

        <div v-if="totalPages > 1" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const leads = ref([])
const router = useRouter()
const currentPage = ref(1)
const perPage = ref(5)

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return leads.value.slice(start, start + perPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(leads.value.length / perPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const fetchLeads = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + '/leads', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
    leads.value = res.data
  } catch (e) {
    router.push('/')
  }
}

const updateStatus = async (lead) => {
  try {
    await axios.patch(`${import.meta.env.VITE_API_URL}/leads/${lead.id}`, {
      status: lead.status
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
  } catch (e) {
    console.error('Error al actualizar el estado', e)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

onMounted(fetchLeads)
</script>

<style scoped>
/* Página general */
.leads-page {
  min-height: 100vh;
  background-color: #d1fae5;
  color: #1f2937;
}

/* Contenedor */
.content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Título */
.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #15803d;
}

/* Tabla */
.leads-table-container {
  background-color: #fff;
  border: 1px solid #bbf7d0;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.leads-table thead {
  background-color: #16a34a;
  color: #fff;
  text-align: left;
}

.leads-table th,
.leads-table td {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.leads-table tr:hover {
  background-color: #f0fdf4;
}

.status {
  font-weight: 600;
  text-transform: capitalize;
  color: #15803d;
}

/* Select */
.select-status {
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #a7f3d0;
  border-radius: 0.375rem;
  background-color: #f0fdf4;
  outline: none;
}

.select-status:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.3);
}

/* Sin leads */
.no-leads {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
}

.btn-page {
  padding: 0.5rem 1rem;
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-page:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-page:hover:enabled {
  background-color: #15803d;
}
</style>
