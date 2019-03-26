const path = require('path');
const fs = require('fs');
const colors = require('colors')

var app;
var nc;

function logger() {
    if (nc.logger) {
        for (var i = 0; i < arguments.length; i++) {
            process.stdout.write(arguments[i] + " ");
        }
        console.log()
    }
}

var checkParams = () => {
    if (!fs.existsSync(path.join(nc.server_dir, nc.app_dir))) {
        console.log(`[noctalys] ❌  Specified application path (${path.join(nc.server_dir, nc.app_dir)}) does not exist. Exiting...`.red.bold)
        process.exit(1)
    }

    if (!fs.existsSync(path.join(nc.server_dir, nc.app_dir, nc.entry_point))) {
        console.log(`[noctalys] ❌  Specified application entry point (${path.join(nc.server_dir, nc.app_dir, nc.entry_point)}) does not exist. Exiting...`.red.bold)
        process.exit(1)
    }
}

exports.init = (noctalysConf) => {
    app = noctalysConf.app;
    nc = noctalysConf;
    if (nc.exclude == null)
        nc.exclude = []

    filter_excludes(nc.exclude)

    logger("[noctalys]    Starting...".bold.cyan)
    logger("[noctalys] 🛠  Server root path is".cyan, nc.server_dir.yellow)
    logger("[noctalys] 📂  Application path is".cyan, path.join(nc.server_dir, nc.app_dir).yellow)
    logger("[noctalys] 🖥  Application entry point is".cyan, path.join(nc.server_dir, nc.app_dir, nc.entry_point).yellow)
    if (nc.exclude.length > 0)
        logger("[noctalys] ⚠️  Excluded path:".cyan)
    nc.exclude_dirs.concat(nc.exclude_files).forEach(exclude => {
        logger("[noctalys]      ".cyan, `- ${exclude}`.yellow)
    });

    checkParams();

}

exports.listen = () => {
    logger(`[noctalys] ✅  Noctalys is listening !`.green)
    app.get('*', (req, res) => {
        var excluded = isExcluded(path.join(req.params['0']));

        if (!excluded && fs.existsSync(path.join(nc.server_dir, nc.app_dir, req.params['0']))) {
            res.sendFile(path.join(nc.server_dir, nc.app_dir, req.params['0']), (err) => {
                if (err)
                    res.sendFile(path.join(nc.server_dir + `/${nc.app_dir}/${nc.entry_point}`))
            })
        }
        else
            res.sendFile(path.join(nc.server_dir + `/${nc.app_dir}/${nc.entry_point}`))
    })
}

var isExcluded = (route) => {
    var excluded = false;
    nc.exclude_dirs.forEach((exclude) => {
        if (route.startsWith(exclude))
            excluded = true;
    });

    if (excluded)
        return true;

    nc.exclude_files.forEach((exclude) => {
        if (route === exclude)
            excluded = true;
    })

    return excluded;
}

var filter_excludes = (excludes) => {
    excludes = excludes.filter((e) => {
        return !['', '.', ' ', '/'].includes(e);
    })

    nc.exclude_files = excludes.filter((exclude) => {
        const fullpath = path.join(nc.server_dir, nc.app_dir, exclude);
        return fs.existsSync(fullpath) && fs.lstatSync(fullpath).isFile();
    })

    nc.exclude_dirs = excludes.filter((exclude) => {
        const fullpath = path.join(nc.server_dir, nc.app_dir, exclude);
        return fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory();
    })

    nc.exclude_dirs = nc.exclude_dirs.map((exclude) => {
        if (exclude[0] != '/')
            exclude = '/' + exclude;
        if (exclude[exclude.length - 1] != '/')
            exclude += '/';
        return exclude;
    })

    nc.exclude_files = nc.exclude_files.map((exclude) => {
        if (exclude[0] != '/')
            exclude = '/' + exclude;
        return exclude;
    })
}