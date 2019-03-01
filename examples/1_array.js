import { Component } from '../'

export default class App extends Component {
  data = {
  	names: ['John', 'Sarah', 'Leon', 'Rex']
  }
  pop(ev, checkName){
    this.setData({ 
      names: this.data.names.filter(name => name !== checkName) 
    })
  }
  person(name, index){
    // add attributes 'key' to element when dealing with nodeList length [OPTIONAL]
  	return (
  	  <li key={index}>
        {name}
        <span style="cursor:pointer;" onclick={ev => this.pop(ev, name)}>
          [x]
        </span>
      </li>
    )
  }
  componentDidUpdate(){
    console.log(this)
  }
  renderList(){
    return this.data.names.map(this.person.bind(this))
  }
  render () {
    return (
      <div>
        <h4>People</h4>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    )
  }
}
