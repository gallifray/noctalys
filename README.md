# Noctalys
![](https://i.imgur.com/YosffCI.png)

Noctalys is a Javascript module to run a React app on an Express server, allowing you to run both front-end and back-end environments on a unique server.

## Basic example
```javascript
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const noctalys = require('noctalys');


noctalys.init({
    app: app,
    server_dir: __dirname,
    app_dir: 'build',
    entry_point: 'index.html',
    exclude: ['service-worker.js'],    // OPTIONAL
    logger: true                       // OPTIONAL
});

app.get('/api', (req, res) => {
    res.json({
        foo: "Welcome to the API!"
    })
})

noctalys.listen();
app.listen(3000)

```
