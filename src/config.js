import { GetAllFileNamesFromFolder } from './common.js';

// Require
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let parentConfig = require('../config.json');

const mainConfig = parentConfig;

const localeConfigsFileNames = GetAllFileNamesFromFolder(
  `${process.cwd()}/locale/`
);

localeConfigsFileNames.forEach((localeConfigFileName) => {
  const localeConfig = require(`${process.cwd()}/locale/${localeConfigFileName}`);

  const [localeConfigFileNameWoExtension] = localeConfigFileName.split('.');

  mainConfig.locales[localeConfigFileNameWoExtension] = localeConfig;
});

export default mainConfig;
