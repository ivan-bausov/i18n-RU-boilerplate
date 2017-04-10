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

function stringToRegExp(str) {
    var result = str;

    result = result.replace(/\(/g, '\\(');
    result = result.replace(/\)/g, '\\)');
    result = result.replace(/\+/g, '\\+');
    result = result.replace(/\?/g, '\\?');

    return result;
}

export function i18nRuTranslate(paths:string[], dest:(source_path:string) => string) {
    let files_count:number = 0,
        dictionary:BaseDictionary = {};

    paths.forEach((path:string) => {
        let data:string = readFileSync(path).toString(),
            file_dictionary:FileDictionary = getCyrillicI18NNodes(path, data);

        dictionary[dictionaryKey(files_count)] = file_dictionary;

        for(let key in file_dictionary) {
            data = data.replace(new RegExp(`[\"\']${stringToRegExp(file_dictionary[key].text)}[\"\']`), `t("${dictionaryKey(files_count)}.${key}")`);
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

    function processText(text:string) {
        if (/[А-я]+/.test(text)) {

            result['_' + found_count] = {
                text: text
            };

            found_count++;
        }
    }

    function getText(node:ts.Node):string {
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
                return (<ts.StringLiteral>node).text;

            case ts.SyntaxKind.FirstTemplateToken:
                return (<ts.StringLiteral>node).text;

            case ts.SyntaxKind.TemplateExpression:
                return data
                    .substr(node.pos, node.end - node.pos)
                    .trim()
                    .replace(/`/g, '');
        }
    }

    function processNode(node:ts.Node) {
        let text:string = getText(node);

        text && processText(text);

        ts.forEachChild(node, processNode);
    }

    return result;
}

export function interfaceToKeyObject(file_name, data:string, interface_identifier:string):string {
    let result:string;
    let sourceFile = ts.createSourceFile(file_name, data, ts.ScriptTarget.ES5, /*setParentNodes */ true);

    processNode(sourceFile);

    function processNode(node) {
        switch(node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
                if (node.name.text === interface_identifier) {
                    result = parseInterfaceDeclaration(node as ts.InterfaceDeclaration);
                }
        }

        ts.forEachChild(node, processNode);
    }

    function parseInterfaceDeclaration(node:ts.InterfaceDeclaration):any {
        let result:any;

        if (node.name.text === interface_identifier) {
            console.log('INTERFACE DECLARATION FOUND');
            result = parseMember(node);
        }

        console.log(result);

        return result;
    }

    function parseMember(node:ts.Node):any {
        let result = [];

        function visit(node) {
            switch(node.kind) {
                case ts.SyntaxKind.PropertySignature:
                    console.log('PROPERTY_SIGNATURE');
                    result.push(parsePropertySignature(node));
            }
        }

        ts.forEachChild(node, visit);

        return result;
    }

    function parsePropertySignature(node) {
        let result = {
                name: '',
                value: null
            };


        function visit(node) {
            switch(node.kind) {
                case ts.SyntaxKind.Identifier:
                    result.name = node.text;
                    break;

                case ts.SyntaxKind.StringKeyword:
                    result.value = 'string';
                    break;

                case ts.SyntaxKind.TypeLiteral:
                    result.value = parseMember(node);
                    break;
            }
        }

        ts.forEachChild(node, visit);

        return result;
    }

    function printNode(node) {
        console.log(ts.SyntaxKind[node.kind]);
    }

    return result;
}