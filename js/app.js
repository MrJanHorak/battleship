/*-------------------------------- Constants --------------------------------*/
// boat objects to record placement status and the boat status array
// Boat arrays contain values to show thier current status
import { getRules, getPlayer2 } from "../data/popup.js"

const boatsArray =[ {boatType: 'carrier', placed:false, length:5},
                    {boatType: 'battleship', placed:false, length:4},
                    {boatType: 'submarine', placed:false, length:3},
                    {boatType: 'cruiser', placed:false, length:3},
                    {boatType: 'destroyer', placed:false, length:2}]

/*---------------------------- Variables (state) ----------------------------*/

let numOfGuesses, shipOrientation, gameGridState, rows, columns, selectedBoat, boatLength, allSquares, previousSelectedBoat, rowIndex, columnIndex, gameGridArray, boatName, boatsArrayIndex, loop, ammo, hits, misses

/*------------------------ Cached Element References ------------------------*/
const selectedGrid = document.querySelector("#battleshipGrid")
const sideBar = document.querySelector('#sideBar')
const boatsSelection = document.querySelectorAll('.boat')
const messages = document.querySelector('#messages')
const popup = document.querySelector('.modal-body')
const popupTitel = document.querySelector('#popupTitle')
const boatOrientationButton = document.querySelector("#horVer")
const lightDarkBtn = document.querySelector(".form-check")
const body = document.querySelector("body")
const replay = document.querySelector("#replay")
const rules = document.querySelector("#rules")
const stats = document.querySelector("#gamestat")

/*----------------------------- Event Listeners -----------------------------*/
selectedGrid.addEventListener("click", handleClick)
sideBar.addEventListener("click", handleClick)
boatOrientationButton.addEventListener("click", boatOrient)
lightDarkBtn.addEventListener("click", toggleLightDark)
replay.addEventListener("click", init)
rules.addEventListener("click", popupModal)

/*-------------------------------- Functions --------------------------------*/
checkDarkPref()
// createGrid is only called once for the game set-up
// it automatically creates the html grid displayed and the corressponding 
rows= 10
columns = 10
createGrid()

init()

function init() {
  boatsArrayIndex = null
  boatName = ""
  rowIndex = null
  columnIndex = null
  numOfGuesses = 0
  gameGridState = null
  gameGridArray = []
  shipOrientation = 'horizontal'
  selectedBoat = null
  boatLength = 0
  previousSelectedBoat = ""
  loop=0
  ammo = 61
  hits = 0
  misses = 0

  //this is needed for the reset button to properly reset the game
  for (let i=0 ; i < boatsArray.length ; i++){
    boatsArray[i].placed=false
    boatsSelection[i].innerText=boatsArray[i].boatType
    boatsSelection[i].style.backgroundColor= 'darkgrey'
    boatsSelection[i].style.visibility = 'visible'
  }

  messages.innerHTML = `Player 1 please begin placing boats.`
  stats.textContent = "Game Pieces"

  createGridArray()
  render()
}

function handleClick(event) {
  
  // This part of the function only runs if the player is placing a boat
  // to filter out any potential bugs the code makes sure a click on the 
  // parent <Div> is not computed. When a click on the grid happens and 
  // a boat is activated the boat grid length is placed in the grid array. 
  // The orientation info and length of boat need to be passed on and computed.

  // boats can be selected is the gameGrid staste is null
  // this allows a player to change thier mind about which boat to place
  if ((gameGridState === null || gameGridState === 'place') && event.target.className === "boat" && event.target.is !== "sideBar") {
        selectBoat(event.target.id)
        gameGridState = 'place'
        messages.innerHTML = `Please place the ${boatName} now`
      }

  // this handles a click on the grid to place a boat
  if (gameGridState === 'place' && event.target.className === "grid-item" 
      && event.target.id!=="battleshipGrid" && event.target.id!=="sideBar"){
      if (event.target.id.length<2){
        columnIndex = 0
        rowIndex = parseInt(event.target.id)
      } else {
        columnIndex = parseInt(event.target.id.charAt(0))
        rowIndex = parseInt(event.target.id.charAt(1))
      }
    placeShip() 
  }

  // When a boat is selected it changes the variable of selectedBoat 
  // to the specific boat that variable helps fill the array with the 
  // info and length on which boat is placed where

  if (gameGridState==='transition'){
    rowIndex = null
    columnIndex = null
  }

  if (gameGridState === 'guess' && event.target.id !== "battleshipGrid" 
      && event.target.id!=="sideBar"){
        if (event.target.id.length<2){
          columnIndex = 0
          rowIndex = parseInt(event.target.id)
        } else {
          columnIndex = parseInt(event.target.id.charAt(0))
          rowIndex = parseInt(event.target.id.charAt(1))
        }
  guessShip()
  }
}

