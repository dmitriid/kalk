import * as React from 'react'
import Button from './ui/Button'
import {Operations} from '../type-definitions/kalk'
import kalkStore from '../stores/kalkStore'
import {observer} from 'mobx-react'

document.addEventListener('keydown', (e : KeyboardEvent) => {
  //e.preventDefault()

  const charToOp = {
    '+': Operations.ADD,
    '-': Operations.SUBTRACT,
    '*': Operations.MULTIPLY,
    '/': Operations.DIVIDE,
    '=': Operations.AGGREGATE,
    '%': Operations.PERCENT,
    'Enter': Operations.AGGREGATE,
    'Esc': Operations.CLEAR,
    'Escape': Operations.CLEAR,
    'Backspace': Operations.DELETE,
    'Delete': Operations.DELETE
  } as { [char : string] : Operations }

  if (!isNaN(Number(e.key))) {
    kalkStore.executeOperation(Operations.INPUT_NUMBER, e.key)
  } else if (e.key === ',' || e.key === '.') {
    kalkStore.executeOperation(Operations.INPUT_NUMBER, '.')
  } else {
    const op = charToOp[e.key]

    if (typeof op !== 'undefined') {
      kalkStore.executeOperation(op, null)
    }
  }
})

export default observer(() => {
  return <div className='flex h-screen w-screen content-center justify-center'>
    <div className='flex flex-col content-center justify-center'>
      <div
        className='w-full text-right py-4 px-2 text-5xl bg-black text-white overflow-hidden'>
        {kalkStore.displayValue}
      </div>
      <div className='flex text-2xl text-white bg-black p-1'>
        <div className='flex flex-col'>
          <div className='flex'>
            <Button operation={Operations.CLEAR}
                    display='C'
                    colorScheme='sys'/>
            <Button operation={Operations.SIGN_CHANGE}
                    display='±'
                    colorScheme='sys'/>
            <Button operation={Operations.PERCENT}
                    display='%'
                    colorScheme='sys'/>
          </div>
          <div className='flex'>
            <Button operation={Operations.INPUT_NUMBER}
                    display='7'
                    value={7}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='8'
                    value={8}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='9'
                    value={9}
                    colorScheme='numbers'/>
          </div>
          <div className='flex'>
            <Button operation={Operations.INPUT_NUMBER}
                    display='4'
                    value={4}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='5'
                    value={5}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='6'
                    value={6}
                    colorScheme='numbers'/>
          </div>
          <div className='flex'>
            <Button operation={Operations.INPUT_NUMBER}
                    display='1'
                    value={1}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='2'
                    value={2}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='3'
                    value={3}
                    colorScheme='numbers'/>
          </div>
          <div className='flex justify-between'>
            <Button operation={Operations.INPUT_NUMBER}
                    display='0'
                    value={0}
                    large={true}
                    colorScheme='numbers'/>
            <Button operation={Operations.INPUT_NUMBER}
                    display='.'
                    value='.'
                    colorScheme='numbers'/>
          </div>
        </div>
        <div className='flex flex-col'>
          <Button operation={Operations.DIVIDE}
                  display='÷'
                  colorScheme='ops'/>
          <Button operation={Operations.MULTIPLY}
                  display='✕'
                  colorScheme='ops'/>
          <Button operation={Operations.SUBTRACT}
                  display='—'
                  colorScheme='ops'/>
          <Button operation={Operations.ADD}
                  display='+'
                  colorScheme='ops'/>
          <Button operation={Operations.AGGREGATE}
                  display='='
                  colorScheme='ops'/>
        </div>
      </div>
    </div>
  </div>
})
