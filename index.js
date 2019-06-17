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

/**** Classes  ****/

// class to hold game state data
class GameState {
  constructor(userName) {
    this.currentRoom = rooms.Main;
    // current player
    this.user = new Player(userName);
  }

  moveToRoom(nextRoom) {
    this.currentRoom = rooms[nextRoom];
  }

  printState() {
    console.log(this);
  }
}

// Room class
class Room {
  constructor(roomName, inventory) {
    this.roomName = roomName;
    this.inventory = inventory || [];
    this.message = roomMessages[this.roomName];
  }
  addToInventory(item) {
    this.inventory.push(item);
  }
  removeFromInventory(item) {
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }
  showInventory() {
    console.log("Room Inv: " + this.inventory);
  }
  // if this returns true un-lock door
  unlockDoor(input) {
    let password = "12345";
    if (input.includes(password)) {
      return true;
    }
  }
}

// Player class
class Player {
  constructor(name, status, inventory) {
    this.name = name;
    this.inventory = inventory || [];
    this.status = status || "Healthy";
  }
  checkName() {
    return this.name;
  }
  checkStatus() {
    return this.status;
  }
  changeStatus(status) {
    this.status = status;
  }
  addToInventory(item) {
    global.game.currentRoom.removeFromInventory(item);
    this.inventory.push(item);
  }
  dropItem(item) {
    this.inventory.splice(this.inventory.indexOf(item), 1);
    global.game.currentRoom.addToInventory(item);
  }
  showInventory() {
    console.log(`Player Inv: ${this.inventory}`);
  }
}
// end classes

/**** Game Logic ****/

async function initGame() {
  let userName = await ask("Hello, what is your name? \n>");
  global.game = new GameState(userName);
  play(global.game.currentRoom);
}

async function play(currentRoom) {
  
  if (currentRoom.roomName === roomNames.Main) {
    mainStreet();
  } else if (currentRoom.roomName === roomNames.Foyer) {
    foyer();
  } else if (currentRoom.roomName === roomNames.Hallway) {
    //Hallway();
  } else if (currentRoom.roomName === roomNames.Classroom) {
    classroom();
  } else {
    console.log("Not a room");
  }
}

// mainStreet() { do stuff... break/return}
// equivalent to level1()
async function mainStreet() {
  console.log(global.game.currentRoom.message);
  let inRoom = true;

  // while loop w/ logic
  while (inRoom) {
    console.log(`Player Status: ${global.game.user.checkStatus()}`);
    let input = await ask('\n>_');
    input = input.toLowerCase();

    if(input.includes('where')) {
      console.log(`You are in ${global.game.currentRoom.roomName}`);
    } else if(input.includes('inventory') || input.length === 1 && input.includes('i')) {
      global.game.user.showInventory();
    } else {
      // read the sign
      if (input.includes("read") && input.includes("sign")) {
        console.log(
          `The sign says "Welcome to Burlington Code Academy! 
Come on up to the third floor. If the door is locked, use the code 12345."`);

      // take the sign
      } else if (input.includes("take") && input.includes("sign")) {
        console.log(`That would be selfish. How will other students find their way?`);

      // open door will not open door
      } else if (input.includes("open") && input.includes("door")) {
        console.log(`The door is locked. There is a keypad on the door handle.`);

        // enter code / key in code to door
      } else if (input.includes("enter code") || input.includes("key in") || input.includes("code")) {
        let code = input.slice(input.length - 5);

        if (global.game.currentRoom.unlockDoor(code)) {
          // if code matches password
          console.log(`Success! The door opens. You enter the foyer and the door shuts behind you.\n`);
          global.game.moveToRoom('Foyer'); // move to desired room
          inRoom = false;
        } else {
          console.log(`BZZZTT wrong code`);
        }
      } else if (input.includes("mr mikes") || input.includes("eat")){
        console.log('You go eat and grab a beer.');
        global.game.user.changeStatus('Full and Happy');
        process.exit();
        // catch-all for unrecognized input
      } else {
        console.log(`Sorry I don't know how to ${input}`);
      }
    }
  } // end while

  play(global.game.currentRoom);
}

