import { useState } from 'react'

import './App.scss'
import type { Group } from '@/components/expressions2/types'
import GroupEditor from '@/components/expressions2/GroupEditor'
import {
  defaultGroup,
  getGroupExpression
} from './components/expressions2/utils'

function App() {
  const [root, updateRoot] = useState<Group>(defaultGroup())

  return (
    <>
      <h1 className="my-5 text-2xl font-bold text-left">Expression builder</h1>
      <GroupEditor
        group={root}
        onUpdate={(root: Group) => {
          updateRoot(root)
        }}
      />
      <hr className="my-5" />
      <div className="font-mono text-left whitespace-pre">{getGroupExpression(root)}</div>
    </>
  )
}

export default App
