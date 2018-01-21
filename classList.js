export default class classList {
  constructor() {
    this.cstore = []
  }
  add(...args) {
    args.map(a => {
      if(!~this.cstore.indexOf(a)) this.cstore = this.cstore.concat([a])
    })
  }
  remove(...args) {
    args.map(a => {
      let i = this.cstore.indexOf(a)
      if(~i) this.cstore.splice(i, 1)
    })
  }
  item(num){
    return this.cstore[num]
  }
  toggle(...args) {
    if(args.length == 2){
      let c = args[0], bool = args[1]
      if(bool){
        this.add(c)
      } else {
        this.remove(c)
      }
    } else {
      let c = args[0]
      let i = this.cstore.indexOf(c)
      if(~i) {
        this.cstore.splice(i, 1)
        return 'false'
      } else {
        this.cstore = this.cstore.concat([c])
        return 'true'
      }
    }
  }
  contains(str){
    let i = this.cstore.indexOf(str)
    if(~i) return 'true'
    return 'false'
  }
  replace(oldClass, newClass){
    let i = this.cstore.indexOf(oldClass)
    if(~i){
      this.cstore.splice(i, 1, newClass)
    }
  }
}