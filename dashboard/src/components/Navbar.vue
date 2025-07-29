<template>
  <nav class="navbar">
    <div class="navbar-title">CRM</div>
    <div class="navbar-actions">
      <button @click="$emit('logout')" class="btn-logout">
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar principal */
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Título del CRM */
.navbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

/* Contenedor de acciones */
.navbar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Botón de cerrar sesión */
.btn-logout {
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
}
</style>
