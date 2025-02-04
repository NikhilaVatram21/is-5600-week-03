const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;


const chatEmitter = new EventEmitter();


app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/chat.html'));
});


app.get('/json', (req, res) => {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
});


app.get('/echo', (req, res) => {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join('')
    });
});


app.get('/chat', (req, res) => {
    const { message } = req.query;
    chatEmitter.emit('message', message);
    res.end();
});


app.get('/sse', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const onMessage = message => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);

    res.on('close', () => {
        chatEmitter.off('message', onMessage);
    });
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
