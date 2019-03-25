const path = require('path');
const fs = require('fs');

var express;
var noct_conf;

exports.init = (app, noctalysConf) => {
    express = app;
    noct_conf = noctalysConf;

    conf.staticFiles = listFiles(conf.react_dir);
    conf.staticDirs = listDirs(conf.react_dir);

    conf.staticDirs.forEach((dir) => express.get(`/${dir}/*`, serveStaticDir(`/${conf.react_dir}/${dir}/`)))
    conf.staticFiles.forEach((file) => express.get(`/${file}`, serveStaticFile(`/${conf.react_dir}/${file}`)))
}

exports.defaultRoute = () => {
    express.get('*', (req, res) => {
        res.sendFile(path.join(noct_conf.root_dir + `/${conf.react_dir}/index.html`))
    });
}

var serveStaticDir = (dir) => {
    return (req, res) => res.sendFile(path.join(noct_conf.root_dir, dir, req.params['0']), (err) => {
        if (err)
            throw err;
    })
}

var serveStaticFile = (file) => {
    return (req, res) => res.sendFile(path.join(noct_conf.root_dir, file), (err) => {
        if (err)
            throw err;
    });
}

var listDirs = (react_dir) => {
    var res = []
    fs.readdirSync(react_dir).forEach(function (file) {
        if (fs.lstatSync(path.join(react_dir, file)).isDirectory()) {
            res.push(file)
        }
    });
    return res;
}

var listFiles = (react_dir) => {
    var res = []
    fs.readdirSync(react_dir).forEach(function (file) {
        if (fs.lstatSync(path.join(react_dir, file)).isFile()) {
            res.push(file)
        }
    });
    return res;
}

const conf = {
    react_dir: 'client'
}

