const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();
const instances = [
  { host: 'backend1', port: 3000 },
  { host: 'backend2', port: 3000 },
  { host: 'backend3', port: 3000 }
];

// Алгоритм балансировки - Round Robin
let currentInstance = 0;
function getNextInstance() {
  const instance = instances[currentInstance];
  currentInstance = (currentInstance + 1) % instances.length;
  return instance;
}

// Health check
async function checkHealth(instance) {
  try {
    const res = await fetch(`http://${instance.host}:${instance.port}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// Создаем сервер балансировки
const server = http.createServer(async (req, res) => {
  let healthyInstance;
  let attempts = 0;
  
  // Ищем работающий экземпляр
  while (attempts < instances.length * 2) {
    const instance = getNextInstance();
    const isHealthy = await checkHealth(instance);
    
    if (isHealthy) {
      healthyInstance = instance;
      break;
    }
    
    attempts++;
  }

  if (healthyInstance) {
    console.log(`Routing to ${healthyInstance.host}:${healthyInstance.port}`);
    proxy.web(req, res, { target: `http://${healthyInstance.host}:${healthyInstance.port}` });
  } else {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('All backend instances are down');
  }
});

// Обработка ошибок
proxy.on('error', (err, req, res) => {
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: ' + err.message);
});

const PORT = 80;
server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});