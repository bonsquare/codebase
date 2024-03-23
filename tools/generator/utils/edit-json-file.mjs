import JSON5 from 'json5';
import { writeFileSync, readFileSync } from 'fs';

export const editJsonFile = async (path, callback) => {
  const content = JSON5.parse(readFileSync(path, { encoding: 'utf8' }));
  writeFileSync(path, JSON.stringify(await callback(content)));
};
