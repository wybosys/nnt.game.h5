import path = require("path");
import {Service} from "./service";
import watch = require("watch");
import {IsMatch, NotMatch} from "./kernel";
import fs = require("fs-extra");
import execa = require("execa");

const PAT_TS = [/\.ts$/];
const PAT_TS_IGNORE = [/\.d\.ts$/];

let options: any;
let project: any;
let host: any;

export class EgretTs {

    async startWatch(svc: Service) {
        if (!Service.Locker('egret-ts').trylock())
            return;

        let res = execa('node', ['tools/egret-ts.js'], {
            detached: true,
            stdio: 'ignore'
        });
        res.unref();
        svc.add(res, 'egret-ts');
    }

    buildOneTs(file: string, mode: null | "added" | "removed") {
        file = file.replace(/\\/g, '/');
        let js = file.replace('src', 'bin-debug').replace('.ts', '.js');
        // 编译修改的文件
        host = host.compileWithChanges([{
            type: mode,
            fileName: file
        }], options.sourceMap);
    }
}

if (path.basename(process.argv[1]) == 'egret-ts.js') {
    console.log('启动egret-ts服务');
    Service.Locker('egret-ts').acquire();

    // 需要先编译完整项目
    const compiler = require("C:\\Users\\wybol\\AppData\\Roaming\\Egret\\engine\\5.2.9\\tools\\actions\\Compiler");
    project = new compiler.Compiler();
    let res = project.parseTsconfig('project/', false);
    res.options.allowUnreachableCode = true;
    res.options.emitReflection = true;
    res.options.outDir = 'project/bin-debug';
    options = res.options;
    host = project.compile(options, res.fileNames);
    console.log('egret自动编译');

    let ts = new EgretTs();
    //ts.buildOneTs("project/src/app/MainScene.ts");

    watch.createMonitor('project/src', {interval: 1}, monitor => {
        monitor.on('created', (f: string, stat) => {
            if (NotMatch(f, PAT_TS_IGNORE) && IsMatch(f, PAT_TS))
                ts.buildOneTs(f, "added");
        });
        monitor.on('changed', (f: string, stat) => {
            if (NotMatch(f, PAT_TS_IGNORE) && IsMatch(f, PAT_TS))
                ts.buildOneTs(f, null);
        });
        monitor.on('removed', (f: string, stat) => {
            if (NotMatch(f, PAT_TS_IGNORE) && IsMatch(f, PAT_TS)) {
                ts.buildOneTs(f, "removed");
                let js = f.replace('src', 'bin-debug').replace('.ts', '.js');
                fs.unlink(js);
            }
        });
    });
}

const TPL_TSCONFIG = `
{
    "compilerOptions": {
        "target": "es5",
        "outDir": "bin-debug",
        "experimentalDecorators": true,
        "lib": [
            "es6",
            "dom",
            "es2015.promise"
        ],
        "types": []
    },
    "include": [
        "src",
        "libs",
        "resource/*.d.ts"
    ]
}`;
