import Api from '@/apis/Api';  // Asegúrate de que esta ruta esté correcta.
import Csrf from './Csrf';      // Asegúrate de que esta ruta esté correcta.

const Colores = {
  async fetchColores() {
    try {
      // await Csrf.getCookie(); // Validamos el token CSRF

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get('admin/colores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los Colores:', error);
      throw error;
    }
  },

  async createColores(categoryData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.post(
        'admin/colores',
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data; // Devuelve la respuesta completa para detalles como ID generado
    } catch (error) {
      console.error('Error al crear el color:', error);
      throw error;
    }
  },

  async updateColores(categoryId, updatedData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.put(
        `admin/colores/${categoryId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al actualizar el color:', error);
      throw error;
    }
  },

  async deleteColores(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.delete(`admin/colores/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar el color:', error);
      throw error;
    }
  },

  async getColoresId(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get(`admin/colores/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener el color por ID:', error);
      throw error;
    }
  },
};

export default Colores;
