
import { defineStore } from 'pinia'
import User from '@/apis/User'

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: localStorage.getItem('auth') || null,
    user: null,
  }),

  actions: {
    async login(form) {
      try {
        const response = await User.login(form)
        if (response.data && response.data.token) {
          this.token = response.data.token
          localStorage.setItem('auth', this.token)
          this.authenticated = true
          this.user = response.data.user || null
        }
      } catch (error) {
        console.error('Error en login:', error)
        throw error
      }
    },

    async logout() {
      try {
        await User.logout()
      } catch (error) {
        console.warn('Error en logout del servidor. Continuando con logout local.')
      } finally {
        this.authenticated = false
        this.token = null
        this.user = null
        localStorage.removeItem('auth')
      }
    },

    async syncAuthentication() {
      const token = localStorage.getItem('auth')
      if (!token) {
        this.authenticated = false
        this.token = null
        this.user = null
        return
      }

      try {
        // Si tienes el método getProfile implementado:
        if (typeof User.getProfile === 'function') {
          const response = await User.getProfile()
          if (response.data) {
            this.token = token
            this.authenticated = true
            this.user = response.data
          }
        } else {
          // Si no tienes getProfile, mantén la sesión basada en el token
          this.token = token
          this.authenticated = true
          // Mantener los datos del usuario si ya existen
          if (!this.user) {
            this.user = {} // O establece los datos mínimos necesarios
          }
        }
      } catch (error) {
        // Manejo más específico del error
        if (error.response && error.response.status === 401) {
          // Token inválido o expirado
          this.logout()
        } else {
          // Otros errores: mantener la sesión si ya existe
          console.warn('Error al sincronizar la autenticación:', error)
          if (this.token) {
            this.authenticated = true
          }
        }
      }
    },

    checkAuth() {
      const token = localStorage.getItem('auth')
      if (token) {
        this.token = token
        this.authenticated = true
        this.syncAuthentication()
      } else {
        this.authenticated = false
        this.token = null
        this.user = null
      }
    },
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['authenticated', 'token', 'user'],
  },
})