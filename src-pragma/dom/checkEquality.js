export default function(oprop, nprop) {
    const oArr = Object.keys(oprop || {})
    const nArr = Object.keys(nprop || {})
    
    if (oArr.length !== nArr.length) return false

    let eq = true

    for (let i = 0; i < nArr.length; i++) {
        let n = nprop[nArr[i]]
        let o = oprop[oArr[i]]
        if(typeof n === 'function'){
            // console.log(n === o)
            if(Object.getPrototypeOf(n).constructor !== Object.getPrototypeOf(o).constructor) eq = false
        } else if(typeof n === 'object' && typeof o === 'object') {
            for (let attr in n) {
                // console.log(n[attr] !== o[attr], n[attr], o[attr])
                if(n[attr] !== o[attr]) eq = false
            }
        } else {
            if(nprop[nArr[i]] !== oprop[oArr[i]]) eq = false
        }
    }

    return eq
}