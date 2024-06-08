import type { Group } from '@/components/expressions2/types'

const defaultValue: Group = {
  id: 'root',
  type: 'group',
  operator: 'and',
  entries: [
    {
      id: 'customer',
      type: 'group',
      operator: 'and',
      entries: [
        {
          category: 'customer',
          id: 'domestic',
          type: 'rule',
          operator: 'and',
          field: 'country',
          expression: '=',
          not: false,
          value: 'USA'
        },
        {
          category: 'customer',
          id: 'valuable',
          type: 'rule',
          operator: 'and',
          field: 'category',
          expression: 'is',
          not: false,
          value: 'Valuable'
        }
      ]
    },
    {
      id: 'product',
      type: 'group',
      operator: 'and',
      entries: [
        {
          category: 'product',
          id: 'price',
          type: 'rule',
          operator: 'and',
          field: 'price',
          expression: '>',
          not: false,
          value: 2000
        },
        {
          category: 'product',
          id: 'med',
          type: 'rule',
          operator: 'and',
          field: 'category',
          expression: 'is',
          not: true,
          value: 'Service'
        }
      ]
    },
    {
      id: 'order',
      type: 'group',
      operator: 'and',
      entries: [
        {
          category: 'order',
          id: 'amount',
          type: 'rule',
          operator: 'or',
          field: 'amount',
          expression: '>',
          not: false,
          value: 10000
        },
        {
          category: 'order',
          id: 'payment',
          type: 'rule',
          operator: 'and',
          field: 'paymentType',
          expression: 'is',
          not: true,
          value: 'Credit'
        }
      ]
    }
  ]
}

export default defaultValue