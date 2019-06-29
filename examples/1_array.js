import { Component } from '../'

export default class App extends Component {
  state = {
  	names: ['John', 'Sarah', 'Leon', 'Rex']
  }
  pop(checkName){
    this.setState({ 
      names: this.state.names.filter(name => name !== checkName) 
    })
  }
  person(name, index){
    // add attributes 'key' to element when dealing with nodeList length [OPTIONAL]
  	return (
  	  <li key={index}>
        {name}
        <span style="cursor:pointer;" onClick={ev => this.pop(name)}>
          [x]
        </span>
      </li>
    )
  }
  componentDidUpdate(){
    console.log(this)
  }
  renderList(){
    return this.state.names.map(this.person.bind(this))
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
