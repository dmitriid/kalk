import {action, computed, observable} from 'mobx'
import {KalkNumber, Operations} from '../type-definitions/kalk'
import MobXClock from '../utils/mobx-clock'

export interface IKalkStore {
  displayValue : string,
  lastOperation : { op : Operations, value : any, timestamp : number },
  executeOperation : (op : Operations, value : any) => void
}

class KalkStore implements IKalkStore {
  /* ---- fields and shit ---- */
  @observable
  private _isInitState = true

  @observable
  private _aggregateValue : number = 0

  @observable
  private _numberStack : string[] = ['0']

  @observable
  private _operationsStack : Operations[] = []

  @observable
  private _currentState : Operations = Operations.INPUT_NUMBER

  @observable
  private _lastOperation : { op : Operations, value : any, timestamp : number } = {
    op: Operations.UNDEFINED,
    value: null,
    timestamp: +new Date()
  }

  private _actionMap = {
    [Operations.ADD]: (x, y) => x + y,
    [Operations.SUBTRACT]: (x, y) => x - y,
    [Operations.MULTIPLY]: (x, y) => x * y,
    [Operations.DIVIDE]: (x, y) => x / y,
  } as { [op : string] : (x : number, y : number) => number }

  /* ---- public API ---- */

  @computed
  public get displayValue() {
    const value = (this._numberStack.length === 0 ? this._aggregateValue : this._numberStack.join('')).toString()

    if (value.length > 8) {
      return `…${value.substr(value.length - 8)}`
    }

    return value
  }

  @computed
  public get lastOperation() {
    const timestamp = +MobXClock.getTime()
    if (this._lastOperation.timestamp - timestamp < -200) {
      return {...this._lastOperation, op: Operations.UNDEFINED}
    }

    return this._lastOperation
  }

  @action
  public executeOperation(op : Operations, value : any) {
    switch (op) {
      case Operations.INPUT_NUMBER:
        if (this._numberStack.length === 1 && parseInt(this._numberStack[0]) === 0) {
          this._numberStack = [value]
        } else {
          if (value === '.' && this._numberStack.indexOf('.') !== -1) {
            return
          }
          this._numberStack.push(value)
        }
        if (this._isInitState) {
          this._aggregateValue = Number(this._numberStack.join(''))
          this.checkNaN()
        }
        break
      case Operations.DELETE:
        if (this._numberStack.length === 1) {
          this._numberStack = ['0']
        } else {
          this._numberStack.pop()
        }
        if (this._isInitState) {
          this._aggregateValue = Number(this._numberStack.join(''))
          this.checkNaN()
        }
        break
      case Operations.CLEAR:
        this._numberStack     = ['0']
        this._operationsStack = []
        this._isInitState     = true
        this._aggregateValue  = 0
        break
      case Operations.AGGREGATE:
        this.executeCurrentOperation()
        this._operationsStack = []
        this._numberStack     = []
        this._isInitState     = true
        break
      case Operations.SIGN_CHANGE:
        if (this._numberStack.length) {
          if (this._numberStack[0] === '-') {
            this._numberStack.shift()
          } else {
            this._numberStack.unshift('-')
          }
        } else {
          this._aggregateValue = -this._aggregateValue
          this._numberStack    = this._aggregateValue.toString().split('')
        }
        if (this._isInitState) {
          this._aggregateValue = Number(this._numberStack.join(''))
          this.checkNaN()
        }
        break
      case Operations.PERCENT:
        if (this._numberStack.length > 0) {
          const value = Number(this._numberStack.join(''))

          if (isNaN(value)) {
            return
          }

          const percent     = this.calculatePercent(value, this._aggregateValue)
          this._numberStack = percent.toString().split('')

          this.executeOperation(Operations.AGGREGATE, null)
        } else {
          this._operationsStack.push(op)
        }
        break
      default:
        this.executeCurrentOperation()
        this._operationsStack.push(op)
        this._isInitState = false
        this._numberStack = []
    }
    this._lastOperation = {op, value, timestamp: +new Date()}
  }

  /* ---- internal operations ---- */

  private executeCurrentOperation() {
    if (this._operationsStack.length === 0) {
      return
    }

    let number = Number(this._numberStack.join(''))

    const op = this._operationsStack.pop()

    if (op === Operations.PERCENT) {
      number            = this.calculatePercent(number, this._aggregateValue)
      this._numberStack = number.toString().split('')

      this.executeCurrentOperation()
      return
    }

    this._aggregateValue = this._actionMap[op](this._aggregateValue, number)
    this.checkNaN()
  }

  private calculatePercent(pct : number, ofValue : number) {
    let percent = pct / 100

    if (this._operationsStack.length > 0) {
      const _currentOp = this._operationsStack[this._operationsStack.length - 1]

      if (_currentOp === Operations.ADD || _currentOp === Operations.SUBTRACT) {
        percent = percent * ofValue
      }
    }

    return percent
  }

  private checkNaN() {
    if (isNaN(this._aggregateValue)) {
      this._aggregateValue = 0
    }
  }
}

export default new KalkStore()
