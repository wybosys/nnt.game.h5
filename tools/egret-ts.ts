import path = require("path");
import watch = require("watch");
import fs = require("fs-extra");
import execa = require("execa");
import os = require("os");
import {IService, Service} from "./service";
import {IsMatch, NotMatch, StringT} from "./kernel";

const PAT_TS = [/\.ts$/];
const PAT_TS_IGNORE = [/\.d\.ts$/];
const EGRET_CMD = os.type() == 'Windows_NT' ? 'egret.cmd' : 'egret';

let options: any;
let project: any;
let host: any;

export class EgretTs implements IService {

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

    // 获得egret的安装目录
    let egretinfo = execa.sync(EGRET_CMD, ['info']);
    let output = egretinfo.stdout.split('\n');
    let data = output[2];
    let pos = data.indexOf('：');
    if (pos == -1)
        pos = data.indexOf(':');
    let libdir = StringT.SubStr(data, pos + 1);
    console.log(libdir);

    // 需要先编译完整项目
    const compiler = require(libdir + '/tools/actions/Compiler');
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
