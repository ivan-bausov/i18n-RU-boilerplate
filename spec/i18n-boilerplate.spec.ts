/**
 * @author Ivan Bausov
 * Date: 09/02/17
 * Time: 22:50
 */
import {getCyrillicI18NNodes} from "../i18n-RU-boilerplate";

describe('getCyrillicI18NNodes', () => {
    it('simple strings', () => {
       expect(getCyrillicI18NNodes('./spec/simple_strings/src.ts')).toEqual({
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