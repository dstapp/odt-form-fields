'use strict';

const JSZip = require('jszip');
const cheerio = require('cheerio');

const contentFilename = 'content.xml';

const modTypeOperationMap = {
    'textbox': ($, mod) => {
        $("[form\\:name='" + mod.name + "']").attr("form\:current-value", mod.value);
    },
    'checkbox': ($, mod) => {
        if (mod.value) {
            $("[form\\:name='" + mod.name + "']").attr("form\:current-state", 'checked');
        } else {
            $("[form\\:name='" + mod.name + "']").removeAttr("form\:current-state");
        }
    }
};

module.exports = class OdtFormFields {

    constructor() {
        this.modifications = [];
        this.zip = null;
        this.$ = null;
    }

    load(file) {
        return new Promise((resolve, reject) => {
            this.zip = new JSZip();
            this.zip.loadAsync(file)
                .then(() => {
                    this.zip.file(contentFilename).async('string')
                        .then((data) => {
                            this.$ = cheerio.load(data, {
                                xmlMode: true,
                                decodeEntities: false,
                                normalizeWhitespaces: false
                            });

                            resolve(this);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    setTextbox(name, value) {
        this.modifications.push({
            type: 'textbox',
            name: name,
            value: value
        });

        return this;
    }

    setCheckbox(name, value) {
        this.modifications.push({
            type: 'checkbox',
            name: name,
            value: value
        });

        return this;
    }

    apply() {
        return new Promise((resolve, reject) => {
            this.modifications.forEach((mod) => {
                if (modTypeOperationMap.hasOwnProperty(mod.type)) {
                    modTypeOperationMap[mod.type](this.$, mod);
                } else {
                    reject(`Modification type ${mod.type} does not exist`);
                }
            });

            resolve(this);
        });
    }

    getStream() {
        this.zip.file(contentFilename, this.$.xml());
        return this.zip.generateNodeStream({type: 'nodebuffer', streamFiles: true});
    }

};