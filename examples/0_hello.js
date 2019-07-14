import Keet from '../keet'
import { Component } from '../'

export default class App extends Component {
  state = {
    colorIndex: 0,
    colorList :['blue', 'yellow', 'green', 'cyan', 'red']
  }
  changeColor = () => {
    let colorIndex = this.state.colorIndex === this.state.colorList.length - 1 ? 
      0 : this.state.colorIndex + 1
    this.setState({ colorIndex }, () => console.log('color changed!!'))
  }
  render ({ greet }, { colorIndex, colorList }) {
    return (
      <h1 id="attr" style={{color:colorList[colorIndex], 'font-style': 'italic'}}>
        Hello {greet}, What's up? <br />
        <button onClick={this.changeColor}>CHANGE COLOR</button>
      </h1>
    )
  }
}
