const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
var lastMessage = '';

server.on('connection', (socket) => {
    console.log('Новий клієнт підключився');

    socket.on('message', (message) => {
        const textMessage = message.toString();
        if(lastMessage == textMessage)
            return;
        console.log('Отримано:', textMessage);
        lastMessage = textMessage;

        // Пересилаємо отримане повідомлення ВСІМ клієнтам (окрім відправника)
        server.clients.forEach(client => {
            client.send(textMessage);
        });
    });

    socket.on('close', () => {
        console.log('Користувач відключився');
    });
});

console.log('Сервер WebSocket запущено на порту 8080');
