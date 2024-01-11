import { program } from "commander";
import { packageName, packageDescription, packageVersion} from '@/constants';
import commands from './commands';

program
  .name(packageName)
  .version(packageVersion)
  .description(packageDescription);

commands.forEach((addCommand) => {
  addCommand(program);
});

program.parse();
