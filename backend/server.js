const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Добавляем задержку для имитации обработки запроса
const randomDelay = () => Math.floor(Math.random() * 1000) + 100;

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send(`
      <h1>Hello from Node.js backend!</h1>
      <p>Host: ${os.hostname()}</p>
      <p>Port: ${PORT}</p>
      <p>Instance: ${process.env.INSTANCE_ID || 1}</p>
      <p>Date: ${new Date()}</p>
    `);
  }, randomDelay());
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    instance: process.env.INSTANCE_ID || 1
  });
});

app.listen(PORT, () => {
  console.log(`Server instance ${process.env.INSTANCE_ID || 1} running on port ${PORT}`);
});