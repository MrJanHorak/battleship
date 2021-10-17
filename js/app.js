/*-------------------------------- Constants --------------------------------*/
// boat objects to record placement status and the boat status array
// Boat arrays contain values to show thier current status

const boatsArray =[ {boatType: 'carrier', placed:false, length:5},
                    {boatType: 'battleship', placed:false, length:4},
                    {boatType: 'submarine', placed:false, length:3},
                    {boatType: 'cruiser', placed:false, length:3},
                    {boatType: 'destroyer', placed:false, length:2}]

/*---------------------------- Variables (state) ----------------------------*/

let numberOfHits, numOfGuesses, shipOrientation, whoWins, gameGridState, rows, columns, selectedBoat, boatLength, allSquares, previousSelectedBoat, rowIndex, columnIndex, gameGridArray


/*------------------------ Cached Element References ------------------------*/
const selectedGrid = document.querySelector("#battleshipGrid")
const sideBar = document.querySelector('#sideBar')
const boatsSelection = document.querySelectorAll('.boat')
const boatOrientationButton = document.querySelector("#horVer")

/*----------------------------- Event Listeners -----------------------------*/
selectedGrid.addEventListener("click", handleClick)
sideBar.addEventListener("click", handleClick)
boatOrientationButton.addEventListener("click", boatOrient)
/*-------------------------------- Functions --------------------------------*/
init()
function init() {

  rowIndex = null
  columnIndex = null
  rows= 10
  columns = 10
  numberOfHits = 0
  numOfGuesses = 0
  whoWins = null
  gameGridState = null
  gameGridArray = []
  shipOrientation = 'horizontal'
  selectedBoat = null
  boatLength = 0
  previousSelectedBoat = ""
  // createGrid and createGridArray are only called once for the game set-up/reset
  // they will automatically create the html grid displayed and the corressponding 
  // array for the game state that is then used for the rest of the game play
  createGrid()
  createGridArray()
  boatOrient()
  render()

}

function handleClick(event) {

  // This part of the function only run if the player is placing a boat
  // And to filter out any potential bugs the code makes sure a click on the parent
  // <Div> is not computed. When a click on the grid happens and a boat is activated 
  // the boat grid length is placed in the grid array. The orientation info and length
  // of boat need to be passed on and computed.


  // boats can be selected is the gameGrid staste is null
  // this allows a player to change thier mind about which boat to place
  if ((gameGridState === null || gameGridState === 'place') && event.target.className === "boat" 
      && event.target.is !== "sideBar") {
        selectBoat(event.target.id)
        gameGridState = 'place'
      }

  //this handles a click on the grid to place a boat
  if (gameGridState === 'place' && event.target.className === "grid-item" 
      && event.target.id!=="battleshipGrid" && event.target.id!=="sideBar"){
      if (event.target.id.length<2){
        rowIndex = 0
        columnIndex = parseInt(event.target.id)
      } else {
        rowIndex = parseInt(event.target.id.charAt(0))
        columnIndex = parseInt(event.target.id.charAt(1))
      }
      
      //the use of an outside helper function to maintain seperation of interests

      placeShip()
      gameGridState = null
    }

// When a boat is selected it changes the variable of selectedBoat to the specific boat
// that variable helps fill the array with the info and length on which boat is placed where

if (gameGridState === 'guess' && event.target.id !== "battleshipGrid" 
    && event.target.id!=="sideBar"){

  console.log("this is handleClick in guess mode")
  console.log("this got clicked:",event.target.className)

    if(event.target.className==="grid-item"){
      console.log(event.target.id,' This square was clicked')
    }
}
}

// select the proper boat from the boatsArray
// and set the selectedboat variable for the rest of the current turn
function selectBoat (selectBoat) {
  console.log('this is selectBoat')
  for (let i=0; i<boatsArray.length;i++){
    if(boatsArray[i].boatType === selectBoat && boatsArray[i].placed === false){
      selectedBoat = boatsArray[i]
      boatLength = selectedBoat.length
      console.log(boatsSelection[i])
      // change current selected boat name yellow
      boatsSelection[i].style.backgroundColor="yellow"
      if(previousSelectedBoat!==""){
        previousSelectedBoat.style.backgroundColor=""} 
      previousSelectedBoat = boatsSelection[i]
      }
    }
  
      
  }


function render(){
  console.log('this is render()')
  // render gameGridState to reflect the current content of the array 
  // (boat placement/water/hit or miss)
  let counter=0
  gameGridArray.forEach(arr => {
    arr.forEach(element => {
      if(element ==='w'){
      allSquares[counter].style.backgroundColor="blue"
    } else if (element === 'b'){
      allSquares[counter].style.backgroundColor="grey"
    } else if (element === 'h'){
      allSquares[counter].style.backgroundColor="red"
    } else if (element === 'm'){
      allSquares[counter].style.backgroundColor="white"
    }
    counter++ 
  })
})
}

// function to place the boat on the grid
// it adds the boat to the GameGridArray 
function placeShip(){
if (selectedBoat.placed === false){

  if (shipOrientation==='horizontal'){
    for (let i=0; i<boatLength; i++){
    gameGridArray[rowIndex][columnIndex+i]='b'}
  }
  if (shipOrientation==='vertical'){
    for (let i=0; i<boatLength; i++){
      gameGridArray[rowIndex+i][columnIndex]='b'}
  }
  selectedBoat.placed = true
  gameGridArray.forEach(e => console.log(e))
  render()
}
}
// function to change the orientation of boat to place on grid
// also updates the button name on screen
function boatOrient(){
  shipOrientation === 'vertical' ? shipOrientation = 'horizontal' : shipOrientation = 'vertical'
  boatOrientationButton.innerHTML = shipOrientation
  console.log(shipOrientation)
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
  selectedGrid.style.setProperty('--grid-rows', rows)
  selectedGrid.style.setProperty('--grid-cols', columns)

  // iterating through the given parameters of row and columns to create
  // game grid of the desired size.
  // Class name and individual cell id's are also assigned at this point
  for (let c = 0; c<(rows * columns);c++){
    let cell = document.createElement("div");
    cell.innerText = (c)
    selectedGrid.appendChild(cell).setAttribute('class','grid-item')
    selectedGrid.appendChild(cell).setAttribute('id' ,`${c}`)
  }

  // QuerySelectorAll cannot function until the grid is created
  // that is why I have to place it here and not in with the
  // cached elements on top.
  allSquares = document.querySelectorAll(".grid-item")

}

// Creates the array that contains the data of the game grid state. 
// This array will store the boat location && used to compare guesses
  function createGridArray(){

    for (let c = 0 ;c < columns ; c++){
      //creates an empty array
      gameGridArray.push([])
      //now pushes the w's into each index of gameGridArray at the index of [c]  
      //this array of arrays corresponds with each row and column of the display grid
      for (let r = 0 ; r < rows ; r++ ){
      gameGridArray[c].push('w')
    }
  }
  }