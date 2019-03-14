import stringHash from 'string-hash'

class Store{
  constructor(){
    this._ = {}
    this.gen = this.gen.bind(this)
    this.ret = this.ret.bind(this)
  }

  gen(ref){
    let id = stringHash(ref.toString())
    this._[id] = {}
    return id
  }
  ret(id, selector, data){
    if(data){
      this._[id][selector] = data
    }
    return this._[id][selector] || null
  }
}

const store = new Store()

export default store