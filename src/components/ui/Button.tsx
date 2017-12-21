import * as React from 'react'
import kalkStore, {IKalkStore} from '../../stores/kalkStore'
import {KalkNumber, Operations} from '../../type-definitions/kalk'
import {inject, observer} from 'mobx-react'

export type ColorSchemes = 'ops' | 'numbers' | 'sys'

export interface ButtonProps {
  operation : Operations,
  display : string,
  value? : KalkNumber,
  large? : boolean,
  colorScheme : ColorSchemes
}

const defaultProps : ButtonProps = {
  operation: Operations.ADD,
  display: '+',
  large: false,
  colorScheme: 'numbers',
  value: null
}

const classNames = {
  'ops': {
    default: 'bg-orange hover:bg-orange-light text-white',
    active: 'bg-orange-light text-white'
  },
  'numbers': {
    default: 'bg-grey-dark hover:bg-grey-darker text-white',
    active: 'bg-grey-darker text-white'
  },
  'sys': {
    default: 'bg-grey-lighter hover:bg-grey hover:text-white text-black',
    active: 'bg-grey text-white'
  }
} as {
  [scheme : string] : {
    default : string,
    active : string
  }
}

export default observer((props : ButtonProps & { kalkStore? : IKalkStore }) => {
  const actualProps = {...defaultProps, ...props}

  const {op, value} = kalkStore.lastOperation

  let cls = classNames[actualProps.colorScheme].default
  if (op === actualProps.operation && (value === actualProps.value || Number(value) === actualProps.value)) {
    cls = classNames[actualProps.colorScheme].active
  }

  cls = `${cls} rounded-full ${actualProps.large ? 'flex-grow' : 'w-16'} h-16 m-1`

  return <button
    className={cls}
    onClick={() => kalkStore.executeOperation(actualProps.operation, actualProps.value)}>
    {actualProps.display}
  </button>
})
