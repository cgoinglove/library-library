import fs from 'node:fs'
import path from 'node:path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { exec } from 'child_process'
import util from 'util'

const ROOT = path.join(process.cwd(), 'libraries')

const notNullAble = (input: string) => {
  return input && input.trim() !== '' ? true : 'This field is required.'
}

const getCategoryChoices = (root: string) => {
  let dirs: string[] = []
  if (fs.existsSync(root)) {
    dirs = fs.readdirSync(root).filter(file => fs.statSync(path.join(root, file)).isDirectory())
  }
  return dirs.length ? ['Create new category', ...dirs] : []
}

function formatPath(categories: string[], moduleName: string): string {
  if (categories.length === 0) {
    return `${chalk.blue('(root)')} -> ${chalk.blueBright(`📄 ${moduleName}.ts`)}`
  }
  const formattedCategories = categories.map(cat => chalk.magenta(`📂 ${cat}`)).join(' -> ')
  return `${formattedCategories} -> ${chalk.blueBright(`📄 ${moduleName}.ts`)}`
}

async function promptForSubCategory(paths: string[], moduleName: string): Promise<string[]> {
  let next = false
  if (!paths.length) {
    next = true
  } else {
    console.log('📂', chalk.green('current path:'), chalk.blue(`${paths.join('/')}/${moduleName}.ts`))
    next = await inquirer
      .prompt([
        {
          type: 'select',
          name: 'next',
          message: `Do you want to add a subcategory?`,
          default: 'no',
          choices: ['no', 'yes'],
        },
      ])
      .then(answer => answer.next == 'yes')
  }

  if (!next) {
    return paths
  }

  const categories = getCategoryChoices(path.join(ROOT, ...paths))

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: `Select a category or create a new one:`,
      choices: () => getCategoryChoices(path.join(ROOT, ...paths)),
      when: Boolean(categories.length),
    },
    {
      type: 'input',
      name: 'newCategoryName',
      message: 'Enter category name:',
      default: '',
      when: answers => !answers.category || answers.category === 'Create new category',
      validate: notNullAble,
    },
  ])

  const chosenCategory = answers.newCategoryName || answers.category
  if (!chosenCategory) {
    throw new Error('Category not provided.')
  }
  paths.push(chosenCategory)

  return promptForSubCategory(paths, moduleName)
}

async function run(): Promise<void> {
  const initialAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter the module name (e.g., axios, zod, etc.):',
      validate: notNullAble,
    },
  ])

  const moduleName = initialAnswers.moduleName
  const finalPaths = await promptForSubCategory([], moduleName)

  console.log(chalk.cyan(`📂 Module path: ${formatPath(finalPaths, moduleName)}`))

  console.log(chalk.yellowBright(`🚀 Installing module: ${chalk.blue(moduleName)} ...`))
  try {
    const { stdout, stderr } = await util.promisify(exec)(`pnpm add ${moduleName}`)
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

  const fullPath = `${[ROOT, ...finalPaths].join('/')}/${moduleName}.ts`
  console.log(chalk.cyan(`📄 Creating template file: ${moduleName}.ts`))

  const dirName = path.dirname(fullPath)
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true })
  }

  const template = `
describe('${moduleName}',()=>{

})`

  fs.writeFileSync(fullPath, template, { encoding: 'utf-8' })

  console.log(chalk.greenBright('✅Success! Module installed and template file created!'))
}

run().catch(console.error)
