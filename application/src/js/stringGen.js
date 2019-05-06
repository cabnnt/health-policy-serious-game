function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}
export function illmatic(cutoff, size, posChar, negChar) {
    if(cutoff == undefined){cutoff = .67}
    if(size == undefined){size = 9}
    if(posChar == undefined){posChar = '0'}
    if(negChar == undefined){negChar = '1'}
    let sickString = new Array(size + 1).join("1")
    let prob = Math.random()
    let isSick = false
    let roll = Math.floor(prob.toFixed(2) % 1 * 100)
    let sickNumber = (prob.toFixed(2) % 1)
    isSick = sickNumber > cutoff ? true : false
    for(let i = 0; i < sickString.length; i++){
        let rand = getRndInteger(0, 100)
        sickString = rand <= roll ? replaceAt(sickString,i,posChar) : replaceAt(sickString,i,negChar)
    }
    return [sickString, isSick]
}

console.log(illmatic())
