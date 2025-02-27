const WebSocket = require('ws');

const PORT = process.env.PORT; // Railway автоматично видає PORT
const server = new WebSocket.Server({ port: PORT });
var lastMessage = "";

server.on('connection', (socket) => {
    console.log('Новий клієнт підключився');

    socket.on('message', (message) => {
        const textMessage = message.toString();

        if(lastMessage == textMessage)
        {
            return;
        }
        
        console.log('Отримано:', textMessage);
        lastMessage = textMessage;

        // Відправка всім клієнтам, крім відправника
        server.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });
    });

    socket.on('close', () => {
        console.log('Користувач відключився');
    });
});

console.log(`WebSocket-сервер запущено на порту ${PORT}`);
