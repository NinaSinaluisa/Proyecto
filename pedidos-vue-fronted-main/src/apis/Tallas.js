import Api from '@/apis/Api';  // Asegúrate de que esta ruta esté correcta.
import Csrf from './Csrf';      // Asegúrate de que esta ruta esté correcta.

const Tallas = {
  async fetchTallas() {
    try {
      // await Csrf.getCookie(); // Validamos el token CSRF

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get('admin/tallas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las Tallas:', error);
      throw error;
    }
  },

  async createTallas(categoryData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.post(
        'admin/tallas',
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
      console.error('Error al crear la categoría:', error);
      throw error;
    }
  },

  async updateTallas(categoryId, updatedData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.put(
        `admin/tallas/${categoryId}`,
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
      console.error('Error al actualizar la categoría:', error);
      throw error;
    }
  },

  async deleteTallas(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.delete(`admin/tallas/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar la talla:', error);
      throw error;
    }
  },

  async getTallasId(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get(`admin/tallas/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener la categoría por ID:', error);
      throw error;
    }
  },
};

export default Tallas;
