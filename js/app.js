/*-------------------------------- Constants --------------------------------*/
import { getRules, getPlayer2 } from "../data/popup.js"

const boom = new Audio('../audio/Explosion+7.wav')
const splash = new Audio('../audio/wateresplash.wav')

// boat objects to record placement status and the boat status array
// Boat arrays contain values to show thier current status
const boatsArray =[ {boatType: 'carrier', placed:false, length:5},
                    {boatType: 'battleship', placed:false, length:4},
                    {boatType: 'submarine', placed:false, length:3},
                    {boatType: 'cruiser', placed:false, length:3},
                    {boatType: 'destroyer', placed:false, length:2}]

/*---------------------------- Variables (state) ----------------------------*/

let shipOrientation, gameGridState, rows, columns, selectedBoat, boatLength, allSquares, previousSelectedBoat, rowIndex, columnIndex, gameGridArray, boatName, boatsArrayIndex, loop, ammo, hits, misses, timeLeft, selectedGridId

/*------------------------ Cached Element References ------------------------*/
const selectedGrid = document.querySelector("#battleshipGrid")
const sideBar = document.querySelector('#sideBar')
const boatsSelection = document.querySelectorAll('.boat')
const messages = document.querySelector('#messages')
const popup = document.querySelector('.modal-body')
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
// it automatically creates the html grid displayed
// if called in init() when the game is replayed it causes problems.
// that is why it is here.  
rows= 10
columns = 10
createGrid()

init()

function init() {
  boatsArrayIndex = null
  boatName = ""
  rowIndex = null
  columnIndex = null
  gameGridState = null
  gameGridArray = []
  shipOrientation = 'horizontal'
  selectedBoat = null
  boatLength = 0
  previousSelectedBoat = ""
  loop=0
  ammo = 56
  hits = 0
  misses = 0
  timeLeft = 30
  selectedGridId =null
  //setup resets the game piece containers needed for replay
  setup()
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

  //  this handles the click on the grid to place a boat
  if (gameGridState === 'place' && event.target.className === "grid-item" 
      && event.target.id!=="battleshipGrid" && event.target.id!=="sideBar")
      {
        selectedGridId=event.target.id
      if (event.target.id.length<2){
        columnIndex = 0
        rowIndex = parseInt(event.target.id)
      } else {
        columnIndex = parseInt(event.target.id.charAt(0))
        rowIndex = parseInt(event.target.id.charAt(1))
      }
    placeShip() 
  }

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
    } 
  }
}

// render gameGridState to reflect the current content of the gameGridArray 
function render(){

  if (gameGridState===null || gameGridState==='place'){
    let counter=0
    gameGridArray.forEach(arr => {
      arr.forEach(element => {
        if(element ==='w'){
        allSquares[counter].style.backgroundImage = "url(../images/oceantile.png)"
        } else if (element === 'hb1'){
        allSquares[counter].style.backgroundImage = "url(../images/hb1.png)" 
        } else if (element === 'hb2'){
        allSquares[counter].style.backgroundImage = "url(../images/hb2.png)" 
        } else if (element === 'hb3'){
        allSquares[counter].style.backgroundImage = "url(../images/hb3.png)" 
        } else if (element === 'vb1'){
        allSquares[counter].style.backgroundImage = "url(../images/vb1.png)" 
        } else if (element === 'vb2'){
        allSquares[counter].style.backgroundImage = "url(../images/vb2.png)" 
        } else if (element === 'vb3'){
        allSquares[counter].style.backgroundImage = "url(../images/vb3.png)" 
        } 
      counter++ 
      })  
    })
  }

  // create an array to check each boats placement status
  // if all boats are placed the gameGridState is switched
  // first to a transition screen then to guess mode
  let placedStatus = []
  for (let i=0 ; i < boatsArray.length ; i++){
    placedStatus.push(boatsArray[i].placed)
  }

  if(placedStatus.includes(false)!==true && gameGridState!=='winner'){
    loop++
    if (loop===1){
      gameGridState = 'transition'
      popupModal()
      timer()
    }
    messages.innerHTML=`Player 2 now its your turn to guess`
    stats.textContent = "Game Stats"
    gameGridState = 'guess'
    if (gameGridState==='guess'){
      let counter=0
      gameGridArray.forEach(arr => {
        arr.forEach(element => {
          if(element ==='w'){
          allSquares[counter].style.backgroundImage = "url(../images/oceantile.png)"
        } else if (element.charAt(1) === 'b'){
          allSquares[counter].style.backgroundImage = "url(../images/oceantile.png)"
        } else if (element.charAt(1) === 'h'){
          if (element.charAt(2)=== '1'){
            allSquares[counter].style.backgroundImage = "url(../images/eh1.png)"
            boom.play()
          } else if (element.charAt(2)=== '2'){
            allSquares[counter].style.backgroundImage = "url(../images/eh2.png)"
            boom.play()
          } else if (element.charAt(2)=== '3') {
            allSquares[counter].style.backgroundImage = "url(../images/eh3.png)"
            boom.play()
          }
        } else if (element.charAt(1) === 'v'){
          if (element.charAt(2)=== '1'){
            allSquares[counter].style.backgroundImage = "url(../images/ev1.png)"
            boom.play()
          } else if (element.charAt(2)=== '2'){
            allSquares[counter].style.backgroundImage = "url(../images/ev2.png)"
            boom.play()
          } else if (element.charAt(2)=== '3'){
            allSquares[counter].style.backgroundImage = "url(../images/ev3.png)"
            boom.play()
          }
        } else if (element === 'm'){
          allSquares[counter].style.backgroundImage = "url(../images/oceansplashmiss.png)"
          splash.play()
        }
        counter++ 
        guessStats()
        })  
      })
    }
  }
}

