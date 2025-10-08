import axios from 'axios';

// Crée une instance d'axios avec une configuration de base.
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",  // ton backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log("✅ Token ajouté:", token);
    } else {
      console.warn("⚠️ Aucun token trouvé dans localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
