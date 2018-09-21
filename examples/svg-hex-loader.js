import Keet, { html, CreateModel } from '../'

const style = html`
<style>
    #app {
    width: 104px;
    height: 56px;
    margin: 100px auto;
  }

  #app ul {
    list-style-type: none;
  }

  #app svg {
    position: absolute;
  }

  @keyframes blink {
    0% {
      transform: scale(0.4);
      opacity: 0.1;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
    90% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.1;
    }
  }

  #app ul li:first-child svg {
    animation: blink ease-in 1.5s infinite;
  }

  #app ul li:nth-child(2) svg {
    animation: blink ease-in 1.5s infinite 0.1s;
  }

  #app ul li:nth-child(3) svg {
    animation: blink ease-in 1.5s infinite 0.2s;
  }

  #app ul li:nth-child(4) svg {
    animation: blink ease-in 1.5s infinite 0.3s;
  }

  #app ul li:nth-child(5) svg {
    animation: blink ease-in 1.5s infinite 0.4s;
  }

  #app ul li:nth-child(6) svg {
    animation: blink ease-in 1.5s infinite 0.5s;
  }
</style>`

document.querySelector('head').innerHTML += style

class App extends Keet {
  el = 'app'
  hex = new CreateModel()

  constructor () {
    super()
    this.hex.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }

  render () {
    Array.from([
      { w: 30, h: 30, x: 0, y: 0 },
      { w: 88, h: 30, x: 29, y: 0 },
      { w: 148, h: 30, x: 58.5, y: 0 },
      { w: 58, h: 76, x: 14.5, y: 24 },
      { w: 118, h: 76, x: 44, y: 24 },
      { w: 176, h: 76, x: 73.5, y: 24 }
    ]).map(f => {
      this.hex.add({
        width: `${f.w}px`,
        height: `${f.h}px`,
        fill: '#00A79D',
        M: '28.482,22.516 15.023,30.021 1.565,22.516 1.565,7.505 15.023,0 28.482,7.505',
        x: f.x,
        y: f.y
      })
    })

    return html`
      <ul id="hexlist">
         <!-- {{model:hex}} -->
         <li>
           <svg width="{{width}}" height="{{height}}">
              <polygon transform="translate({{x}},{{y}})" fill="{{fill}}" points="{{M}}"/>
           </svg>
         </li>
         <!-- {{/model:hex}} -->
      </ul>
    `
  }
}

export default new App()