// Just a helper function to manage the set-up and output of the guessing stats
function guessStats() {
  boatsSelection[0].style.visibility='visible'
  boatsSelection[0].style.backgroundImage= 'unset'
  boatsSelection[0].innerText=`Ammo: ${ammo}`
  boatsSelection[1].style.visibility='visible'
  boatsSelection[1].style.backgroundImage= 'unset'
  boatsSelection[2].style.visibility='visible'
  boatsSelection[2].style.backgroundImage= 'unset'
  boatsSelection[2].innerText=`misses: ${misses}`
  boatsSelection[3].style.visibility='visible'
  boatsSelection[3].style.backgroundImage= 'unset'
  boatsSelection[4].style.visibility='visible'
  boatsSelection[4].style.backgroundImage= 'unset'
  boatsSelection[4].innerText=`hits: ${hits}`
}

function setup() {
  //this resets the game pieces visibility at game reset
  for (let i=0 ; i < boatsArray.length ; i++){
    boatsSelection[i].textContent = ' '
    boatsArray[i].placed=false
    boatsSelection[i].style.visibility = 'visible'
  }
    boatsSelection[0].style.backgroundImage = "url(../images/5longBoat.png)"
    boatsSelection[1].style.backgroundImage = "url(../images/4longBoat.png)"
    boatsSelection[2].style.backgroundImage = "url(../images/3longBoat.png)"
    boatsSelection[3].style.backgroundImage = "url(../images/3longBoat.png)"
    boatsSelection[4].style.backgroundImage = "url(../images/2longBoat.png)"
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
        potentialBoatLocation.push(gameGridArray[columnIndex][rowIndex+i].charAt(1))
      }
      if(potentialBoatLocation.includes("b")===false){
        //actually place the boat and change the 'placed status to true'
        for (let x=0; x<boatLength; x++){
          if(gameGridArray[columnIndex][rowIndex+x]==='w' && rowIndex+boatLength<=10){
            if(x===0){
              gameGridArray[columnIndex][rowIndex+x]='hb1'
            }else if (x===boatLength-1){
              gameGridArray[columnIndex][rowIndex+x]='hb3'
            } else {
              gameGridArray[columnIndex][rowIndex+x]='hb2'
            }
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
        potentialBoatLocation.push(gameGridArray[columnIndex+i][rowIndex].charAt(1))
      }
      if(potentialBoatLocation.includes("b")===false){
        //actually place the boat and change the 'placed status to true'
        for (let b=0; b<boatLength; b++){
          if(gameGridArray[columnIndex+b][rowIndex]==='w' ){
            if(b===0){
              gameGridArray[columnIndex+b][rowIndex]='vb1'
            } else if(b===boatLength-1){
              gameGridArray[columnIndex+b][rowIndex]='vb3'
            } else {
              gameGridArray[columnIndex+b][rowIndex]='vb2'
            }
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
function boatOrient(){
  shipOrientation === 'vertical' ? shipOrientation = 'horizontal' : shipOrientation = 'vertical'
  boatOrientationButton.innerHTML = shipOrientation
}

// processes the users guesses and updates the coutners for ammo/hits and misses
function guessShip(){
  if(gameGridState!=='winner' && gameGridState==='guess'){  
    if(gameGridArray[columnIndex][rowIndex].charAt(0)==='h'){
      if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '1'){
        gameGridArray[columnIndex][rowIndex]='eh1'
        hits++
      } else if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '2'){
        gameGridArray[columnIndex][rowIndex]='eh2'
        hits++
      } else if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '3'){
        gameGridArray[columnIndex][rowIndex]='eh3'
        hits++
      }
    } else if (gameGridArray[columnIndex][rowIndex].charAt(0)==='v'){
      if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '1'){
        gameGridArray[columnIndex][rowIndex]='ev1'
        hits++
      } else if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '2'){
        gameGridArray[columnIndex][rowIndex]='ev2'
        hits++
      } else if (gameGridArray[columnIndex][rowIndex].charAt(2)=== '3'){
        gameGridArray[columnIndex][rowIndex]='ev3'
        hits++
      }
    } else if (gameGridArray[columnIndex][rowIndex]==='w'){
        gameGridArray[columnIndex][rowIndex]='m'
        misses++
    }
  ammo--
  render()
  winnerYet()
  }
}

// checks the various conditions of time/ammo and boats to see if there is a winner
function winnerYet(){
  let winnerCheck=[]
  gameGridArray.forEach(arr => {
    arr.forEach(element => {
      winnerCheck.push(element.charAt(1))
    })
  })
  if(winnerCheck.includes('b')===false){
    gameGridState = 'winner'
    messages.innerHTML = `You win! You sank the fleet!`
  } else if (ammo === 0){
    gameGridState = 'winner'
    messages.innerHTML = `Out of ammo! You Lost!!`
  } else if (timeLeft === 0){
    gameGridState = 'winner'
    messages.innerHTML = `Out of time! You Lost!!`
  }
}

// countdown timer for player 2 starts as soon as gameState switches to guess
function timer() {
    let countdown = setInterval(()=> {
    boatsSelection[1].innerText = `${timeLeft} seconds`
    timeLeft -=1
    if (timeLeft<=0) {
      boatsSelection[1].innerText = "Time's up!"
      winnerYet()
      clearInterval(countdown)
    }}, 1000)
    
}

function popupModal(){
  if(gameGridState!=='transition'){
    popup.innerHTML = getRules() 
  $('#popModul').modal()
  }

  if (gameGridState==='transition'){
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