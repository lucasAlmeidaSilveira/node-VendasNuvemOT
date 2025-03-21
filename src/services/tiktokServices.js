/* eslint-disable camelcase */
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const appId = process.env.TIKTOK_CLIENT_APP_ID
const appSecret = process.env.TIKTOK_CLIENT_SECRET
const redirectUri = process.env.TIKTOK_REDIRECT_URI
const authCode = process.env.TIKTOK_AUTH_CODE
const advertiserId = process.env.TIKTOK_ADVERTISER_ID
const adAccountIdOutlet = process.env.TIKTOK_AD_ACCOUNT_ID_OUTLET


export const fetchTiktokAuth = async () => {
	try {
		const response = await axios.post("https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/", {
			app_id: appId,
			secret: appSecret,
			auth_code: authCode,
			grant_type: "authorization_code"
		})

		if (response.data.access_token) {
			return redirectUri + "?success=true&token=" + response.data.access_token
		}

	} catch (error) {
		console.error("Error getting TikTok access token:", error)
		return redirectUri + "?success=false&error=" + error.message
	}
}

export const fetchTiktokAds = async (store, createdAtMin, createdAtMax) => {
	let accessToken
	if (store === "outlet") {
		accessToken = process.env.TIKTOK_ACCESS_TOKEN_OT
	} if (store === "artepropria") {
		accessToken = process.env.TIKTOK_ACCESS_TOKEN
	}

	try {
		const response = await axios.get("https://business-api.tiktok.com/open_api/v1.3/campaign/get/", {
			headers: {
				"Access-Token": accessToken // Token de acesso
			},
			params: {
				advertiser_id: advertiserId, // ID do anunciante (obrigatório)
				fields: ["campaign_id","campaign_name","budget","operation_status"], // Campos desejados
				filter: JSON.stringify({
					creation_filter_start_date: createdAtMin, // Filtro de data mínima (opcional)
					creation_filter_end_date: createdAtMax // Filtro de data máxima (	opcional)
				})
			}
		})
		const dataTiktok = response.data
		if (dataTiktok.data && dataTiktok.data.list) {
			const adsTiktok = dataTiktok.data.list.map((ads)=>({
				budget:ads.budget
			}))

			const insightsArray = await Promise.all(adsTiktok)
			let totalBudget = 0

			insightsArray.forEach(
				({budget}) => (
					totalBudget += budget
				)
			)
			// Retorna os valores formatados com `toFixed(2)`
			const result = [{
				totalCost: {
					all: parseFloat(totalBudget.toFixed(2))
				}
			}]
		
			return result
		} else {
			throw new Error("Nenhum dado de campanha encontrado na resposta.")
		}
	} catch (error) {
		console.error("Erro ao buscar dados do ADS:", error.response ? error.response.data : error.message)
		return error.message
	}
}
