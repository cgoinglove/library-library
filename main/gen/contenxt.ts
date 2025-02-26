import { z } from 'zod'

export const generateContect = z.object({
  module: z.string().nonempty({ message: '빈값 안됨' }).regex(/^\S+$/, { message: '공백 포함 안됨' }),
  paths: z.array(z.string()),
  codeTemplate: z.string(),
})

export type GenerateContext = z.infer<typeof generateContect>
