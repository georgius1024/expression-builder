import { ReactElement, ChangeEvent } from 'react'
import classNames from 'classnames'
import { Select, TextInput, Checkbox, Label, Dropdown } from 'flowbite-react'
import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'

import type {
  Category,
  Rule,
  UpdateRuleEvent
} from '@/components/expressions/types'
import {
  fieldsList,
  fieldLabel,
  expressionsList,
  expressionLabel,
  valueType,
  withDefaults
} from '@/components/expressions/utils'

type RuleEditorProps = {
  rule: Rule
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function RuleEditor(props: RuleEditorProps): ReactElement {
  const updateCategory = (category: Category) => {
    props.onUpdate({
      ...props.rule,
      category,
      field: '',
      expression: '',
      value: ''
    })
  }
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
  const valueInputType = valueType(props.rule.field, props.rule.expression)

  const buildInputPickerOptions = () =>
    Array.isArray(valueInputType) &&
    valueInputType.map((e) => (
      <option value={e} key={e}>
        {e}
      </option>
    ))
  return (
    <div
      className={classNames(
        'flex flex-row items-center gap-2',
        props.className
      )}
    >
      <Dropdown
        label=""
        renderTrigger={() => (
          <div className="icon-control flex place-content-center p-2">
            <img
              src={props.rule.category === 'event' ? eventIcon : userIcon}
              className="size-5"
              alt=""
            />
          </div>
        )}
      >
        <Dropdown.Item onClick={() => updateCategory('user')}>
          <div className="flex flex-row items-center gap-2">
            <img src={userIcon} className="size-4" />
            User
          </div>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => updateCategory('event')}>
          <div className="flex flex-row items-center gap-2">
            <img src={eventIcon} className="size-4" />
            Event
          </div>
        </Dropdown.Item>
      </Dropdown>

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
