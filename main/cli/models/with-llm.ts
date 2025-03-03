import { ollama } from 'ollama-ai-provider'
import { generateText } from 'ai'

const model = ollama('qwen2.5-coder:latest')

const test = async (prompt: string) => {
  const answer = await generateText({
    model,
    prompt,
  })

  console.log(answer)
}

test('안녕하세요')

// safe('module')
//   .ifOk()
//   .ifOk()
//   .ifOk()
//   .ifOk()
//   .ifError()
//   .unwrap()
