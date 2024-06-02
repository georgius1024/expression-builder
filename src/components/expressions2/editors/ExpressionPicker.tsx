import { ReactElement, ChangeEvent } from 'react'

import { Select, Checkbox, Label } from 'flowbite-react'

import type { Rule, UpdateRuleEvent } from '@/components/expressions2/types'
import {
  expressionsList,
  expressionLabel,
  withDefaults
} from '@/components/expressions2/utils'

type ExpressionPickerProps = {
  rule: Rule
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function ExpressionPicker(
  props: ExpressionPickerProps
): ReactElement {
  const updateExpression = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value
    props.onUpdate(
      withDefaults({ ...props.rule, expression: value, value: '' })
    )
  }

  const inverse = () => {
    props.onUpdate({ ...props.rule, not: !props.rule.not })
  }

  const listItems = expressionsList(props.rule.category, props.rule.field)
  const expressionPickerOptions = listItems.map((expression) => (
    <option value={expression} key={expression}>
      {expressionLabel(expression)}
    </option>
  ))
  const showPicker = listItems.length > 1

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`rule-${props.rule.id}-inversion`}
        disabled={!props.rule.field}
        checked={props.rule.not}
        onChange={inverse}
      />
      <Label
        htmlFor={`rule-${props.rule.id}-inversion`}
        disabled={!props.rule.field}
      >
        NOT
      </Label>
      {showPicker && (
        <Select
          value={props.rule.expression}
          onChange={(e) => updateExpression(e)}
          required
        >
          {expressionPickerOptions}
        </Select>
      )}
    </div>
  )
}
