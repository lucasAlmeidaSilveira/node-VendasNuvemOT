/* eslint-disable camelcase */
import axios from "axios"
import { config } from "../config/env.js"
import { logWebhook } from "./logger.js"

// Helper para realizar requisições à API Tiny
const tinyApiRequest = async (endpoint, params) => {
	const makeRequest = async (token) => {
		const response = await axios.get(`${config.tinyApiBaseUrl}/${endpoint}`, {
			params: { ...params, token, formato: "json" }
		})
		return response.data.retorno
	}

	try {
		// Tenta primeiro com o token principal
		const response = await makeRequest(config.tinyApiToken)
		if (response.status !== "Erro") {
			return response
		}

		// Se falhar, tenta com o token alternativo
		return await makeRequest(config.tinyApiTokenArteIntegrada)

	} catch (error) {
		throw new Error(`Erro na requisição à API Tiny: ${error.message}`)
	}
}

export const getOrderDetails = async (orderId) => {
	const { pedido } = await tinyApiRequest("pedido.obter.php", { id: orderId })
	if(!pedido) {
		logWebhook(`Erro ao obter detalhes do pedido ${orderId} na API Tiny. Aguardando 60 segundos para tentar novamente.`)
		await new Promise((resolve) => setTimeout(resolve, 60000))
		const { pedido: retryPedido } = await tinyApiRequest("pedido.obter.php", { id: orderId })
		return retryPedido
	}
	return pedido
}

export const getProductDetails = async (productId) => {
	const { produto } = await tinyApiRequest("produto.obter.php", { id: productId })
	return produto
}

// Helper para realizar requisições à API Tiny
const tinyApiRequestES = async (endpoint, params) => {
	try {
		const response = await axios.get(`${config.tinyApiBaseUrl}/${endpoint}`, {
			params: { ...params, token: config.tinyApiTokenArteIntegradaES, formato: "json" }
		})
		return response.data.retorno

	} catch (error) {
		throw new Error(`Erro na requisição à API Tiny: ${error.message}`)
	}
}

export const getOrderDetailsES = async (orderId) => {
	const { pedido } = await tinyApiRequestES("pedido.obter.php", { id: orderId })
	if(!pedido) {
		logWebhook(`Erro ao obter detalhes do pedido ${orderId} na API Tiny. Aguardando 60 segundos para tentar novamente.`)
		await new Promise((resolve) => setTimeout(resolve, 60000))
		const { pedido: retryPedido } = await tinyApiRequestES("pedido.obter.php", { id: orderId })
		return retryPedido
	}
	return pedido
}

export const getProductDetailsES = async (productId) => {
	const { produto } = await tinyApiRequestES("produto.obter.php", { id: productId })
	return produto
}