import { ReactElement, ChangeEvent } from 'react'
import { Select } from 'flowbite-react'

import type { Rule, UpdateRuleEvent } from '@/components/expressions2/types'

type SingleValueSelectProps = {
  rule: Rule
  options: string[]
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function SingleValueSelect(
  props: SingleValueSelectProps
): ReactElement {
  const updateValue = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value
    props.onUpdate({ ...props.rule, value })
  }

  return (
    <Select
      disabled={!props.rule.expression}
      value={props.rule.value as string}
      onChange={updateValue}
      className={props.className}
      required
    >
      {props.options.map((e) => (
        <option value={e} key={e}>{e}</option>
      ))}
    </Select>
  )
}
