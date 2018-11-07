import * as fs from 'fs';
import * as path from 'path';
import {ManifestPlugin, ManifestPluginOptions} from "built-in";

export class FixPlugin extends ManifestPlugin {

    constructor(opt?:ManifestPluginOptions) {
        super(opt);
    }

    async onFile(file: plugins.File) {
        try {
            let r = await super.onFile(file);
            if (!r)
                return null;

            if (r.extname == '.js') {
               const filename = r.origin;
               if (filename == 'resource/default.thm.js' || filename == 'resource/default.thm.min.js') {
                   let content = r.contents.toString();
                   content = content.replace(/(window.app\.?[a-z]*)={};/g, '$1||($1={});')
                   r.contents = new Buffer(content);
               }
            }

            return r;
        } catch (err) {
            fs.writeFileSync("e:\\error.txt", err);
        }
        return null;
    }

    async onFinish(pluginContext: plugins.CommandContext) {
        await super.onFinish(pluginContext);
    }
}