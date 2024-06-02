import { ReactElement, ChangeEvent, ReactNode } from 'react'
import classNames from 'classnames'
import { Select, Dropdown } from 'flowbite-react'

import ExpressionPicker from '@/components/expressions2/editors/ExpressionPicker'

import type {
  Category,
  Rule,
  UpdateRuleEvent
} from '@/components/expressions2/types'
import {
  fieldsList,
  fieldLabel,
  withDefaults,
  categoryIcon,
  categoryName
} from '@/components/expressions2/utils'

type RuleEditorProps = {
  rule: Rule
  onUpdate: UpdateRuleEvent
  className?: string
}

export default function RuleEditor(props: RuleEditorProps): ReactElement {
  const updateCategory = (category: Category) => {
    props.onUpdate(
      withDefaults({
        ...props.rule,
        category,
        field: '',
        expression: '',
        value: ''
      })
    )
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

  const fieldPickerOptions = fieldsList(props.rule.category).map((field) => (
    <option value={field} key={field}>
      {fieldLabel(field)}
    </option>
  ))

  const editor = (): ReactNode => {
    return 'the editor'
  }
  // const inverse = () => {
  //   props.onUpdate({ ...props.rule, not: !props.rule.not })
  // }

  // const expressionPickerOptions = expressionsList(props.rule.field).map(
  //   (expression) => (
  //     <option value={expression} key={expression}>
  //       {expressionLabel(expression)}
  //     </option>
  //   )
  // )
  // const valueInputType = valueType(props.rule.field, props.rule.expression)

  // const buildInputPickerOptions = () =>
  //   Array.isArray(valueInputType) &&
  //   valueInputType.map((e) => (
  //     <option value={e} key={e}>
  //       {e}
  //     </option>
  //   ))
  return (
    <div
      className={classNames(
        'flex flex-row items-center gap-2',
        'rounded-md border-s-2 border-solid border-gray-500 py-1 ps-2',
        props.className
      )}
    >
      <Dropdown
        label=""
        renderTrigger={() => (
          <div className="flex select-none place-content-center rounded-full border border-solid border-gray-300 p-2">
            <img
              src={categoryIcon(props.rule.category)}
              className="size-5"
              alt=""
            />
          </div>
        )}
      >
        {(['customer', 'product'] as Category[]).map((c) => (
          <Dropdown.Item onClick={() => updateCategory(c)}>
            <div className="flex flex-row items-center gap-2">
              <img src={categoryIcon(c)} className="size-4" />
              {categoryName(c)}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown>

      <Select
        value={props.rule.field}
        onChange={(e) => updateField('field', e)}
        required
      >
        {fieldPickerOptions}
      </Select>
      {props.rule.field && (
        <ExpressionPicker rule={props.rule} onUpdate={props.onUpdate} />
      )}
      {editor()}
      {/* <div className="flex items-center gap-2">
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
      )} */}
    </div>
  )
}
