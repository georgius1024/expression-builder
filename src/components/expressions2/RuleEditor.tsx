import { ReactElement, ChangeEvent, ReactNode } from 'react'
import classNames from 'classnames'
import { Select, Dropdown } from 'flowbite-react'

import ExpressionPicker from '@/components/expressions2/editors/ExpressionPicker'
import SingleValueInput from './editors/SingleValueInput'
import SingleValueSelect from './editors/SingleValueSelect'
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
  categoryName,
  customerCategories,
  productCategories,
  productSkuList,
  deliveryTypeList,
  paymentTypeList
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
    switch (props.rule.field) {
      case 'name':
      case 'country':
      case 'manufacturer':
        return (
          <SingleValueInput
            rule={props.rule}
            onUpdate={props.onUpdate}
            inputType="text"
          />
        )
      case 'salesLastMonth':
      case 'price':
      case 'amount':
        return (
          <SingleValueInput
            rule={props.rule}
            onUpdate={props.onUpdate}
            inputType="number"
          />
        )
      case 'category':
        return (
          <SingleValueSelect
            rule={props.rule}
            onUpdate={props.onUpdate}
            options={
              props.rule.category === 'customer'
                ? customerCategories()
                : productCategories()
            }
          />
        )
      case 'sku':
        return (
          <SingleValueSelect
            rule={props.rule}
            onUpdate={props.onUpdate}
            options={productSkuList()}
          />
        )
      case 'deliveryType':
        return (
          <SingleValueSelect
            rule={props.rule}
            onUpdate={props.onUpdate}
            options={deliveryTypeList()}
          />
        )
      case 'paymentType':
        return (
          <SingleValueSelect
            rule={props.rule}
            onUpdate={props.onUpdate}
            options={paymentTypeList()}
          />
        )
    }
    return 'the editor'
  }
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
        {(['customer', 'product', 'order'] as Category[]).map((c) => (
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
    </div>
  )
}
