const rules = [
"Secretly place your fleet of 5 ships on your ocean grid. <br />To place each ship, drag onto the ocean grid. <br /> After placing your fleet a pop-up will appear and you can allow player two to sit and begin guessing where your ships may be." ]

const player2 = [
" Player 1 has placed the entire fleet in the ocean. It is now your turn to mount an attack and try to sink the fleet as fast as possile. <br /> You will be scored on your speed and your accuracy. <br /> To guess a location simply click a square in the ocean grid. The computer will let  you know if your guess was a hit or miss. <br /> <br/> Have fun! To begin guessing close this popup.<br />You have 50 shots and less than 30 seconds before Player 1 agents hack your fleet`"]

function getRules(){
  return rules
}
function getPlayer2(){
  return player2
}

export {
  getRules,
  getPlayer2
}