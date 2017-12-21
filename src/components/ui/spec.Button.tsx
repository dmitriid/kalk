import * as React from 'react'
import {configure, mount} from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'


configure({adapter: new Adapter()})

import {Operations} from '../../type-definitions/kalk'
import Button, {classNames, ColorSchemes} from './Button'
import {KalkStore} from '../../stores/kalkStore'

beforeEach(() => {
  this.kalkStore    = new KalkStore()
  this.add_button   = mount(
    <Button operation={Operations.ADD}
            display='+'
            colorScheme='sys'
            kalkStore={this.kalkStore}
    />
  )
  this.input_button = mount(
    <Button operation={Operations.INPUT_NUMBER}
            display='1'
            value={1}
            colorScheme='numbers'
            kalkStore={this.kalkStore}
    />
  )
})

afterEach(() => {
  this.add_button.unmount()
  this.input_button.unmount()
})

it('displays its display name', () => {
  const button = this.add_button.find('button')

  expect(button.text()).toBe('+')
})

describe('button size', () => {
  it('large button is large', () => {
    let a_button = mount(
      <Button operation={Operations.ADD}
              display='+'
              colorScheme='sys'
              large={true}
              kalkStore={this.kalkStore}
      />
    )
    const button = a_button.find('button').getDOMNode()

    expect(button.classList.contains('flex-grow')).toBe(true)
    expect(button.classList.contains('w-16')).toBe(false)

    a_button.unmount()
  })
  it('small button is small', () => {
    let a_button = mount(
      <Button operation={Operations.ADD}
              display='+'
              colorScheme='sys'
              large={false}
              kalkStore={this.kalkStore}
      />
    )
    const button = a_button.find('button').getDOMNode()

    expect(button.classList.contains('flex-grow')).toBe(false)
    expect(button.classList.contains('w-16')).toBe(true)

    a_button.unmount()
  })
})

it('it triggers a proper action', () => {
  let button = this.add_button.find('button')
  button.simulate('click')

  expect(this.kalkStore.lastOperation.op).toBe(Operations.ADD)

  button = this.input_button.find('button')
  button.simulate('click')

  expect(this.kalkStore.lastOperation.op).toBe(Operations.INPUT_NUMBER)
  expect(this.kalkStore.lastOperation.value).toBe(1)
})


it('uses proper classes based on colorscheme', () => {
  Object.keys(classNames).forEach((key : ColorSchemes) => {
    let a_button = mount(
      <Button operation={Operations.ADD}
              display='+'
              colorScheme={key}
              large={false}
              kalkStore={this.kalkStore}
      />
    )
    const button = a_button.find('button').getDOMNode()

    classNames[key].default.split(' ').forEach((cls) => {
      expect(button.classList.contains(cls)).toBe(true)
    })

    this.kalkStore.executeOperation(Operations.ADD, null)

    classNames[key].active.split(' ').forEach((cls) => {
      expect(button.classList.contains(cls)).toBe(true)
    })

    a_button.unmount()
    this.kalkStore.executeOperation(Operations.CLEAR, null)
  })
})