// select the proper boat from the boatsArray
// and set the selectedboat variable for the rest of the current turn
function selectBoat (selectBoat) {
  for (let i=0; i<boatsArray.length;i++){
    if(boatsArray[i].boatType === selectBoat && boatsArray[i].placed === false)
    {
      selectedBoat = boatsArray[i]
      boatName = selectedBoat.boatType
      boatLength = selectedBoat.length
      boatsArrayIndex = i

      // change current selected boat name yellow
      boatsSelection[i].style.backgroundColor="yellow"
      if(previousSelectedBoat!==""){
        previousSelectedBoat.style.backgroundColor=""
        if (previousSelectedBoat.placed===true){
        }} 
    previousSelectedBoat = boatsSelection[i]
    } 
  }
}

// render gameGridState to reflect the current content of the array 
// (boat placement/water/hit or miss)
function render(){

  if (gameGridState===null || gameGridState==='place'){
    let counter=0
    gameGridArray.forEach(arr => {
      arr.forEach(element => {
        if(element ==='w'){
        allSquares[counter].style.backgroundImage = "url(../images/battleshipgrid.jpg)"
        } else if (element === 'b'){
        allSquares[counter].style.backgroundImage = "url(../images/battleshipgridboat.jpg)"
        } 
      counter++ 
      })  
    })
  }

  // creating an array to check each boats placement status
  // if all boats are placed the game is switched to guess mode.
  let placedStatus = []
  for (let i=0 ; i < boatsArray.length ; i++){
    placedStatus.push(boatsArray[i].placed)
  }

  if(placedStatus.includes(false)!==true && gameGridState!=='winner'){
    loop++
    rowIndex = null
    columnIndex = null
    if (loop===1){
    gameGridState = 'transition'
    popupModal()}
    messages.innerHTML=`Player 2 now its your turn to guess`
    stats.textContent = "Game Stats"
    gameGridState = 'guess'
    //start timer()
    if (gameGridState==='guess'){
      let counter=0
      gameGridArray.forEach(arr => {
        arr.forEach(element => {
          if(element ==='w'){
          allSquares[counter].style.backgroundImage = "url(../images/battleshipgrid.jpg)"
        } else if (element === 'b'){
          allSquares[counter].style.backgroundImage = "url(../images/battleshipgrid.jpg)"
        } else if (element === 'h'){
          allSquares[counter].style.backgroundImage = "url(../images/battleshipgridhit.jpg)"
        } else if (element === 'm'){
          allSquares[counter].style.backgroundImage = "url(../images/battleshipgridmiss.jpg)"
        }
        counter++ 
        boatsSelection[0].style.visibility='visible'
        boatsSelection[0].style.background= '#D7D1E6'
        boatsSelection[0].textContent=`Ammo: ${ammo}`
        boatsSelection[1].style.visibility='visible'
        boatsSelection[1].style.background= '#D7D1E6'
        boatsSelection[1].textContent=`hits: ${hits}`
        boatsSelection[2].style.visibility='visible'
        boatsSelection[2].style.backgroundColor='#D7D1E6'
        boatsSelection[2].textContent=`misses: ${misses}`
      })  
      })
    }
  }
}

