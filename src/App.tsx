import { useState } from 'react'

import './App.scss'
import type { Group } from '@/components/expressions2/types'
import GroupEditor from '@/components/expressions2/GroupEditor'
import { getGroupExpression } from './components/expressions2/utils'

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
function App() {
  const [root, updateRoot] = useState<Group>(defaultValue)

  return (
    <>
      <h1 className="my-5 text-left text-2xl font-bold">Expression builder</h1>
      <GroupEditor
        group={root}
        onUpdate={(root: Group) => {
          updateRoot(root)
        }}
      />
      <hr className="my-5" />
      <h2 className="text-left text-xl font-bold">SQL output will be like</h2>
      <div className="font-mono whitespace-pre-wrap text-left">
        {getGroupExpression(root)}
      </div>
    </>
  )
}

export default App
