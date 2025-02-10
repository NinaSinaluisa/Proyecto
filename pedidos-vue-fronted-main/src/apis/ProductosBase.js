import Api from '@/apis/Api';  // Asegúrate de que esta ruta esté correcta.
import Csrf from './Csrf';      // Asegúrate de que esta ruta esté correcta.

const ProductoBase = {
  async fetchCategories() {
    try {
      // await Csrf.getCookie(); // Validamos el token CSRF

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get('admin/productos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.post(
        'admin/productos',
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

  async updateCategory(categoryId, updatedData) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.put(
        `admin/productos/${categoryId}`,
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

  async deleteCategory(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.delete(`admin/productos/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      throw error;
    }
  },

  async getCategoryById(categoryId) {
    try {
      // await Csrf.getCookie();

      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get(`admin/productos/${categoryId}`, {
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

export default ProductoBase;
