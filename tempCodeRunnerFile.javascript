var prob = Math.random()
console.log(prob)
console.log(prob.toFixed(2))
console.log(illmatic(prob))
function illmatic(num) {
    var result           = '';
    var characters       = '01';
    var charactersLength = characters.length;
    var sickNumber = (prob.toFixed(1) % 1)
    console.log(sickNumber)
    if(sickNumber > .67){
        console.log("Congrats You're Sick!")
    }
    else{
        console.log("Go to school, you're fine")
    }
    
    for ( var i = 0; i < 9; i++ ) {
        result += characters.charAt(num * charactersLength);
    }
    return result;
}