import express from "express"
import { getProducts } from "../controllers/productsController.js"
import { getOrders } from "../controllers/ordersController.js"
import { getCoupons } from "../controllers/couponsControllers.js"

const router = express.Router()

// Rota para buscar produtos
router.get("/products", getProducts)
router.get("/coupons", getCoupons)
router.get("/orders/", getOrders)
router.get("/orders/:store/:createdAtMin/:createdAtMax", getOrders)

export default router