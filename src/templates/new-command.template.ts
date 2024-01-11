import type { Command } from 'commander';

export const action = () => {
  // TODO: Implement command logic here
}

export default function (program: Command) {
  program
    .command('#{name}')
    .summary('#{summary}')
    .description(`#{description}`)
    // .argument('<argument>', 'Argument description')
    // .option('-o,--option <option>', 'Option description')
    .action(action);
  return program;
}
