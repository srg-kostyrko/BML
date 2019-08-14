import * as path from 'path';
import { testFile } from '../helpers/tags';
import { zipFile } from '../../examples/zip.bml';

describe('zip files: ', () => {
  it('should parse', () => {
    testFile(path.join(__dirname, 'files/sample1.zip'), zipFile, 'zip');
  });
});
