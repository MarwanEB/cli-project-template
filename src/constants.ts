import path from 'path'
import packageJson from "@/../package.json";

export const temporaryDirectory = path.join(__dirname, '..', 'tmp')

export const packageName = packageJson.name

export const packageVersion = packageJson.version

export const packageDescription = packageJson.description
