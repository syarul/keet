const d = [
  { w: 30, h: 30, x: 0, y: 0 },
  { w: 88, h: 30, x: 29, y: 0},
  { w: 148, h: 30, x: 58.5, y: 0},
  { w: 58, h: 76, x: 14.5, y: 24},
  { w: 118, h: 76, x: 44, y: 24},
  { w: 176, h: 76, x: 73.5, y: 24}
]

const hexData = d.map(f => {
  let o = {}
  o.width = f.w +'px'
  o.height = f.h + 'px'
  o.fill = '#00A79D'
  o.M = '28.482,22.516 15.023,30.021 1.565,22.516 1.565,7.505 15.023,0 28.482,7.505',
  o.x = f.x
  o.y = f.y
  return o
})

const keet = () => new Keet

const app = keet().link('app', '{{hex}}')

const hex = keet().register('app')
  .array(hexData, `
    <svg width="{{width}}" height="{{height}}">
     <polygon transform="translate({{x}},{{y}})" fill="{{fill}}" points="{{M}}"/>
    </svg>`)