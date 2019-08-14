import * as path from 'path';
import { classFile } from '../../examples/java.class.bml';
import { testFile } from '../helpers/tags';

describe('java class files: ', () => {
  it('should parse', () => {
    testFile(path.join(__dirname, 'files/Test.class'), classFile, 'Test class');
    testFile(
      path.join(__dirname, 'files/Person.class'),
      classFile,
      'Person interface'
    );
    testFile(
      path.join(__dirname, 'files/Student.class'),
      classFile,
      'Student class'
    );
    testFile(
      path.join(__dirname, 'files/Student$SubClass.class'),
      classFile,
      'Student sub class'
    );
  });
});
