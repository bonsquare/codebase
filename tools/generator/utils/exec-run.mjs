import { exec } from 'child_process';

export const execRun = cmd => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        // no leaks
        resolve(stdout);
      }
    });
  });
};
