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

const beReactive = (vals) => {
  return _setReactivityForValue(vals)
}

const _constructDeps = (vals) => {
  if (vals !== null && typeof vals === 'object') {
    let tempDeps = {}
    Object.keys(vals).forEach(key => {
      tempDeps[key] = _constructDeps(vals[key])
    })
    return tempDeps
  }
  if (vals !== 'undefined') {
    return new _Dep()
  }
}

const _setReactivityForValue = (val) => {
  let _deps = _constructDeps(val)

  let validator = (varPath = []) => {
    return {
      get (obj, key) {
        let __path = varPath.slice()
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          __path.push(key)
          return new Proxy(obj[key], validator(__path))
        } else {
          let currentDep = _deps
          __path.forEach(tempPath => currentDep = currentDep[tempPath])
          if(currentDep[key]) {
            currentDep[key].depend()
            return obj[key]
          } else {
            return obj[key]
          }
        }
      },
        set (obj, key, newVal) {
          let __path = varPath.slice()
          obj[key] = newVal
          let currentDep = _deps
          __path.forEach(tempPath => currentDep = currentDep[tempPath])
          if(currentDep[key]) {
            currentDep[key].notify()
          }
          return true
      }
    }
  }
  return new Proxy(val, validator([]))
}

const setWatcher = (func) => {
  _target = func
  _target()
  _target = null
}

module.exports = { beReactive, setWatcher }
