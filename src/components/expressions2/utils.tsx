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
import orderIcon from '@assets/icons/order.svg'

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
    case 'order':
      return orderIcon
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
    case 'order':
      return 'Order'
    default:
      return ucFirst(category)
  }
}

export function fieldsList(category: Category): Field[] {
  if (category === 'customer')
    return ['name', 'category', 'country', 'salesLastMonth']
  if (category === 'product')
    return ['name', 'price', 'manufacturer', 'category', 'sku']
  if (category === 'order') return ['amount', 'deliveryType', 'paymentType']
  return []
}

export function fieldLabel(field: Field): string | undefined {
  switch (field) {
    case 'salesLastMonth':
      return 'Last month sales'
    case 'deliveryType':
      return 'Delivery'
    case 'paymentType':
      return 'Payment'
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
    case 'manufacturer':
      return ['=', '^=', '$=', '*=']
    case 'category':
    case 'sku':
    case 'paymentType':
    case 'deliveryType':
      return ['is']
    case 'age':
    case 'salesLastMonth':
    case 'amount':
      return ['=', '>', '<']
  }
  return []
}

export function customerCategories(): string[] {
  return ['Loyal', 'New', 'Valuable', 'Active', 'At risk']
}

export function productCategories(): string[] {
  return ['Manufactiring', 'Logistic', 'Medical', 'Service', 'Educational']
}

export function productSkuList(): string[] {
  return ['ABC-124', 'DEF-321', 'IJK-853']
}

export function deliveryTypeList(): string[] {
  return ['Standard', 'Priority', 'Overnight', 'Pick-up']
}

export function paymentTypeList(): string[] {
  return ['Cash', 'Bank', 'Card', 'Credit']
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

export function getRulePrefixedField(rule: Rule): string {
  return `${rule.category}.${rule.field}`
}

export function getRuleExpression(rule: Rule): string {
  if (rule.field && rule.expression && rule.value) {
    const getDirectExpession = (): string => {
      const useQuotesOnValue =
        valueType(rule.field, rule.expression) === 'text' ||
        Array.isArray(valueType(rule.field, rule.expression))
      const value = useQuotesOnValue ? `"${rule.value}"` : rule.value
      const field = getRulePrefixedField(rule)
      switch (rule.expression) {
        case '=':
        case '<':
        case '>':
        default:
          return `${field} ${rule.expression} ${value}`
        case 'is':
          return `${field} = ${value}`
        case '^=':
          return `${field} like "${rule.value}%"`
        case '$=':
          return `${field} like "%${rule.value}"`
        case '*=':
          return `${field} like "%${rule.value}%"`
      }
    }
    if (rule.not) {
      return `not (${getDirectExpession()})`
    } else return getDirectExpession()
  }
  return '?'
}

export function getGroupExpression(group: Group, level: number = 0): string {
  const pad = ' '.repeat(level * 2)
  return [
    ...group.entries.map((e, index, list) => {
      const isLast = index === list.length - 1

      const expression =
        e.type === 'rule' ? `${getRuleExpression(e)}` : `(${getGroupExpression(e, level)})`
      if (isLast) {
        return `${pad}${expression}`
      }
      if (e.operator === 'and') {
        return `${pad}${expression} ${e.operator} `
      }
      //const operator = e.operator === 'or' ? `${e.operator}\n` : e.operator
      return `${pad}${expression}
      ${pad}${e.operator}\n`
    })
  ].join('')
}

export function defaultField(category: Category): Field {
  const [rule] = fieldsList(category)
  return rule
}

export function defaultExpression(
  category: Category,
  field: Field
): Expression {
  const [expresion] = expressionsList(category, field)
  return expresion
}

export function defaultValue(
  category: Category,
  field: Field,
  expresion: Expression
): Value {
  if (field === 'category') {
    const [first] =
      category === 'customer' ? customerCategories() : productCategories()
    return first
  }
  if (field === 'sku') {
    const [first] = productSkuList()
    return first
  }
  if (field === 'deliveryType') {
    const [first] = deliveryTypeList()
    return first
  }
  if (field === 'paymentType') {
    const [first] = deliveryTypeList()
    return first
  }
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
  const selectedValue = defaultValue(
    selectedCategory,
    selectedField,
    selectedExpression
  )
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
