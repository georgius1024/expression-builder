import { ReactElement, ChangeEvent } from 'react'
import { TextInput } from 'flowbite-react'

import type { Rule, UpdateRuleEvent } from '@/components/expressions2/types'

type SingleValueInputProps = {
  rule: Rule
  inputType: string
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function SingleValueInput(
  props: SingleValueInputProps
): ReactElement {
  const updateValue = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value
    props.onUpdate({ ...props.rule, value })
  }

  return (
    <TextInput
      disabled={!props.rule.expression}
      className={props.className}
      type={props.inputType}
      required
      value={String(props.rule.value)}
      onChange={updateValue}
    />
  )
}
