import * as path from 'path';
import { m2File, skinFile } from '../../examples/m2.bml';
import { testFile } from '../helpers/tags';

describe('wow files: ', () => {
  it('should parse', () => {
    testFile(path.join(__dirname, 'files/axe.m2'), m2File, 'm2');
    testFile(path.join(__dirname, 'files/axe.skin'), skinFile, 'skin');
  });
});
