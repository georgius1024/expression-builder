import type {
  Rule,
  Field,
  Expression,
  Group,
  Category,
  Value
} from '@/components/expressions2/types'

import { nanoid } from 'nanoid'

export function fieldsList(category: Category, withEmpty?: boolean): Field[] {
  if (category === 'user')
    return ['name', 'country', 'gender', 'age', ''].filter(
      (e) => withEmpty || e
    )
  return ['URL', 'source', 'campaign', 'event', ''].filter(
    (e) => withEmpty || e
  )
}

export function fieldLabel(field: Field): string | undefined {
  switch (field) {
    case 'name':
      return 'Name'
    case 'country':
      return 'Country'
    case 'gender':
      return 'Gender'
    case 'age':
      return 'Age'
    case 'URL':
      return 'Page URL'
    case 'source':
      return 'UTM source'
    case 'campaign':
      return 'UTM campaign'
    case 'event':
      return 'Event'
  }
  return 'Field'
}

export function expressionsList(
  field: Field,
  withEmpty?: boolean
): Expression[] {
  switch (field) {
    case 'name':
    case 'country':
    case 'URL':
    case 'source':
    case 'campaign':
      return ['=', '^=', '$=', '*=', ''].filter((e) => withEmpty || e)
    case 'gender':
    case 'event':
      return ['is', ''].filter((e) => withEmpty || e)
    case 'age':
      return ['=', '>', '<', ''].filter((e) => withEmpty || e)
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
  _expression: Expression
): 'text' | 'number' | string[] | undefined {
  switch (field) {
    case 'name':
    case 'country':
    case 'URL':
    case 'source':
    case 'campaign':
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

export function defaultExpression(field: Field): Expression {
  const [expresion] = expressionsList(field)
  return expresion
}

export function defaultValue(field: Field, expresion: Expression): Value {
  const valueInputType = valueType(field, expresion)
  if (Array.isArray(valueInputType)) return valueInputType[0]
  return valueInputType === 'number' ? 0 : ''
}

export function withDefaults(incomplete: Rule): Rule {
  const category = incomplete.category || 'user'
  const field = incomplete.field || defaultField(category)
  const expression = incomplete.expression || defaultExpression(field)
  const value = incomplete.value || defaultValue(field, expression)
  return { ...incomplete, category, field, expression, value }
}

export function defaultRule(category?: Category): Rule {
  const selectedCategory = category ?? 'user'
  const selectedField = defaultField(selectedCategory)
  const selectedExpression = defaultExpression(selectedField)
  const selectedValue = defaultValue(selectedField, selectedExpression)
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
