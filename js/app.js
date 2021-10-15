/*-------------------------------- Constants --------------------------------*/
// Boat arrays contain values to show thier current status
// sw = swim   and   hi = hit
const carrier = ["sw", "sw", "sw", "sw", "sw"]
const battleship = ["sw", "sw", "sw", "sw"]
const submarine = ["sw", "sw", "sw"]
const cruiser = ["sw", "sw" ,"sw"]
const destroyer = ["sw", "sw"]

/*---------------------------- Variables (state) ----------------------------*/

let numberOfHits, numOfGuesses, gameState, shipOrientation, whoWins, gameGridState, rows, columns


/*------------------------ Cached Element References ------------------------*/
const gameGrid = document.querySelector("#battleshipGrid")


/*----------------------------- Event Listeners -----------------------------*/
gameGrid.addEventListener("click", handleClick)

/*-------------------------------- Functions --------------------------------*/
init()

function init() {

  rows= 10
  columns = 10
  numberOfHits = 0
  numOfGuesses = 0
  whoWins = null
  gameGridState = 'place'
  shipOrientation = 'horizontal'

  console.log('this is init()')
  createGrid()
  render()

}

function handleClick(event) {
  console.log("this is handleClick")
  console.log("this got clicked:",event.target.id)
}

function render(){
  console.log('this is render()')
}

function placeShip(){
  console.log('this is place ship')
}

function guessShip(){
  console.log('This is Guess')
}

function hitOrMiss(){
  console.log('this is hit or miss')
}

function winnerYet(){
  console.log('this is whoWins')
}

function changeBoatStatus(){
  console.log('this is changeBoatStatus')
}

function createGrid(){
  
  // figured this out by reading some old stackexchange notes

  console.log('this is createGrid')
  //  set grid/cell styles by assigning CSS styles
  gameGrid.style.setProperty('--grid-rows', rows)
  gameGrid.style.setProperty('--grid-cols', columns)

  // iterating through the given parameters of row and columns to create
  // game grid of the desired size.
  // Class name and individual cell id's are also assigned at this point
  for (let c = 0; c<(rows * columns);c++){
    let cell = document.createElement("div");
    cell.innerText = (c)
    gameGrid.appendChild(cell).setAttribute('class','grid-item')
    gameGrid.appendChild(cell).setAttribute('id' ,`${c}`)
  }

}