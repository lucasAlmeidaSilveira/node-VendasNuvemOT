import { fetchOrderTiny } from "../services/orderTinyServices.js";

export const getOrderTiny = async (req, res) => {
  const { id } = req.params

  try {
    const order = await fetchOrderTiny(id)
    res.status(200).json(order);

  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
}