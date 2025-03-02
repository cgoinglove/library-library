import chalk from 'chalk'
import inquirer from 'inquirer'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from '../context.ts'

const notNullAble = (input: string) => {
  return input && input.trim() !== '' ? true : 'This field is required.'
}

const NEW_CATEGORY = chalk.gray(`Create new category`)

const getCategoryChoices = (root: string) => {
  let dirs: string[] = []
  if (existsSync(root)) {
    dirs = readdirSync(root).filter(file => statSync(join(root, file)).isDirectory())
  }
  return dirs.length ? [NEW_CATEGORY, ...dirs] : []
}

export const queryForModuleName = async () =>
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: `✨ Enter the module name (e.g., axios, zod, etc.):`,
        validate: notNullAble,
      },
    ])
    .then(res => res.name as string)

export const queryForCategoryDecision = async (moduleName: string, currentPaths: string[] = []): Promise<boolean> => {
  console.log('📂', chalk.green('current path:'), chalk.blue(`${currentPaths.join('/')}/${moduleName}.ts`))
  return inquirer
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

export const queryForPath = async (currentPaths: string[] = []): Promise<string[]> => {
  const categories = getCategoryChoices(join(ROOT, ...currentPaths))

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'category',
        message: `Select a category or create a new one:`,
        choices: () => getCategoryChoices(join(ROOT, ...currentPaths)),
        when: Boolean(categories.length),
      },
      {
        type: 'input',
        name: 'newCategoryName',
        message: 'Enter category name:',
        default: '',
        when: answers => !answers.category || answers.category === NEW_CATEGORY,
        validate: notNullAble,
      },
    ])
    .then(res => {
      const next = res.newCategoryName || res.category
      if (!next) throw new Error('Category not provided.')
      return [...currentPaths, next]
    })
}
