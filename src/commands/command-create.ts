import type { Command } from 'commander';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import fs from 'fs/promises';
import { promptAndValidateParams } from '@/utils/cli.utils'

const DEFAULT_COMMAND_DIR = 'src/commands';

const TEMPLATE_FILE = 'templates/new-command.template.ts';

type Options = {
  name?: string,
  targetDir?: string,
  summary?: string,
  description?: string,
}

export const action = async (options: Options) => {
  const parameters = await promptAndValidateParams<Required<Options>>(options, {
    name: {
      message: 'Command name (format: {namespace}:{action}):',
      validate: (value: string) => {
        if (!value) {
          return 'Command name is required';
        }
        if (!value.includes(':')) {
          return 'Command name should be formatted as {namespace}:{action} (ex: project:create, command:delete...)';
        }
        return true;
      },
    },
    summary: {
      message: 'Command short summary:',
      default: '',
    },
    description: {
      message: 'Command long description:',
      default: '',
    },
    targetDir: {
      message: 'Target directory where the command file will be created:',
      default: DEFAULT_COMMAND_DIR,
    },
  });

  // Adds the command to the package.json scripts.
  {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.scripts[parameters.name]) {
      throw new Error('⚠️  Command already exists in package.json');
    }

    packageJson.scripts[parameters.name] = `ts-node src/index.ts ${parameters.name}`;
    fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
    console.log('ℹ️  package.json updated');
  }

  const filePath = path.resolve(
    process.cwd(),
    parameters.targetDir,
    `${kebabCase(parameters.name)}.ts`,
  )

  // Creates the command file based on the template.
  {
    const templateContent = await fs.readFile(path.resolve(__dirname, '../', TEMPLATE_FILE), 'utf-8')
    const content = templateContent
      .replace(/\#\{name\}/g, parameters.name.replace('\'', '\\\''))
      .replace(/\#\{summary\}/g, parameters?.summary.replace('\'', '\\\'') ?? '')
      .replace(/\#\{description\}/g, parameters?.description.replace('\'', '\\\'') ?? '');
    fs.writeFile(filePath, content, 'utf-8');
    console.log('ℹ️  File created: ', filePath);
  }

  // Adds the command to the index.ts file of the commands directory.
  {
    const indexFilePath = path.resolve(__dirname, './index.ts')
    const relativeFilePath = path.relative(path.dirname(indexFilePath), filePath)
      .replace('.ts', '');
    const tsFilePath = relativeFilePath.startsWith('.') ? relativeFilePath : `./${relativeFilePath}`;
    const functionName = camelCase(parameters.name)
    const IMPORT_COMMENT = '// DO NOT REMOVE: AUTO-GENERATED COMMANDS IMPORT';
    const EXPORT_COMMENT = '// DO NOT REMOVE: AUTO-GENERATED COMMANDS EXPORT';

    const indexContent = await fs.readFile(path.resolve(__dirname, './index.ts'), 'utf-8')
    const content = indexContent
      .replace(
        IMPORT_COMMENT,
        `import ${functionName} from '${tsFilePath}';\n${IMPORT_COMMENT}`)
      .replace(
        EXPORT_COMMENT,
        `${functionName},\n  ${EXPORT_COMMENT}`);
    fs.writeFile(indexFilePath, content, 'utf-8');
    console.log('ℹ️  commands/index.ts updated');
  }
}

export default function (program: Command) {
  program
    .command('command:create')
    .summary('Creates a new command in the project.')
    .description(`This command will:

 - creates a new command file in the specified directory based on the template "${TEMPLATE_FILE}",
 - adds it to the index.ts file of the commands directory,
 - adds the command .`)
    .option('--name <name>', 'Command name (formatted as {namespace}:{action}). Ex: project:create, command:delete...')
    .option('--summary <summary>', 'Command short description.')
    .option('--description <description>', 'Command long description.')
    .option('--dir <targetDir>', 'Target directory where the command file will be created.')
    .action(action);
  return program;
}
