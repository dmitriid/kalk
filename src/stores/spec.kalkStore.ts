import {IKalkStore, KalkStore} from './kalkStore'
import {Operations} from '../type-definitions/kalk'

beforeEach(() => {
  this.kalkStore = new KalkStore()
})

afterEach(() => {
  this.kalkStore = null
})

describe('Inital values', () => {
  it('initial display is 0', () => {
    expect(this.kalkStore.displayValue).toBe('0')
  })

  it('initial last op is undefined', () => {
    const {op, value} = this.kalkStore.lastOperation
    expect(op).toBe(Operations.UNDEFINED)
    expect(value).toBe(null)
  })
})

describe('Basic ops from initial value', () => {
  it('+ 1 is 1', () => {
    this.kalkStore.executeOperation(Operations.ADD, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('1')
  })
  it('- 1 is -1', () => {
    this.kalkStore.executeOperation(Operations.SUBTRACT, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('-1')
  })
  it('* 1 is 0', () => {
    this.kalkStore.executeOperation(Operations.MULTIPLY, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('0')
  })
  it('/ 1 is 0', () => {
    this.kalkStore.executeOperation(Operations.DIVIDE, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('0')
  })
})

describe('Basic ops', () => {
  it('1 + 1 is 2', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.ADD, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('2')
  })
  it('3 - 2 is 1', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 3)
    this.kalkStore.executeOperation(Operations.SUBTRACT, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('1')
  })
  it('3 * 2 is 6', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 3)
    this.kalkStore.executeOperation(Operations.MULTIPLY, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('6')
  })
  it('8 / 4 is 2', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 8)
    this.kalkStore.executeOperation(Operations.DIVIDE, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 4)
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('2')
  })
})

describe('Fukken percents', () => {
  it('10 + 2% is 10.2', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 0)
    this.kalkStore.executeOperation(Operations.ADD, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.PERCENT, null)
    expect(this.kalkStore.displayValue).toBe('0.2')
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('10.2')
  })
  it('10 - 2% is 9.8', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 0)
    this.kalkStore.executeOperation(Operations.SUBTRACT, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.PERCENT, null)
    expect(this.kalkStore.displayValue).toBe('0.2')
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('9.8')
  })
  it('10 * 2% is 0.2', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 0)
    this.kalkStore.executeOperation(Operations.MULTIPLY, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.PERCENT, null)
    expect(this.kalkStore.displayValue).toBe('0.02')
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('0.2')
  })
  it('10 / 2% is 500', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 0)
    this.kalkStore.executeOperation(Operations.DIVIDE, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.PERCENT, null)
    expect(this.kalkStore.displayValue).toBe('0.02')
    this.kalkStore.executeOperation(Operations.AGGREGATE, null)
    expect(this.kalkStore.displayValue).toBe('500')
  })
})

describe('Miscellaneous actions', () => {
  it('Clear should clear', () => {
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 1)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 0)
    this.kalkStore.executeOperation(Operations.ADD, null)
    this.kalkStore.executeOperation(Operations.INPUT_NUMBER, 2)
    this.kalkStore.executeOperation(Operations.PERCENT, null)

    this.kalkStore.executeOperation(Operations.CLEAR, null)
    expect(this.kalkStore.displayValue).toBe('0')
    const {op, value} = this.kalkStore.lastOperation
    expect(op).toBe(Operations.CLEAR)
    expect(value).toBe(null)
  })
})
