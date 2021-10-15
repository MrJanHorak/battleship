/*-------------------------------- Constants --------------------------------*/
const carrier = [sw, sw, sw, sw, sw]
const battleship = [sw, sw, sw, sw]
const submarine = [sw, sw, sw]
const cruiser = [sw, sw ,sw]
const destroyer = [sw, sw]

/*---------------------------- Variables (state) ----------------------------*/

let numberOfHits, numOfGuesses, gameState, shipOrientation, whoWins, gameGrid


/*------------------------ Cached Element References ------------------------*/



/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/
init()

function init() {
numberOfHits = 0
numOfGuesses = 0
whoWins = null
gameGrid = 'place'
shipOrientation = 'horizontal'


console.log('this is init()')
render()


}



render(){
  console.log('this is render()')
}

placeShip(){
  console.log('this is place ship')
}

guessShip(){
  console.log('This is Guess')
}

hitOrMiss(){
  console.log('this is hit or miss')
}

whoWins(){
  console.log('this is whoWins')
}

changeBoatStatus(){
  console.log('this is changeBoatStatus')
}

