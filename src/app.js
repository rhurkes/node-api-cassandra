const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const logger = require('./utility/logger');
const productsRoutes = require('./routes/productsRoutes');
const config = require('./config.json');

const app = express();
const jsonParser = bodyParser.json();

// Set security-related headers
app.use(helmet());

// Configure routes
app.use('/products', jsonParser, productsRoutes);

// Generic error handling
app.use((err, req, res, next) => {
  if (err) {
    logger.warn('Generic error', err);
    res.status(500).json({ message: 'Internal server error', status: 500 });
  } else {
    next();
  }
});

app.listen(config.serverPort, () => {
  logger.info(`server started on port ${config.serverPort}`);
});
