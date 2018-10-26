let _target = null

class _Dep {
  constructor () {
    this.subscribers = []
  }
  depend () {
    if (_target && !this.subscribers.includes(_target)) {
      this.subscribers.push(_target)
    }
  }
  notify () {
    this.subscribers.forEach(sub => sub())
  }
}

const beReactive = (vals, index = undefined) => {
  if (index) {
    if (vals !== null && typeof vals[index] === 'object') {
      Object.keys(vals[index]).forEach(key => {
        beReactive(vals[index], key)
      })
    } else if (vals[index] !== 'undefined') {
      _setReactivityForValue(vals, index)
    }
  } else {
    if (vals !== null && typeof vals === 'object') {
      Object.keys(vals).forEach(key => {
        beReactive(vals, key)
      })
    } else if (vals !== 'undefined') {
      console.warn('Warning: variable has to be an object or array')
    }
  }
}

const _setReactivityForValue = (val, index) => {
  let _value = val[index]
  const dep = new _Dep()
  Object.defineProperty(val, index, {
    set (newVal) {
      _value = newVal
      dep.notify()
    },
    get () {
      dep.depend()
      return _value
    }
  })
}

const setWatcher = (func) => {
  _target = func
  _target()
  _target = null
}

module.exports = { beReactive, setWatcher }
