import {readFileSync} from "fs";
import * as ts from "typescript";

export interface I18NNode {
    text:string;
}

export function getCyrillicI18NNodes(file_name:string):{[index:string]:I18NNode} {
    let sourceFile = ts.createSourceFile(file_name, readFileSync(file_name).toString(), ts.ScriptTarget.ES5, /*setParentNodes */ true),
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