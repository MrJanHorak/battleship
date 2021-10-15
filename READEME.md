 Pseudocode for Battleship
Minimal viable Game setup
  * one player places boats
  * one player guesses boats locations  
  * game over when all boats are sunk
    * or a specific time limit or number of guesses reached?
  
setup game variables

  * one array of arrays for the board (10 x 10 grid)
      // html divs and css grid areas?
  * 5 boat arrays or objects 
    * carrier 5 indexes long
    * battleship 4 inxeses long
    * submarine 3 indexes long
    * cruiser 3 indexes long
    * destroyer 2 indexes long
      * sinkOrSwim = boat index content values Si or Sw
      * default would be Sw
      * each boat has a specific letter associated with it? 
  * number of hits
  * number of guesses counter
  * gamestate === guess or place
  * shipOrientation === horizontal or vertical
  * whoWins === null/player1 or player2

//set up eventListener

  * click on grid for boat placement 
    * horizontal and vertical (that is going to take some research)
  * click on grid for guess 
  ==> same eventlistener two functions depending on Gamestate
      ==>2 game states (guess or place)

//needed functions

 * init() for initial game set-up and reset
    * sets game to gamestate place
    * sets empty grid
    * resets guesses counter
    * resets hits counter
    * checks darkmode preference and sets accordingly
  
 * render() 
    * to show boat placement when initially placed
    * to update the guesses hit or miss
  
* hitOrMiss()
    * to compare clickEvent to placementGris array
    * changes the value of the boats status for that index/grid location
  
* placeShip() stores placement of boat when placed.
    * needs to record across several indexes depening on shipType
    * needs to account for shipOrientation

* whoWins()
    * if number of allowed guesses is reached or time limit before guessed then player one wins
    * if all the boats are sunk player 2 wins
      * all boats sunk when all boats sink or swim value is on sink
  
* changeBoatStatus()
    * iterates through the boats to see if they are sunk or not
      * might mean a boat will need a special indicator in the grid
      * for instance d0 for first index of destroyer.
      * need to potentially extract that info for a function?

Wireframe ideas:
  player 1 beginning screen: https://wireframe.cc/kP4kLt
  player 2 beginning screen: https://wireframe.cc/IXlIqW


Foreseen challenges:
  * ship placement with mouse. Could just use grid coordinates. Need to research/think this through
  * Updateing the grid if boat is vertical. Have some initial ideas,need to think through the logic.
  * CSS representation of the game. Basic minimal is just changing background color of each grid depening on content of boat info.
    * red for hit
    * blue for water
    * white for miss
  
Future features:(DO NOT PRIORITIZE OR GET DISTRACTED BY THESE OPTIONS)

* ask user how many guesses the player2 is allowed to make
* keep score for two rounds so both players have a chance of guessing
* Player 1 and Player 2 actually alternate at guessing.
    --> both grids saved and compared
* Computer Player
  
