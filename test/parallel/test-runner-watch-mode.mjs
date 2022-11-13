// Flags: --expose-internals
import '../common/index.mjs';
import { describe, it } from 'node:test';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import util from 'internal/util';
import * as fixtures from '../common/fixtures.mjs';

async function testWatch({ files, fileToUpdate }) {
  const ran1 = util.createDeferredPromise();
  const ran2 = util.createDeferredPromise();
  const child = spawn(process.execPath, ['--watch', '--test', '--no-warnings', ...files], { encoding: 'utf8' });
  let stdout = '';
  child.stdout.on('data', (data) => {
    stdout += data.toString();
    if (/ok 2/.test(stdout)) ran1.resolve();
    if (/ok 3/.test(stdout)) ran2.resolve();
  });

  await ran1.promise;
  writeFileSync(fileToUpdate, readFileSync(fileToUpdate, 'utf8'));
  await ran2.promise;
  child.kill();
}

describe('test runner watch mode', () => {
  it('should run tests repeatedly', async () => {
    const file1 = fixtures.path('test-runner/index.test.js');
    const file2 = fixtures.path('test-runner/subdir/subdir_test.js');
    await testWatch({ files: [file1, file2], fileToUpdate: file2 });
  });

  it('should run tests with dependency repeatedly', async () => {
    const file1 = fixtures.path('test-runner/index.test.js');
    const dependent = fixtures.path('test-runner/dependent.js');
    const dependency = fixtures.path('test-runner/dependency.js');
    await testWatch({ files: [file1, dependent], fileToUpdate: dependency });
  });

  it('should run tests with ESM dependency', async () => {
    const file1 = fixtures.path('test-runner/index.test.js');
    const dependent = fixtures.path('test-runner/dependent.js');
    const dependency = fixtures.path('test-runner/dependency.mjs');
    await testWatch({ files: [file1, dependent], fileToUpdate: dependency });
  });
});
