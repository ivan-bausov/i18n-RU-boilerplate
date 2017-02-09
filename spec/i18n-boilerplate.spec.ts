/**
 * @author Ivan Bausov
 * Date: 09/02/17
 * Time: 22:50
 */
import {getCyrillicI18NNodes, i18nRuTranslate} from "../i18n-RU-boilerplate";
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