import {CopyTree, EnsureDir} from "./kernel";

export class Toolkit {

    constructor(prj: string) {
        this._prj = prj;
    }

    update() {
        CopyTree('tools', `${this._prj}/tools`);
        CopyTree('project/3rd', `${this._prj}/project/3rd`, null, null, true);
        CopyTree('project/scripts', `${this._prj}/project/scripts`, null, null, true);
        CopyTree('project/template', `${this._prj}/project/template`, null, null, true);
        CopyTree('project/src/nnt', `${this._prj}/project/src/nnt`, null, null, true);
        CopyTree('project/src/Main.ts', `${this._prj}/project/src/Main.ts`);
        CopyTree('project/egretProperties.template.json', `${this._prj}/project/egretProperties.template.json`, null, null, true);
        CopyTree('project/tsconfig.json', `${this._prj}/project/tsconfig.json`, null, null, true);
        CopyTree('project/resource/eui_skins/wgt', `${this._prj}/project/resource/eui_skins/wgt`);
        CopyTree('app.json', `${this._prj}/app.json`);
        CopyTree('devops.json', `${this._prj}/devops.json`);
        CopyTree('package.json', `${this._prj}/package.json`);
        CopyTree('tsconfig.json', `${this._prj}/tsconfig.json`);

        EnsureDir(`${this._prj}/project/resource/assets`,
            `${this._prj}/project/resource/eui_skins/app`,
            `${this._prj}/project/src/app`);
    }

    private _prj: string;
}