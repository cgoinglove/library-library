import { join } from 'node:path'
import { z } from 'zod'

export const generateContext = z.object({
  module: z.string().nonempty({ message: 'This field is required.' }).regex(/^\S+$/, { message: '공백 포함 안됨' }),
  paths: z.array(z.string()).min(1, { message: 'At least one path is required' }),
  codeTemplate: z.string().default(''),
})

export type GenerateContext = z.infer<typeof generateContext>

export const ROOT = join(process.cwd(), 'libraries')
