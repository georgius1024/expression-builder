import { useState } from 'react'

import './App.scss'
import type { Group } from '@/components/expressions/types'
import GroupEditor from '@/components/expressions/GroupEditor'
import {
  defaultGroup,
  getGroupExpression
} from './components/expressions/utils'

function App() {
  const [root, updateRoot] = useState<Group>(defaultGroup())

  return (
    <>
      <h1 className="my-4 text-xl font-bold">Rules editor</h1>
      <GroupEditor
        group={root}
        onUpdate={(root: Group) => {
          updateRoot(root), console.log(root)
        }}
      />
      <hr className="my-5" />
      <div className="font-mono">{getGroupExpression(root)}</div>
    </>
  )
}

export default App
