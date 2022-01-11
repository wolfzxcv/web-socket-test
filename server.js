const websocket = require('ws');

const wss = new websocket.Server({ port: 9500 });

wss.on('connection', (ws) => {
  // ws parameter here means a single connection.
  console.log('New client connected!!');

  // Send client this message every 3 seconds
  const sendMessage = setInterval(() => {
    const date = new Date();
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const lang = 'zh-CN';
    const output = date.toLocaleDateString(lang, options);
    ws.send(output);
  }, 3000);

  ws.on('message', (data) => {
    console.log(`A client said: ${data.toString()}`);

    // All clients who are connecting
    let clients = wss.clients;

    // Loop these clients, send message to every client
    clients.forEach((client) => {
      client.send(data);
    });
  });

  ws.on('close', () => {
    // Clear interval when disconnecting.
    clearInterval(sendMessage);
    console.log('Client has disconnected!');
  });
});
