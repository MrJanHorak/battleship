const rules = [
"Secretly deploy your fleet of 5 ships on your ocean grid. <br/><br/>To place each ship, click on a ship and place it on the ocean by clicking anywhere in the blue playing field. You can change the orientaion of the ship between 'horizontal' and 'vertical' by clicking on the button.<br/><br/>After placing your fleet a pop-up will appear and player 2 can take the captain's chair and begin guessing where your ships may be.<br/><br/>And oh playet two has been able to sneak a spy on board of the last ship. So don't be surprised if something goes BOOM!" ]

const player2 = [
"Player 1 has placed the entire fleet in the ocean.<br/><br/>To guess a location simply click a square in the ocean grid. The computer will let  you know if your guess was a hit or miss.<br/><br/>Have fun!<br/><br/>To begin guessing close this popup by clicking on the screen.<br />Your spy has been compromised! Player 1's Intel officers are attempting to hack into your system and take control of your fleet!<br/> <br/>Now time and a low ammo supply are against you!<br/>Oh and the countdown has already started!!"]

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