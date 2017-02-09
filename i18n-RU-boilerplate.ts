import {readFileSync, writeFileSync} from "fs";
import * as ts from "typescript";

interface BaseDictionary {
    [index:string]:FileDictionary;
}

interface FileDictionary {
    [index:string]:I18NNode;
}

export interface I18NNode {
    text:string;
}

function dictionaryKey(key:number):string {
    return `_${key}`;
}

export function i18nRuTranslate(paths:string[], dest:(source_path:string) => string) {
    let files_count:number = 0,
        dictionary:BaseDictionary = {};

    paths.forEach((path:string) => {
        let data:string = readFileSync(path).toString(),
            file_dictionary:FileDictionary = getCyrillicI18NNodes(path, data);

        dictionary[dictionaryKey(files_count)] = file_dictionary;

        for(let key in file_dictionary) {
            data = data.replace(new RegExp(`[\"\']${file_dictionary[key].text}[\"\']`), `t("${dictionaryKey(files_count)}.${key}")`);
        }

        writeFileSync(dest(path), data);

        files_count++;
    });
}

export function getCyrillicI18NNodes(file_name:string, data:string):FileDictionary {
    let sourceFile = ts.createSourceFile(file_name, data, ts.ScriptTarget.ES5, /*setParentNodes */ true),
        result:{[index:string]:I18NNode} = {},
        found_count:number = 0;

    processNode(sourceFile);

    function processNode(node:ts.Node) {

        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
                let text = (<ts.StringLiteral>node).text;

                if (/[А-я]+/.test(text)) {

                    result['_' + found_count] = {
                        text: text
                    };

                    found_count++;
                }

                break;
        }

        ts.forEachChild(node, processNode);
    }

    return result;
}