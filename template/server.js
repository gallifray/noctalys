const express = require('express');
const app = express();
const noctalys = require('noctalys');


noctalys.init({
    app: app,
    server_dir: __dirname,
    app_dir: 'build',
    entry_point: 'index.html',
    exclude: ['service-worker.js', 'manifest.json'], // OPTIONAL
    logger: true // OPTIONAL
});

app.get('/api', (req, res) => {
    res.json({
        foo: "Welcome to the API!"
    })
});

noctalys.listen();
app.listen(3000);