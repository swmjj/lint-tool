/* eslint-disable @typescript-eslint/no-unused-vars */
import { extname, join } from 'path';
import { ESLint } from 'eslint';
import fg from 'fast-glob';
import { formatESLintResults } from './formatESLintResults';
import { getESLintConfig } from './getESLintConfig';
import { Config, PKG, ScanOptions } from '../../types';
import { ESLINT_FILE_EXT, ESLINT_IGNORE_PATTERN } from '../../utils/constants';

export interface DoESLintOptions extends ScanOptions {
  pkg: PKG;
  config?: Config;
}

export async function doESLint(options: DoESLintOptions) {
  // let files: string[];
  // if (options.files) {
  //   files = options.files.filter((name) => ESLINT_FILE_EXT.includes(extname(name)));
  // } else {
  //   const pattern = join(
  //     options.include,
  //     `**/*.{${ESLINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`,
  //   );
  //   files = await fg(pattern, {
  //     cwd: options.cwd,
  //     ignore: ESLINT_IGNORE_PATTERN,
  //   });
  // }
  const eslint = new ESLint(getESLintConfig(options, options.pkg, options.config));


  const reports = await eslint.lintFiles(options.include || options.cwd);

  if (options.fix) {
    await ESLint.outputFixes(reports);
  }

  return formatESLintResults(reports, options.quiet, eslint);
}
