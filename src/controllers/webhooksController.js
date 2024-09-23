export const createdOrderWebhook = async  (req, res) => {
  try {
    const { store_id, event, id } = req.body;
  
    console.log(`Evento: ${event} recebido para a loja ${store_id}, pedido ID: ${id}`);
    
    // Confirmação de recebimento do webhook
    res.sendStatus(200); // Nuvemshop espera um status 2XX para considerar o webhook processado
  } catch (error) {
    res.error(error);
  }
 
}