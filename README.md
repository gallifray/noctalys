# Noctalys
[![npm version](https://badge.fury.io/js/noctalys.svg)](https://badge.fury.io/js/noctalys)
### Basic example
```javascript
 const express = require('express');
 const noctalys = require('noctalys');

 const app = express();

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
 });

 noctalys.listen();
 app.listen(3000);
```

## Why Noctalys ?
In 2019, developping single-page applications is cool and easy.

But deploying such apps can be very annoying, especially if you need a back-end service, such as an Express server.

It often requires to run at least two servers, one for your back-end API (Express.js for instance), and one for your front-end app (React, Angular, etc.)

The point of **Noctalys** is to serve a static build of your single-page app on your Express server, while also allowing to add custom Express routes (like /api on the above example), which then allows you to create a backend API.

And all of this running on a single server port, and requiring minimal configuration.

**Noctalys** automatically redirects requests that do not belong to your API to the entry-point of your application, and **it works perfectly with React Router !**
<center>

More on my website:
[<img src="https://camo.githubusercontent.com/81b5458b507732586332451ed3fd507622b71901/68747470733a2f2f692e696d6775722e636f6d2f596f73666643492e706e67" width="300">](https://noctalys.gallifray.fr)
</center>

## Installation
Noctalys is a Node.js module available through the npm registry.

Installation is done using the npm install command:
```
 $  npm install noctalys
```


Or with Yarn:
```
 $  yarn add noctalys
```

Then simply import Noctalys with the following code:

```javascript
 const noctalys = require('noctalys')
```

## Usage
```javascript
 const express = require('express');
 const noctalys = require('noctalys');

 const app = express();

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
 });

 noctalys.listen();
 app.listen(3000);
```

Let's take a closer look at the above example.
In this example, we will consider that your application static build is in a folder called 'build'.


### Imports
After installing Express and Noctalys, you must import them in your server file:

```javascript
 const express = require('express');
 const noctalys = require('noctalys');
```

### Initialization
Once imported in your Express app, Noctalys is very easy to use, you only need to configure a few things :

You must first declare your Express app:
```javascript
 const app = express();
```
<br>

Then you must call Noctalys' initializer with some parameters in JSON format:
```javascript
 noctalys.init({
     app: app,
     server_dir: __dirname,
     app_dir: 'build',
     entry_point: 'index.html',
     exclude: ['service-worker.js'], // OPTIONAL
     logger: true // OPTIONAL
 });
```
<br>

Let's decompose these parameters gently:



|          | Description | Required |
| -------- | -------- | -------- |
| **app**     | The Express app object initialized before     | <center>:white_check_mark:</center>     |
| **server_dir**     | The root path of the Express server<br>(most likely the current folder, it is advised to use __dirname)     | <center>:white_check_mark:</center>     |
| **app_dir**     | The path of your app build folder, relative to the current folder     | <center>:white_check_mark:</center>     |
| **entry_point**     | The entry point file of your app, relative to the build folder specified before (most likely index.html)     | <center>:white_check_mark:</center>     |
| **exclude**     | An array of files or directories you don't want to be served, relative to the build folder     | <center>:x:</center>     |
| **logger**     | A boolean to enable Noctalys logs in the console.<br>Can be helpful to understand why things do not work.     | <center>:x:</center>     |

And that's almost it !
You just have to add two more lines in order to launch Noctalys with the Express server:
```javascript
 noctalys.listen();
 app.listen(3000);
```

Then just launch your server with
```
 $  node server.js
```

**<center>And voilà, your Express server is running, serving your app on http://localhost:3000/</center>**

## Adding custom routes
The whole point of Noctalys is to be able to add custom Express routes alongside your single-page app.

Nothing is more simple, just add them as you would do in a classic Express app:
**The only constraint is to add them after Noctalys' initialization and before Noctalys' listen command:**
```javascript
 const express = require('express');
 const noctalys = require('noctalys');
    
 const app = express();
    
 noctalys.init({
     app: app,
     server_dir: __dirname,
     app_dir: 'build',
     entry_point: 'index.html',
     exclude: ['service-worker.js'],    // OPTIONAL
     logger: true                       // OPTIONAL
 });


 //===== ADD CUSTOM ROUTES FROM HERE =====

 app.get('/api', (req, res) => {
     res.json({
         foo: "Welcome to the API!"
     })
 });

 //=============== TO HERE ===============
    

 noctalys.listen();
 app.listen(3000);
```
