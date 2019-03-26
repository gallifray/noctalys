const path = require('path');
const fs = require('fs');
const colors = require('colors')

var express;
var noct_conf;

function mylog() {
    if (noct_conf.logger) {
        for (var i = 0; i < arguments.length; i++) {
            process.stdout.write(arguments[i] + " ");
        }
        console.log()
    }
}

var checkParams = () => {
    if (!fs.existsSync(path.join(noct_conf.server_dir, noct_conf.app_dir))) {
        console.log(`[noctalys] ❌  Specified application path (${path.join(noct_conf.server_dir, noct_conf.app_dir)}) does not exist. Exiting...`.red.bold)
        process.exit(1)
    }

    if (!fs.existsSync(path.join(noct_conf.server_dir, noct_conf.app_dir, noct_conf.entry_point))) {
        console.log(`[noctalys] ❌  Specified application entry point (${path.join(noct_conf.server_dir, noct_conf.app_dir, noct_conf.entry_point)}) does not exist. Exiting...`.red.bold)
        process.exit(1)
    }
}

exports.init = (noctalysConf) => {
    express = noctalysConf.app;
    noct_conf = noctalysConf;
    mylog("[noctalys]    Starting...".bold.cyan)
    mylog("[noctalys] 🛠  Server root path is".cyan, noct_conf.server_dir.yellow)
    mylog("[noctalys] 📂  Application path is".cyan, path.join(noct_conf.server_dir, noct_conf.app_dir).yellow)
    mylog("[noctalys] 📄  Application entry point is".cyan, path.join(noct_conf.server_dir, noct_conf.app_dir, noct_conf.entry_point).yellow)

    checkParams();


    noct_conf.staticFiles = listFiles(noct_conf.app_dir);
    noct_conf.staticDirs = listDirs(noct_conf.app_dir);

}

exports.run = () => {
    noct_conf.staticDirs.forEach((dir) => express.get(`/${dir}/*`, serveStaticDir(`/${noct_conf.app_dir}/${dir}/`)))
    noct_conf.staticFiles.forEach((file) => express.get(`/${file}`, serveStaticFile(`/${noct_conf.app_dir}/${file}`)))
    mylog(`[noctalys] ✅  Noctalys is running !`.green.bold)
}

exports.defaultRoute = () => {
    express.get('*', (req, res) => {
        res.sendFile(path.join(noct_conf.server_dir + `/${noct_conf.app_dir}/${noct_conf.entry_point}`))
    });
}

var serveStaticDir = (dir) => {
    return (req, res) => res.sendFile(path.join(noct_conf.server_dir, dir, req.params['0']), (err) => {
        if (err)
            throw err;
    })
}

var serveStaticFile = (file) => {
    return (req, res) => res.sendFile(path.join(noct_conf.server_dir, file), (err) => {
        if (err)
            throw err;
    });
}

var listDirs = (app_dir) => {
    var res = []
    fs.readdirSync(app_dir).forEach(function (file) {
        if (fs.lstatSync(path.join(app_dir, file)).isDirectory()) {
            res.push(file)
        }
    });
    return res;
}

var listFiles = (app_dir) => {
    var res = []
    fs.readdirSync(app_dir).forEach(function (file) {
        if (fs.lstatSync(path.join(app_dir, file)).isFile()) {
            res.push(file)
        }
    });
    return res;
}
