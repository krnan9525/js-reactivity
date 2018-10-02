let _target = null

class _Dep {
  constructor () {
    this._subscribers = []
  }
  depend () {
    if (_target && !this._subscribers.includes(_target)) {
      this._subscribers.push(_target)
    }
  }
  notify () {
    this._subscribers.forEach(sub => sub())
  }
}

const beReactive = (vals) => {
  return _setReactivityForValue(vals)
}

const setWatcher = (func) => {
  _target = func
  _target()
  _target = null
}

const _constructDeps = (vals) => {
  if (vals !== null && typeof vals === 'object') {
    let _tempDeps = {}
    Object.keys(vals).forEach(key => {
      _tempDeps[key] = _constructDeps(vals[key])
    })
    return _tempDeps
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
        let _path = varPath.slice()
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          _path.push(key)
          return new Proxy(obj[key], validator(_path))
        } else {
          let _currentDep = _deps
          _path.forEach(tempPath => _currentDep = _currentDep[tempPath])
          if(_currentDep[key]) {
            _currentDep[key].depend()
            return obj[key]
          } else {
            return obj[key]
          }
        }
      },
        set (obj, key, newVal) {
          let __path = varPath.slice()
          obj[key] = newVal
          let _currentDep = _deps
          __path.forEach(tempPath => _currentDep = _currentDep[tempPath])
          if(_currentDep[key]) {
            _currentDep[key].notify()
          }
          return true
      }
    }
  }
  return new Proxy(val, validator([]))
}

module.exports = { beReactive, setWatcher }
