import type { Command } from 'commander';
import { createCommand } from '@/utils/command.utils'

export const action = () => {
  // TODO: Implement command logic here
}

export default function (program: Command) {
  program
    .command('#{name}')
    .description('#{description}')
    .summary('#{summary}')
    // .argument('<argument>', 'Argument description')
    // .option('-o,--option <option>', 'Option description')
    .action(action);
  return program;
}
