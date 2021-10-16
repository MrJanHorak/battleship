/*-------------------------------- Constants --------------------------------*/
// boar objects to record placement status and the boat status array
// Boat arrays contain values to show thier current status
// sw = swim   and   hi = hit

const carrier = {placed:false, stats:["sw", "sw", "sw", "sw", "sw"]}
const battleship = {placed:false, stats:["sw", "sw", "sw", "sw"]}
const submarine = {placed:false, stats:["sw", "sw", "sw"]}
const cruiser = {placed:false, stats:["sw", "sw" ,"sw"]}
const destroyer = {placed:false, stats:["sw", "sw"]}

/*---------------------------- Variables (state) ----------------------------*/

let numberOfHits, numOfGuesses, gameState, shipOrientation, whoWins, gameGridState, rows, columns, selectedBoat, gridLocation


/*------------------------ Cached Element References ------------------------*/
const gameGrid = document.querySelector("#battleshipGrid")
const sideBar = document.querySelector('#sideBar')


/*----------------------------- Event Listeners -----------------------------*/
gameGrid.addEventListener("click", handleClick)
sideBar.addEventListener("click", handleClick)
/*-------------------------------- Functions --------------------------------*/
init()

function init() {

  rows= 10
  columns = 10
  numberOfHits = 0
  numOfGuesses = 0
  whoWins = null
  gameGridState = null
  shipOrientation = 'horizontal'
  selectedBoat = null
  console.log('this is init()')
  createGrid()
  createGridArray()
  render()

}

function handleClick(event) {

  // This part of the function only run if the player is placing a boat
  // And to filter out any potential bugs the code makes sure a click on the parent
  // <Div> is not computed. When a click on the grid happens and a boat is activated 
  // the boat grid length is placed in the grid array. The orientation info and length
  // of boat need to be passed on and computed.

  console.log("this is handleClick")
  console.log('gamegridstate',gameGridState)

  // boats can be selected is the gameGrid staste is null
  // this allows a player to change thier mind about which boat to place
  if ((gameGridState === null || gameGridState === 'place') && event.target.className === "boats" 
      && event.target.is !== "sideBar") {
        selectedBoat = event.target.id
        gameGridState = 'place'
      }

      //this handles a click on the grid to place a boat
  if (gameGridState === 'place' && event.target.className === "grid-item" 
      && event.target.id!=="battleshipGrid" && event.target.id!=="sideBar"){

      gridLocation = event.target.id
      `${selectedBoat}[placed]=true`
      console.log(selectedBoat)
      placeShip(gridLocation)
      gameGridState = null
    }

// When a boat is selected it changes the variable of selectedBoat to the specific boat
// that variable helps fill the array with the info and length on which boat is placed where

// how will I use that variable to select the coorelated array?????

if (gameGridState === 'guess' && event.target.id !== "battleshipGrid" 
    && event.target.id!=="sideBar"){

  console.log("this is handleClick in guess mode")
  console.log("this got clicked:",event.target.className)

    if(event.target.className==="grid-item"){
      console.log(event.target.id,' This square was clicked')
    }
    // if(event.target.className==="boats") {
    //   console.log(event.target.id,'This boat was selected')
    //   selectedBoat = event.target.id
    //   console.log (selectedBoat, 'Selected boat variable')
    // }

}
}





function render(){
  console.log('this is render()')
}

function placeShip(gridLocation){
  console.log('this is place ship')
  console.log("this got clicked:",gridLocation)
  console.log('selected Boat in placeShip',selectedBoat)
  console.log('boat shipOrientation in placeShip',shipOrientation)
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
  function createGridArray(){
    console.log('this is createGridArray')
  }
