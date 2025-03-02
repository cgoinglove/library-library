import { safeNode } from 'sf-chain/graph'
import { queryForCategoryDecision, queryForModuleName, queryForPath } from './query.ts'
import { createTemplate, installModule } from './file.ts'
import { generateContext, GenerateContext } from '../context.ts'
import { safe } from 'sf-chain'

const updateContext =
  <K extends keyof GenerateContext>(context: GenerateContext, key: K) =>
  (value: GenerateContext[K]) => {
    const schema = generateContext.shape[key]
    return Object.assign(context, {
      [key]: schema.parse(value),
    })
  }

export const nodes = {
  query_name: safeNode({
    name: 'query_name',
    processor: (context: GenerateContext) => safe(queryForModuleName).map(updateContext(context, 'module')).unwrap(),
  }),
  query_category_decision: safeNode({
    name: 'query_category_decision',
    processor: (context: GenerateContext) => queryForCategoryDecision(context.module, context.paths),
  }),
  query_paths: safeNode({
    name: 'query_paths',
    processor: (context: GenerateContext) => safe(queryForPath.bind(null, context.paths)).map(updateContext(context, 'paths')).unwrap(),
  }),
  install_module: safeNode({
    name: 'install_module',
    processor: (context: GenerateContext) => safe(context).effect(installModule.bind(null, context.module)).unwrap(),
  }),
  create_template: safeNode({
    name: 'create_template',
    processor: (context: GenerateContext) =>
      safe(context)
        .effect(createTemplate.bind(null, context.module, context.paths, context.codeTemplate))
        .unwrap(),
  }),
  valid: safeNode({
    name: 'valid',
    processor: (context: GenerateContext) => safe(context).map(generateContext.parse).unwrap(),
  }),
}
