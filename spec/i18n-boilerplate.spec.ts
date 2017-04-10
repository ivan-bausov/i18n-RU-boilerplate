/**
 * @author Ivan Bausov
 * Date: 09/02/17
 * Time: 22:50
 */
import {getCyrillicI18NNodes, i18nRuTranslate, interfaceToKeyObject} from "../i18n-RU-boilerplate";
import {readFileSync} from "fs";

describe('getCyrillicI18NNodes', () => {
    it('simple strings', () => {
       expect(getCyrillicI18NNodes('./spec/simple_strings/src.ts', readFileSync('./spec/simple_strings/src.ts').toString())).toEqual({
           _0: {
               text: 'Тест01'
           },
           _1: {
               text: 'Тест02'
           },
           _2: {
               text: 'Тест Тест'
           },
           _3: {
               text: 'Тест Test'
           },
           _4: {
               text: 'Тест ivi+'
           }
       });
    });

    it('string templates', () => {
       expect(getCyrillicI18NNodes('./spec/string_templates/src.ts', readFileSync('./spec/string_templates/src.ts').toString())).toEqual({
           _0: {
               text: 'Тест01'
           },
           _1: {
               text: 'Тест01 ${test.get()} Тест02 ${test01} Тест 03'
           }
       });
    });
});

describe('i18nRuTranslate', () => {
    it('simple strings', () => {
        i18nRuTranslate(['./spec/simple_strings/src.ts'], (src:string) => src.replace('src', 'result'));
        expect(readFileSync('./spec/simple_strings/result.ts').toString()).toBe(readFileSync('./spec/simple_strings/dest.ts').toString())
    });
});

// describe('i18nRuTranslate', () => {
//     it('simple strings', () => {
//         i18nRuTranslate(['./spec/bundle/bundle.ts'], (src:string) => './spec/bundle/bundle.result.js');
//     });
// });
//
// describe('interfaceToKeyObject', () => {
//     it('interface to key object', () => {
//         expect(interfaceToKeyObject('./spec/interface_to_object/src.ts', readFileSync('./spec/interface_to_object/src.ts').toString(), 'ILocaleMessages')).toEqual(readFileSync('./spec/interface_to_object/dest.ts').toString());
//     });
// });