// function to place the boat on the grid
// it adds the boat to the GameGridArray 
function placeShip(){

  let potentialBoatLocation =[]
  
  if (selectedBoat.placed === false){
    // Each orientation of the ship is handeled in its own if-statement
    if (shipOrientation==='horizontal'){
      // check to see if the potential boat location is actually clear of other boats
      for (let i=0; i<boatLength; i++){
        potentialBoatLocation.push(gameGridArray[columnIndex][rowIndex+i])
      }
      if(potentialBoatLocation.includes("b")===false){
        //actually place the boat and change the 'placed status to true'
        for (let x=0; x<boatLength; x++){
          console.log('line boat:',gameGridArray[columnIndex])
          console.log('column index:',columnIndex)
          if(gameGridArray[columnIndex][rowIndex+x]==='w' && rowIndex+boatLength<=10){
            gameGridArray[columnIndex][rowIndex+x]='b'
            selectedBoat.placed = true
            //removes the placed boat from the available selection
            boatsSelection[boatsArrayIndex].style.visibility="hidden"
          }
        }
        render()
      }  
    }
    if (shipOrientation==='vertical' && columnIndex+boatLength<=10){
      // check to see if the potential boat location is actually clear of other boats
      for (let i=0; i<boatLength; i++){
        potentialBoatLocation.push(gameGridArray[columnIndex+i][rowIndex])
      }
      if(potentialBoatLocation.includes("b")===false){
        //actually place the boat and change the 'placed status to true'
        for (let i=0; i<boatLength; i++){
          if(gameGridArray[columnIndex+i][rowIndex]==='w' ){
            gameGridArray[columnIndex+i][rowIndex]='b'
            selectedBoat.placed = true
            //removes the placed boat from the available selection
            boatsSelection[boatsArrayIndex].style.visibility="hidden"
          }
        }
        render()
      }
    }
  }
}

// function to change the orientation of boat to place on grid
// also updates the button name on screen
function boatOrient(){
  shipOrientation === 'vertical' ? shipOrientation = 'horizontal' : shipOrientation = 'vertical'
  boatOrientationButton.innerHTML = shipOrientation
}

function guessShip(){
  if(gameGridState!=='winner' && gameGridState==='guess'){  
    if(gameGridArray[columnIndex][rowIndex]==='b'){
        gameGridArray[columnIndex][rowIndex]='h'
        hits++
    } else if (gameGridArray[columnIndex][rowIndex]==='w'){
        gameGridArray[columnIndex][rowIndex]='m'
        misses++
    }
  numOfGuesses++
  ammo--
  console.log(hits)
  console.log(misses)
  render()
  winnerYet()
  }
  }

function winnerYet(){
  console.log('this is whoWins')
  let winnerCheck=[]
  gameGridArray.forEach(arr => {
    arr.forEach(element => {
      winnerCheck.push(element)
    })
  })

  if(winnerCheck.includes('b')===false){
    gameGridState = 'winner'
    console.log('winner. fleet sunk')
    messages.innerHTML = `Player 2 you sank player 1s fleet!`
  }
}

function popupModal(){
  if(gameGridState===null){
    popup.innerHTML = getRules()   
  $('#popModul').modal()
  }

  if (gameGridState==='transition'){
    popupTitel.innerText="Player 2 It's your turn!"
    popup.innerHTML = getPlayer2()
    $("#popModul").modal()
  }
}

function createGrid(){
  
  //  set grid/cell styles by assigning CSS styles
  selectedGrid.style.setProperty('--grid-rows', rows)
  selectedGrid.style.setProperty('--grid-cols', columns)

  // iterating through the given parameters of row and columns to create
  // game grid of the desired size.
  // Class name and individual cell id's are also assigned at this point
  for (let c = 0; c<(rows * columns);c++){
    let cell = document.createElement("div");
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

function toggleLightDark(){
  body.className = body.className === "dark" ? "" : "dark"
}

function checkDarkPref(){
if (window.matchMedia("(prefers-color-scheme:dark)").matches && 
    body.className !== "dark"
    ) {
  toggleLightDark()
      }
    }