import { program } from 'commander'

/**
 * Command JSON representation.
 */
export type CommandJSON = {
  name: string,
  subcommand: string,
  description: string,
  args: {
    term: string,
    description: string,
  }[],
  options: {
    term: string,
    description: string,
  }[],
}

/**
 * Get all commands as JSON.
 */
export function getCommands(): CommandJSON[] {
  const helper = program.createHelp()
  const commands: CommandJSON[] = helper
    .visibleCommands(program)
    .map((cmd) => ({
      name: cmd.name(),
      subcommand: helper.subcommandTerm(cmd),
      description: helper.subcommandDescription(cmd),
      args: helper.visibleArguments(cmd).map((arg) => ({
        term: helper.argumentTerm(arg),
        description: helper.argumentDescription(arg),
      })),
      options: helper.visibleOptions(cmd).map((option) => ({
        term: helper.optionTerm(option),
        description: helper.optionDescription(option),
      })),
    }))
    .filter(cmd => cmd && cmd.name !== 'help')
    .sort((a, b) => a.name.localeCompare(b.name))
  return commands
}

