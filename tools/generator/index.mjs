import { Command } from 'commander';
import { hostSiteCommand } from './commands/angular/host-site.mjs';
import { remoteSiteCommand } from './commands/angular/remote-site.mjs';

const program = new Command();
program
  .showHelpAfterError()
  .name('generator')
  .description('Code generator tool');

program
  .command('host-site')
  .description('generator host site application')
  .argument('[App Name]', 'host site name')
  .action(hostSiteCommand);

program
  .command('remote-site')
  .description('generator micro site')
  .argument('[App Name]', 'micro site name')
  .argument('[Host]', 'host site name')
  .action(remoteSiteCommand);

program.parse();
