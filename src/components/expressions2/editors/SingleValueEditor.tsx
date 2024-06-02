import { ReactElement, ChangeEvent } from 'react'
import classNames from 'classnames'
import { Select, TextInput, Checkbox, Label, Dropdown } from 'flowbite-react'

import type {
  Rule,
  UpdateRuleEvent
} from '@/components/expressions2/types'

import {
  fieldsList,
  fieldLabel,
  expressionsList,
  expressionLabel,
  withDefaults
} from '@/components/expressions2/utils'

type ValueType = "string" | "number"

type SingleValueEditorProps = {
  rule: Rule
  valueType: ValueType
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function SingleValueEditor(props: SingleValueEditorProps): ReactElement {

  const updateField = (
    field: 'field' | 'expression' | 'value',
    e: ChangeEvent
  ) => {
    const value = (e.target as HTMLInputElement).value
    if (field === 'field') {
      props.onUpdate(
        withDefaults({ ...props.rule, field: value, expression: '', value: '' })
      )
    } else if (field === 'expression') {
      props.onUpdate(
        withDefaults({ ...props.rule, expression: value, value: '' })
      )
    } else {
      props.onUpdate({ ...props.rule, [field]: value })
    }
  }

  const inverse = () => {
    props.onUpdate({ ...props.rule, not: !props.rule.not })
  }

  const fieldPickerOptions = fieldsList(props.rule.category).map((field) => (
    <option value={field} key={field}>
      {fieldLabel(field)}
    </option>
  ))

  const expressionPickerOptions = expressionsList(props.rule.field).map(
    (expression) => (
      <option value={expression} key={expression}>
        {expressionLabel(expression)}
      </option>
    )
  )

  return (
    <div
      className={classNames(
        'flex flex-row items-center gap-2',
        'rounded-md border-s-2 border-solid border-gray-500 ps-2 py-1',
        props.className
      )}
    >
      <Select
        value={props.rule.field}
        onChange={(e) => updateField('field', e)}
        className="w-1/3"
        required
      >
        {fieldPickerOptions}
      </Select>
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
      </div>
      <Select
        disabled={!props.rule.field}
        value={props.rule.expression}
        onChange={(e) => updateField('expression', e)}
        className="w-1/3"
        required
      >
        {expressionPickerOptions}
      </Select>
      {(valueInputType === 'text' || valueInputType === 'number') && (
        <TextInput
          disabled={!props.rule.expression}
          className="grow"
          type={valueInputType}
          placeholder={
            props.rule.expression && expressionLabel(props.rule.expression)
          }
          required
          value={String(props.rule.value)}
          onChange={(e) => updateField('value', e)}
        />
      )}
      {Array.isArray(valueInputType) && (
        <Select
          disabled={!props.rule.expression}
          onChange={(e) => updateField('value', e)}
          className="grow"
          required
        >
          {buildInputPickerOptions()}
        </Select>
      )}
    </div>
  )
}
