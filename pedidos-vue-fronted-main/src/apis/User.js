import Api from '@/apis/Api'
import Csrf from '../apis/Csrf';


const User = {
  async register(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('/auth/register', form); 
      return response;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  },
  async login(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('/auth/login', form); 
      return response;
    } catch (error) {
      console.error('Error al iniciar session:', error);
      throw error;
    }
  },
  async OlvideContrasena(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('auth/forgot-password', form); 
      return response;
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      throw error;
    }
  },
  async RestablecerContrasena(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('auth/reset-password', form); 
      return response;
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      throw error;
    }
  },
  
  async logout() {
    try {
      await Csrf.getCookie();  // Obtenemos y validamos el token CSRF
  
      const token = localStorage.getItem('auth');  // Obtenemos el token de autenticación
      if (!token) {
        throw new Error('No estás autenticado');
      }
      
      
      // Realizamos la solicitud GET para cerrar sesión con el token CSRF
      const response = await Api.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Eliminar el token después de logout
      if (response.data) {
        localStorage.removeItem('auth');
      }
  
      return response;
  
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },
  async fetchUsuarios() {
    try {
      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get('admin/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.users;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  

  async updateUsuario(userId, updatedData) {
    try {
      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.put(
        `admin/usuarios/${userId}`,
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
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  },

  async deleteUsuario(userId) {
    try {
      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.delete(`admin/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  },

  async getUsuarioById(userId) {
    try {
      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }

      const response = await Api.get(`admin/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  },
  async UsuarioActual() {
    try {
      // Recuperar el token del localStorage
      const token = localStorage.getItem('auth');
      if (!token) {
        throw new Error('Token de autenticación no disponible');
      }
      const response = await Api.get('user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error; 
    }
  },

  getProfile() {
    const token = localStorage.getItem('auth')
    if (!token) return Promise.reject('No token found')

    return axios.get('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

export default User;