// foyer() {}
async function foyer() {
  console.log(global.game.currentRoom.message);
  let inRoom = true;

  // write Foyer logic block
  while (inRoom) {
    console.log(`Player Status: ${global.game.user.checkStatus()}`);
    let input = await ask('\n>_');
    input = input.toLowerCase();

    if(input.includes('where')) {
      console.log(`You are in ${global.game.currentRoom.roomName}`);
    } else if(input.includes('inventory') || input.length === 1 && input.includes('i')) {
      global.game.user.showInventory();
    } else {
      // take the seven days paper
      if ( input.includes("take") && (input.includes("paper") || input.includes("seven days")) ) {

        if (!global.game.user.inventory.find(item => item === "seven days")) {
          global.game.user.addToInventory("seven days");
        } else {
          console.log("You already picked that up");
        }
        global.game.user.showInventory();
        global.game.currentRoom.showInventory();
      
        // drop the seven days paper
      } else if ( input.includes("drop") && (input.includes("paper") || input.includes("seven days")) ) {

        if (global.game.user.inventory.find(item => item === "seven days")) {
          global.game.user.dropItem("seven days");
        } else {
          console.log("You don't has that item");
        }
        global.game.user.showInventory();
        global.game.currentRoom.showInventory();
      } else if (input.includes("go") && input.includes("upstairs")) {
        global.game.moveToRoom('Classroom');
        inRoom = false;
      } else if (input.includes("go") && input.includes("outside")){
        global.game.moveToRoom('Main');
        inRoom = false;
        // catch-all for unrecognized input
      } else {
        console.log(`Sorry I don't know how to ${input}`);
      }
    }
  } // end while
  // go to the next room
  play(global.game.currentRoom);
}


async function classroom() {
  console.log(global.game.currentRoom.message);
 
  let inRoom = true;

  // write Foyer logic block
  while (inRoom) {
    console.log(`Player Status: ${global.game.user.checkStatus()}`);
    let input = await ask('\n>_');
    input = input.toLowerCase();

    if(input.includes('where')) {
      console.log(`You are in ${global.game.currentRoom.roomName}`);
    } else if(input.includes('inventory') || input.length === 1 && input.includes('i')) {
      global.game.user.showInventory();
    } else {

      // take the seven days paper
      if ( input.includes("attend lecture") || input.includes("sit") ) {
        console.log('You sit down in your normal seat. And Josh begins the lecture about recursion.');
        global.game.user.changeStatus('Confused and Hungry');

        // drop the seven days paper
      } else if (input.includes("go") && input.includes("downstairs")) {
        global.game.moveToRoom('Foyer');
        inRoom = false;

        // catch-all for unrecognized input
      } else {
        console.log(`Sorry I don't know how to ${input}`);
      }
    }
  } // end while
  // go to the next room
  play(global.game.currentRoom);
}

/**** Stand alone objects ****/

let roomNames = {
  Main: "182 Main Street",
  Foyer: "182 Main Street - Foyer",
  Hallway: "Upstairs Hallway",
  Classroom: "Second floor BCA Classroom"
};

let roomMessages = {
  "182 Main Street":
  `\n${roomNames.Main}:
    You are standing on Main Street between Church and South Winooski.
    There is a door here.A keypad sits on the handle.
    On the door is a handwritten sign. `,

  "182 Main Street - Foyer":
  `\n${roomNames.Foyer}:
    You are in a foyer. Or maybe it's an antechamber. Or a vestibule. 
    Or an entryway. Or an atrium. Or a narthex. 
    But let's forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont,
    this is pronounced "FO-ee-yurr". A copy of Seven Days lies in a corner.`,

  "Upstairs Hallway":
  `\n${roomNames.Hallway }:
    You are standing at the top of the stairs.`,

  "Second floor BCA Classroom":
    `\n${roomNames.Classroom}:
      You are in the classroom. Josh is standing at the 
      front waiting of the classroom`
};

let rooms = {
  Main: new Room(roomNames.Main, ["welcome sign"]),
  Foyer: new Room(roomNames.Foyer, ["seven days"]),
  Hallway: new Room(roomNames.Hallway),
  Classroom: new Room(roomNames.Classroom)
};

// play game
initGame();
//play();
