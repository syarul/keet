// sample usage how to use array, with remove and insert
const keet = () => new Keet

const _name = ['Susan', 'Jonny', 'Sunny', 'Robert', 'Tai']
const _age = [12, 32, 2, 55, 22]
let arr = []

let newPerson = {}

const changeAge = v => newPerson.age = v

const changeName = v => newPerson.name = v

const addpeople = () => {
    var obj = {
      index: arr.length + 1,
      name: newPerson.name,
      age: newPerson.age,
      link: arr.length
    }
    list.insert(obj, reMap)
}

// set initial array content
const initial = () => {
  for (var i = 0; i < 5; i++) {
    newPerson.name = _name[i]
    newPerson.age = _age[i]
    addpeople()
  }
}

const app = keet().link('app', '{{add}}{{list}}')

const add = keet().template('div', 'add')
  .set({
    value: `name: <input type="text" id="Name" style="margin:0 10px 0 0">
            age: <input type="number" min="1" max="120" id="Age" style="width:60px;margin-right:10px">
            <button onclick="addpeople()">+</button>`,
    'css-display': 'inline-flex',
    'css-position': 'relative',
    'css-top': '15px'
  })

const list = keet().template('ul', 'people')
  .array(arr, 
        `<li style="width: 200px">
          {{index}} - {{name}} {{age}}<span style="position:absolute;left:180px">
          <button onclick="_remove({{link}})">X</button></span>
        </li>`
        )
  .set({
    'css-list-style-type': 'none',
    'css-margin-top': '25px'
  })

app.compose(ele => {
    ele.style.width = 'auto'
    ele.style.margin = '0 0 0 0'
  })
  .bindListener('Name', changeName) // bind the name input to a function
  .bindListener('Age', changeAge) // bind the age input to a function
  .compose(initial) // set the initial list

const _remove = i => list.remove({link: i}, reMap)

// get the modified array and update current array, does not modifed indices since its not return
const re = res => arr = res

// or since remove/insert changed the array, we remap to arange it again
const reMap = res =>
  res.map((r, i) => {
    r.index = i + 1
    r.link = i
    return r
  })

