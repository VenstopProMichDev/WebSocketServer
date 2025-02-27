const WebSocket = require('ws');

const PORT = process.env.PORT || 3000; // Railway автоматично видає PORT, а локально 3000
const server = new WebSocket.Server({ port: PORT });

let rooms = {}; // Об'єкт для зберігання кімнат

server.on('connection', (socket) => {
    console.log('Новий клієнт підключився');

    let assignedRoom = null;

    // Знайти вільну кімнату або створити нову
    for (let roomId in rooms) {
        if (rooms[roomId].length < 2) {
            assignedRoom = roomId;
            rooms[roomId].push(socket);
            break;
        }
    }

    if (!assignedRoom) {
        assignedRoom = `room-${Object.keys(rooms).length + 1}`;
        rooms[assignedRoom] = [socket];
    }

    console.log(`Клієнт приєднався до ${assignedRoom}`);

    socket.on('message', (message) => {
        console.log(`Отримано від ${assignedRoom}:`, message.toString());

        // Надсилати повідомлення тільки іншим клієнтам у кімнаті
        rooms[assignedRoom].forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    socket.on('close', () => {
        console.log(`Користувач покинув ${assignedRoom}`);

        // Видалити клієнта з кімнати
        rooms[assignedRoom] = rooms[assignedRoom].filter(client => client !== socket);

        // Видалити кімнату, якщо вона порожня
        if (rooms[assignedRoom].length === 0) {
            delete rooms[assignedRoom];
            console.log(`Кімната ${assignedRoom} закрита`);
        }
    });
});

console.log(`WebSocket-сервер запущено на порту ${PORT}`);
