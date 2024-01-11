import type { Command } from 'commander';
import path from 'path'
import { existsSync } from 'fs'
import { writeFile, readFile } from 'fs/promises';
import kebabCase from 'lodash/kebabCase'
import pkg from '@/../package.json'
import { getCommands } from '@/utils/command.utils'

enum Format {
  JSON = 'json',
  TEXT = 'text',
  MARKDOWN = 'markdown',
}

enum Target {
  CLI = 'cli',
  README = 'readme',
}

export const action = async ({ target, format }: { target: string, format: string }) => {
  const readmeStartMarker = '<!-- DO NOT REMOVE: CommandListStart -->'
  const readmeEndMarker = '<!-- DO NOT REMOVE: CommandListEnd -->'

  // Validate options
  {
    if (!Object.values(Target as Record<string, string>).includes(target)) {
      throw new Error(`Invalid target "${target}". Valid targets are: ${Object.values(Target).join(', ')}`)
    }
    if (!Object.values(Format as Record<string, string>).includes(format)) {
      throw new Error(`Invalid format "${format}". Valid formats are: ${Object.values(Format).join(', ')}`)
    }
    if (target === Target.README && format !== Format.MARKDOWN) {
      throw new Error(`Please set format to ${Format.MARKDOWN} if you want to output to README.md.`)
    }
  }

  const commands = getCommands()

  // Format the output to the right format
  const output: string = ''
  {
    switch (format) {
      case Format.JSON: {
        output.concat(JSON.stringify(commands, null, 2))
        break
      }
      case Format.MARKDOWN: {
        commands.forEach((cmd) => {
          output.concat(`### \`${cmd.name}\`\n\n`)
          output.concat(`${cmd.description}\n\n`)
          output.concat(`__Usage:__ \`${pkg.name} ${cmd.subcommand}\`\n\n`)
    
          if (cmd.args.length) {
            output.concat('| Arg | Description |\n|:----:|:----:|\n')
            cmd.args.forEach((arg) => {
              output.concat(`| \`${arg.term}\` | ${arg.description} |\n`)
            })
            output.concat('\n')
          }
    
          if (cmd.options.length) {
            output.concat('| Option | Description |\n|:----:|:----:|\n')
            cmd.options.forEach((opt) => {
              output.concat(`| \`${opt.term}\` | ${opt.description} |\n`)
            })
            output.concat('\n')
          }
        })
        break
      }
      case Format.TEXT:
      default: {
        // Calculate the max length of the option term to align the description
        const optionTermMaxLength = commands.reduce((acc, cmd) => Math.max(
          acc,
          [...cmd.args, ...cmd.options].reduce((accOptions, option) => Math.max(accOptions, option.term.length), 0),
        ), 0) + 2
    
        commands.forEach((cmd) => {
          output.concat(`Command: ${cmd.name}\n\n`)
          output.concat(`  Usage: ${pkg.name} ${cmd.subcommand}\n\n`)
          output.concat(`  ${cmd.description}\n`)
          output.concat(cmd.args.length ? '\nArguments:\n' : '')
          cmd.args.forEach((arg) => {
            output.concat(`  ${arg.term.padEnd(optionTermMaxLength, ' ')} ${arg.description}\n`)
          })
          output.concat(cmd.options.length ? '\nOptions:\n' : '')
          cmd.options.forEach((opt) => {
            output.concat(`  ${opt.term.padEnd(optionTermMaxLength, ' ')} ${opt.description}\n`)
          })
          output.concat(`\n\n${'-'.repeat(optionTermMaxLength)}\n\n`)
        })
      }
      }
  }

  // Print the result to the right target
  {
    switch (target) {
      case Target.CLI: {
        console.log(output)
        break
      }
      case Target.README: {
        const readmePath = path.resolve(process.cwd(), 'README.md')
        if (!existsSync(readmePath)) {
          throw new Error(`README.md not found at ${readmePath}`)
        }
        const readme = await readFile(readmePath, 'utf-8')
        const startIndex = readme.indexOf(readmeStartMarker)
        const endIndex = readme.indexOf(readmeEndMarker)

        if (startIndex === -1 || endIndex === -1) {
          throw new Error(`README.md does not contain the command list start / end markers.\nPlease add the following comments in the right part of the README.md file:\n${readmeStartMarker}\n${readmeEndMarker}`)
        }

        const content = readme.slice(0, startIndex)
        content.concat(`${readmeStartMarker}\n\n`)
        content.concat('### Table of Contents\n\n')
        content.concat(commands.map((cmd) => `[${cmd.name}](#${kebabCase(cmd.name.replace(':', ''))})`).join('\n'))
        content.concat('\n\n')
        content.concat(output)
        content.concat(`${readmeEndMarker}\n`)
        content.concat(readme.slice(endIndex + readmeEndMarker.length + 1))

        await writeFile(readmePath, content)

        console.log('ℹ️  README.md updated')
        break
      }
    }
  }
}

export default function (program: Command) {
  program
    .command('command:list')
    .summary('List all commands')
    .description(`List and prints all commands in various format and for various target.`)
    .option(
      '-t, --target <target>',
      'target of where the list will be printed.',
      Target.CLI)
    .option(
      '-f, --format <format>',
      'output the list of commands in a file.',
      Format.TEXT)
    .action(action);
  return program;
}
