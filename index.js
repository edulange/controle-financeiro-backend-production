const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware');
const despesaRouter = require('./routes/despesas');
const usersRouter = require('./routes/users')

const app = express();

// Middleware
app.use(cors());
app.use(requestLogger); // Adicione o middleware de logger aqui
app.use(express.json());
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('Conectado ao MongoDB'); // Use o logger para registrar informações
  })
  .catch((err) => {
    logger.error('Erro ao conectar ao MongoDB:', err); // Use o logger para registrar erros
  });

// Rota padrão
app.get('/', (req, res) => {
  res.send('Bem-vindo à minha aplicação com MongoDB!');
});

// Rotas
app.use('/api/despesas', despesaRouter);
app.use('/api/users', usersRouter)

// Middlewares de erro
app.use(unknownEndpoint);
app.use(errorHandler);



app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
