import path = require("path");
import {Service} from "./service";
import watch = require("watch");
import {IsMatch, NotMatch} from "./kernel";
import fs = require("fs-extra");
import execa = require("execa");

const PAT_TS = [/\.ts$/];
const PAT_TS_IGNORE = [/\.d\.ts$/];

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

    buildOneTs(file: string) {
        let js = file.replace('src', 'bin-debug').replace('.ts', '.js');
        // 直接使用tsc编译
        //execa('tsc', ['-t', 'es5', '--outFile', js, file]);
        const compiler = require("C:\\Users\\wybol\\AppData\\Roaming\\Egret\\engine\\5.2.9\\tools\\actions\\Compiler");
        let tsc = new compiler.Compiler();
        let opts = tsc.parseTsconfig('project/', false);
        opts.options.allowUnreachableCode = true;
        opts.options.emitReflection = true;
        tsc.compile(opts, [file]);
    }
}

if (path.basename(process.argv[1]) == 'egret-ts.js') {
    console.log('启动egret-ts服务');
    Service.Locker('egret-ts').acquire();

    let ts = new EgretTs();
    ts.buildOneTs("project/src/app/MainScene.ts");
    watch.createMonitor('project/src', {interval: 1}, monitor => {
        monitor.on('created', (f: string, stat) => {
            if (NotMatch(f, PAT_TS_IGNORE) && IsMatch(f, PAT_TS))
                ts.buildOneTs(f);
        });
        monitor.on('changed', (f: string, stat) => {
            if (NotMatch(f, PAT_TS_IGNORE) && IsMatch(f, PAT_TS))
                ts.buildOneTs(f);
        });
        monitor.on('removed', (f: string, stat) => {
            let js = f.replace('src', 'bin-debug').replace('.ts', '.js');
            fs.unlink(js);
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
