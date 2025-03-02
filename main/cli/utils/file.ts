import chalk from 'chalk'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { ROOT } from '../context.ts'
import { dirname } from 'node:path'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const DEFAULT_TEMPLATE = (moduleName: string) => `
describe('${moduleName}',()=>{

})`

export const installModule = async (moduleName: string) => {
  console.log(chalk.yellowBright(`🚀 Installing module: ${chalk.blue(moduleName)} ...`))
  try {
    const { stdout, stderr } = await promisify(exec)(`pnpm add ${moduleName}`)
    if (stdout) {
      console.log(chalk.green(stdout))
    }
    if (stderr) {
      console.error(chalk.red(stderr))
    }
  } catch (error) {
    console.error(chalk.red('Error during module installation:'), error)
    throw error
  }
}

export const createTemplate = (moduleName: string, paths: string[], template?: string) => {
  const fullPath = `${[ROOT, ...paths].join('/')}/${moduleName}.ts`
  console.log(chalk.cyan(`📄 Creating template file: ${moduleName}.ts`))

  const dirName = dirname(fullPath)
  if (!existsSync(dirName)) {
    mkdirSync(dirName, { recursive: true })
  }
  writeFileSync(fullPath, template || DEFAULT_TEMPLATE(moduleName), { encoding: 'utf-8' })
}
