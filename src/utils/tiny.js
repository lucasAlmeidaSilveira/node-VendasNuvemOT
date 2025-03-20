import axios from "axios"
import { config } from "../config/env.js"

// Helper para realizar requisições à API Tiny
const tinyApiRequest = async (endpoint, params) => {
	const response = await axios.get(`${config.tinyApiBaseUrl}/${endpoint}`, {
		params: { ...params, token: config.tinyApiToken, formato: "json" }
	})
	return response.data.retorno
}

export const getOrderDetails = async (orderId) => {
	const { pedido } = await tinyApiRequest("pedido.obter.php", { id: orderId })
	return pedido
}

export const getProductDetails = async (productId) => {
	const { produto } = await tinyApiRequest("produto.obter.php", { id: productId })
	return produto
}
