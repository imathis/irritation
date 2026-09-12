const memory = new Map()

const localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null
  },
  setItem(key, value) {
    memory.set(String(key), String(value))
  },
  removeItem(key) {
    memory.delete(String(key))
  },
  clear() {
    memory.clear()
  },
  key(index) {
    return [...memory.keys()][index] ?? null
  },
  get length() {
    return memory.size
  },
}

globalThis.localStorage = localStorage
globalThis.window = globalThis.window ?? {}
globalThis.window.localStorage = localStorage
