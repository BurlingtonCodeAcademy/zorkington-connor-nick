/**
 *  Week 2 BCA Project:
 *    Zorkington - a text based adventure game played
 *    using the console modeled after the game 'Zork'
 *    Author: Nick Castle, Connor Greenbaum
 *    Date: 06/13/19
 */

 // readline boilerplate code
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// end readline


// remember the StateMachine lecture
// https://bootcamp.burlingtoncodeacademy.com/lessons/cs/state-machines
let rooms = {
  roomOne: { canChangeTo: ['roomTwo', 'roomFour'] },
  roomTwo: { canChangeTo: ['roomThree'] },
  roomThree: { canChangeTo: ['roomOne'] },
  '182 Main Street': { canChangeTo: ['182 Main Street - Foyer', 'Muddy Waters'] },

};

let currentState = 'roomOne';

function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
    console.log("Moved to: ", currentState);
  } else {
    throw "Invalid state transition attempted - from " +
      currentState +
      " to " +
      newState;
  }
}

// play game
initGame();
//play();


async function initGame() {
  let userName = await ask("Hello, what is your name? \n>");
  global.game = new GameState(userName);
  //let user = new Player(userName);
  play();
}

async function play(room = '182 Main Street') {
  // print welcome message to screen
  //roomMessage(room);

  let answer = await ask(roomMessage(room));
  console.log({ answer });
  let playing = true;

  // start game loop
  while (playing) {
    
    
    //processInput(answer);
    //answer = await ask("> ");
    
    // if global current room === 182 main street
      // mainStreet()
    // else if currentRoom === 182 main foyer
      // foyer()
    // else if currentRoom === classroom
      // classroom()
    
    if (answer.includes('quit')) {
      playing = false;
    }
    console.log('end play while');
  }
  process.exit();
}

function roomMessage(room) {
  if (room === '182 Main Street') {
    return (
    `${room}:
    Hello, ${global.game.user.name}!
    You are standing on Main Street between Church and South Winooski.
    There is a door here. A keypad sits on the handle.
    On the door is a handwritten sign.\n>`);
  } else if (room === '182 Main Street - Foyer') {
    return (
    `${room}:
    You are in a foyer. Or maybe it's an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. 
    But let's forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced
    "FO-ee-yurr". A copy of Seven Days lies in a corner.\n>`);
  }
}

// mainStreet() { do stuff... break/return}

// foyer() {}

// function that takes input from the user
// and does some action based on input
function processInput(input) {
  if(input.includes('where')) {
    console.log(`You are in ${global.game.currentRoom}`);
  } else if(input.includes('inventory') || input.length === 1 && input.includes('i')) {
    global.game.user.showInventory();
  } else {
    // switch block
    switch (global.game.currentRoom) {
      case "182 Main Street":

        // read the sign
        if (input.includes("read") && input.includes("sign")) {
          console.log(
            `The sign says "Welcome to Burlington Code Academy! 
            Come on up to the third floor. If the door is locked, use the code 12345."`
          );

          // take the sign
        } else if (input.includes("take") && input.includes("sign")) {
          console.log(
            `That would be selfish. How will other students find their way?`
          );

          // open door will not open door
        } else if (input.includes("open") && input.includes("door")) {
          console.log(
            "The door is locked. There is a keypad on the door handle."
          );

          // enter code / key in code to door
        } else if (input.includes("enter code") || input.includes("key in") || input.includes("code")) {
          let code = input.slice(input.length - 5);
          console.log({ code });

          if (code === global.game.password) {
            // if code matches password
            console.log(
            `Success! The door opens. You enter the foyer and the door 
            shuts behind you.`
            );
            global.game.moveToRoom("182 Main Street - Foyer"); // move to desired room
          } else {
            console.log(`BZZZTT you done fucked up`);
          }

          // catch-all for unrecognized input
        } else {
          console.log(`Sorry I don't know how to ${input}`);
        }
        break;
      case "182 Main Street - Foyer":
        // write Foyer logic block
        if ( (input.includes("take") && input.includes("paper")) || input.includes("seven days")) {
          if (!global.game.user.inventory.find(item => item === "seven days")) {
            global.game.user.addToInventory("seven days");
          } else {
            console.log("You already picked that up");
          }
          global.game.user.showInventory();
        } else if ((input.includes("drop") && input.includes("paper")) || input.includes("seven days")) {

          if (global.game.user.inventory.find(item => item === "seven days")) {
            global.game.user.dropItem("seven days");
          } else {
            console.log("You don't has that item");
          }
          global.game.user.showInventory();

        } else {
          console.log(`Sorry I don't know how to ${input}`);
        }
        break;
    
    } // end switch
  } // end else
} // end processInput


// class to hold game state data
class GameState {
  constructor(userName) {
    this.currentRoom = "182 Main Street";
    // current player
    this.user = new Player(userName);
    this.password = '12345';
  }
  moveToRoom(room) {
    this.currentRoom = room;
    // call function
    play(this.currentRoom);
  }
  printState() {
    console.log(`currRoom: ${this.currentRoom}`);
  }
};

// Room class
class Room {
  // constructor
    // name
    // inventory
    // list/array of actions (look at sign, open door)
    constructor(roomName) {
      this.name = roomName;
      if (roomName === '182 Main Street') {
        inventory = [];
      }
      if (roomName.includes('Foyer')) {
        inventory = ['seven days'];
      }
    }

};

// Player class
class Player {
  // has an inventory
  // has a status
  constructor(name) {
    this.name = name;
    this.inventory = [];
    this.status = 'Healthy';
  }
  changeStatus(status) {
    this.status = status;
  }
  addToInventory(item) {
    this.inventory.push(item);  
  }
  dropItem(item){
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }
  showInventory() {
    console.log(`Inv: ${this.inventory}`)
  }
  
}