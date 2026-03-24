import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ecom-snapbite.onrender.com',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshRes = await axios.post(
          'https://ecom-snapbite.onrender.com/api/auth/refresh',
          {},
          { withCredentials: true }
        )

        const newAccessToken = refreshRes.data.accessToken
        const newRole = refreshRes.data.role

        localStorage.setItem('accessToken', newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('role')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api