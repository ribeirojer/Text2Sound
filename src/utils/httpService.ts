import axios from "axios";
const serverApiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

// Crie uma instância do Axios
const axiosClient = axios.create({
	baseURL: serverApiUrl, // Altere para o URL da sua API
	//timeout: 10000, // Tempo limite da requisição em ms
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptadores de Request
axiosClient.interceptors.request.use(
	(config) => {
		// Adicione qualquer configuração adicional ou tokens de autenticação aqui
		const token = localStorage.getItem("token"); // Exemplo de token armazenado localmente
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Interceptadores de Response
axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Trate os erros de forma centralizada
		if (error.response) {
			const { status, data } = error.response;
			if (status === 401) {
				// Redirecionar para a página de login ou exibir mensagem de erro
				console.error("Unauthorized access - redirecting to login");
				// window.location.href = '/login';
			} else {
				console.error(`Error ${status}: ${data.message}`);
			}
		}
		return Promise.reject(error);
	},
);

export default axiosClient;