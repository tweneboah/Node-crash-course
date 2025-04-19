const http = require('http');
const os = require('os');
const process = require('process');
const url = require('url');

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Format seconds to human-readable time
function formatTime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Info functions
const getCpuInfo = () => ({
  model: os.cpus()[0].model,
  cores: os.cpus().length,
  architecture: os.arch(),
  loadAvg: os.loadavg(),
});

const getMemoryInfo = () => ({
  total: formatBytes(os.totalmem()),
  free: formatBytes(os.freemem()),
  usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%',
});

const getOsInfo = () => ({
  platform: os.platform(),
  type: os.type(),
  release: os.release(),
  hostname: os.hostname(),
  uptime: formatTime(os.uptime()),
});

const getUserInfo = () => os.userInfo();

const getNetworkInfo = () => os.networkInterfaces();

const getProcessInfo = () => ({
  pid: process.pid,
  title: process.title,
  nodeVersion: process.version,
  uptime: formatTime(process.uptime()),
  cwd: process.cwd(),
  memoryUsage: {
    rss: formatBytes(process.memoryUsage().rss),
    heapTotal: formatBytes(process.memoryUsage().heapTotal),
    heapUsed: formatBytes(process.memoryUsage().heapUsed),
    external: formatBytes(process.memoryUsage().external),
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'Not set',
  },
});

// HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  if (parsedUrl.pathname === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      name: 'SysView – System Info API',
      description: 'Access system stats via simple JSON routes',
      routes: ['/cpu', '/memory', '/os', '/user', '/process', '/network']
    }));
  } else if (parsedUrl.pathname === '/cpu') {
    res.end(JSON.stringify(getCpuInfo(), null, 2));
  } else if (parsedUrl.pathname === '/memory') {
    res.end(JSON.stringify(getMemoryInfo(), null, 2));
  } else if (parsedUrl.pathname === '/os') {
    res.end(JSON.stringify(getOsInfo(), null, 2));
  } else if (parsedUrl.pathname === '/user') {
    res.end(JSON.stringify(getUserInfo(), null, 2));
  } else if (parsedUrl.pathname === '/process') {
    res.end(JSON.stringify(getProcessInfo(), null, 2));
  } else if (parsedUrl.pathname === '/network') {
    res.end(JSON.stringify(getNetworkInfo(), null, 2));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`SysView is running at http://localhost:${PORT}`);
});
