import { safeGraph } from 'sf-chain/graph'
import { nodes } from '../utils/node.ts'
import chalk from 'chalk'

const graph = safeGraph()
  .addNode(nodes.query_name)
  .addNode(nodes.query_category_decision)
  .addNode(nodes.query_paths)
  .addNode(nodes.install_module)
  .addNode(nodes.create_template)
  .addNode(nodes.valid)
  .addNode({
    name: 'out',
    processor() {
      console.log(chalk.greenBright('✅Success! Module installed and template file created!'))
    },
  })
  .edge('query_name', 'query_paths')
  .edge('query_paths', 'query_category_decision')
  .dynamicEdge('query_category_decision', result => {
    return {
      name: result.output ? 'query_paths' : 'valid',
      input: result.input,
    }
  })
  .edge('valid', 'install_module')
  .edge('install_module', 'create_template')
  .compile('query_name', 'out')

graph
  .run({
    module: '',
    paths: [],
    codeTemplate: '',
  })
  .catch(e => {
    console.error(chalk.red(e.message))
  })
  .unwrap()
