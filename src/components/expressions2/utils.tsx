import type {
  Rule,
  Field,
  Expression,
  Group,
  Category,
  Value
} from '@/components/expressions2/types'

import { nanoid } from 'nanoid'
import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'
import productIcon from '@assets/icons/purse.svg'

function ucFirst(src: string): string {
  const [first, ...rest] = src
  return [first.toUpperCase(), ...rest].join('')
}
export function categoryIcon(category: Category): string {
  switch (category) {
    case 'customer':
      return userIcon
    case 'product':
      return productIcon
    default:
      return eventIcon
  }
}

export function categoryName(category: Category): string {
  switch (category) {
    case 'customer':
      return 'Customer'
    case 'product':
      return 'Product'
    default:
      return category
  }
}

export function fieldsList(category: Category): Field[] {
  if (category === 'customer') return ['category', 'country', 'salesLastMonth']
  if (category === 'product')
    return ['name', 'price', 'manufacturer', 'category', 'sku']
  return ['URL', 'source', 'campaign', 'event', '']
}

export function fieldLabel(field: Field): string | undefined {
  switch (field) {
    case 'salesLastMonth':
      return 'Last month sales'
    case 'URL':
      return 'Page URL'
    case 'source':
      return 'UTM source'
    case 'campaign':
      return 'UTM campaign'
  }
  return ucFirst(field)
}

export function expressionsList(
  _category: Category,
  field: Field
): Expression[] {
  switch (field) {
    case 'name':
    case 'country':
    case 'URL':
    case 'source':
    case 'campaign':
      return ['=', '^=', '$=', '*=']
    case 'category':
      return ['is']
    case 'age':
      case 'salesLastMonth':
      return ['=', '>', '<']
  }
  return []
}

export function expressionLabel(expression: Expression): string {
  switch (expression) {
    case 'is':
      return 'Is'
    case '=':
      return 'Equal'
    case '<':
      return 'Less then'
    case '>':
      return 'Greater then'
    case '^=':
      return 'Begins with'
    case '$=':
      return 'Ends with'
    case '*=':
      return 'Contains'
    default:
      return 'Expression'
  }
}

export function valueType(
  field: Field,
  _expression?: Expression
): 'text' | 'number' | string[] | undefined {
  switch (field) {
    case 'name':
    case 'country':
    default:
      return 'text'
    case 'age':
      return 'number'
    case 'gender':
      return ['male', 'female', 'other']
    case 'event':
      return ['visited', 'purchased', 'abandoned']
  }
}

export function getRuleExpression(rule: Rule): string {
  if (rule.field && rule.expression && rule.value) {
    const getDirectExpession = (): string => {
      const useQuotesOnValue =
        valueType(rule.field, rule.expression) === 'text' ||
        Array.isArray(valueType(rule.field, rule.expression))
      const value = useQuotesOnValue ? `"${rule.value}"` : rule.value

      switch (rule.expression) {
        case '=':
        case '<':
        case '>':
        default:
          return `${rule.field} ${rule.expression} ${value}`
        case 'is':
          return `${rule.field} = ${value}`
        case '^=':
          return `${rule.field} like "${rule.value}%"`
        case '$=':
          return `${rule.field} like "%${rule.value}"`
        case '*=':
          return `${rule.field} like "%${rule.value}%"`
      }
    }
    if (rule.not) {
      return `not (${getDirectExpession()})`
    } else return getDirectExpession()
  }
  return '?'
}

export function getGroupExpression(group: Group): string {
  return [
    ...group.entries.map((e, index, list) => {
      const isLast = index === list.length - 1

      const expression =
        e.type === 'rule' ? getRuleExpression(e) : getGroupExpression(e)
      if (isLast) {
        return `(${expression})`
      }
      return `(${expression}) ${e.operator}`
    })
  ].join(' ')
}

export function defaultField(category: Category): Field {
  const [rule] = fieldsList(category)
  return rule
}

export function defaultExpression(category: Category, field: Field): Expression {
  const [expresion] = expressionsList(category, field)
  return expresion
}

export function defaultValue(_category: Category, field: Field, expresion: Expression): Value {
  const valueInputType = valueType(field, expresion)
  if (Array.isArray(valueInputType)) return valueInputType[0]
  return valueInputType === 'number' ? 0 : ''
}

export function withDefaults(incomplete: Rule): Rule {
  const category = incomplete.category || 'customer'
  const field = incomplete.field || defaultField(category)
  const expression = incomplete.expression || defaultExpression(category, field)
  const value = incomplete.value || defaultValue(category, field, expression)
  return { ...incomplete, category, field, expression, value }
}

export function defaultRule(category?: Category): Rule {
  const selectedCategory = category ?? 'customer'
  const selectedField = defaultField(selectedCategory)
  const selectedExpression = defaultExpression(selectedCategory, selectedField)
  const selectedValue = defaultValue(selectedCategory, selectedField, selectedExpression)
  return {
    type: 'rule',
    operator: 'and',
    category: selectedCategory,
    id: nanoid(),
    not: false,
    field: selectedField,
    expression: selectedExpression,
    value: selectedValue
  }
}

export function defaultGroup(): Group {
  return {
    type: 'group',
    operator: 'and',
    id: nanoid(),
    entries: [defaultRule()]
  }
}
