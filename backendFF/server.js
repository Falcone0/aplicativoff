const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote cors

const app = express();
const PORT = 5000;
const HOST = '192.168.15.187'; // Define o host como todas as interfaces de rede

// Middleware para processar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(cors());


// Configuração manual dos cabeçalhos CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});



// Array para armazenar os pedidos (simulação de um banco de dados em memória)
let pedidos = [];

// Rota para listar todos os pedidos
app.get('/api/pedidos', (req, res) => {
  res.status(200).json(pedidos);
});

// Rota para adicionar um novo pedido
app.post('/api/pedidos', (req, res) => {
  const novoPedido = req.body;
  pedidos.push(novoPedido);
  res.status(201).json({ message: 'Pedido criado com sucesso', pedido: novoPedido });
});

// Rota para obter o número total de pedidos
app.get('/api/pedidos/count', (req, res) => {
  const totalPedidos = pedidos.length;
  res.status(200).json({ totalPedidos });
});

// Rota para obter detalhes de um pedido específico pelo ID
app.get('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;
  const pedido = pedidos.find(pedido => pedido.id === pedidoId);

  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  res.status(200).json(pedido);
});

// Rota para atualizar os detalhes de um pedido existente pelo ID
app.put('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;
  const novoDadosPedido = req.body;
  const index = pedidos.findIndex(pedido => pedido.id === pedidoId);

  if (index === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  pedidos[index] = { ...pedidos[index], ...novoDadosPedido };
  res.status(200).json({ message: 'Pedido atualizado com sucesso', pedido: pedidos[index] });
});

// Rota para excluir um pedido existente pelo ID
app.delete('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;
  const index = pedidos.findIndex(pedido => pedido.id === pedidoId);

  if (index === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  const pedidoRemovido = pedidos.splice(index, 1);
  res.status(200).json({ message: 'Pedido removido com sucesso', pedido: pedidoRemovido });
});

// Rota para excluir todos os pedidos
app.delete('/api/pedidos', (req, res) => {
  // Limpar o array de pedidos
  pedidos = [];

  // Responder com uma mensagem de sucesso
  res.status(200).json({ message: 'Todos os pedidos foram removidos com sucesso' });
});

app.get('/', function(req, res, next) {
  res.send("Hello world");
});

// Inicializa o servidor e escuta na porta e host especificados
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}/`);
});
