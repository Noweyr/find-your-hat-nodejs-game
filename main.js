// Ways to improve game:
// 1) Have character start on random location
// 2) Create "Hard Mode" where one or more holes added after certain turns
// 3) Improve games graphics: https://github.com/cronvel/terminal-kit
// 4) Create field validator to ensure game can actually be solved by
//    creating "maze solver" https://en.wikipedia.org/wiki/Maze-solving_algorithm

const prompt = require('prompt-sync')({sigint: true});

class Field {
    constructor(field) {
        this.field = field;
        this.x = 0;
        this.y = 0;
        this.move = '';
    }

    // Displays the game board on the console
    print() {
        for (let i = 0; i < this.field.length; i++) {
        console.log(this.field[i].join(''));
        }
    }

    // Prompts the user to input their move
    prompt() {
        this.move = prompt('Make your move: ');
    }

    // Handles if the user inputs an invalid character
    invalidMove() {
        this.move = prompt('Invalid move. Enter U D L or R: ')
    }

    // Formats user input and increments x or y as necessary
    playerMove() {
        let formattedMove = this.move.toUpperCase();
        if (formattedMove === 'U') {
            this.y--;
        } else if (formattedMove === 'D') {
            this.y++;
        } else if (formattedMove === 'L') {
            this.x--;
        } else if (formattedMove === 'R') {
            this.x++;
        } else {
            this.invalidMove();
            this.playerMove();
        }
    }

    // Checks to see if user moved off the map and if not then checks to see if user
    // landed on a blank mark, a hole, or hat and updates accordingly
    checkMove() {
        if (this.x < 0 || this.y < 0) {
            console.log('You moved off the game board!');
            process.exit();
        }

        if (this.field[this.y][this.x] === '░') {
            this.field[this.y][this.x] = '*';
        } else if (this.field[this.y][this.x] === 'O') {
            console.log('You fell into a hole!');
            process.exit();
        } else if (this.field[this.y][this.x] === '^') {
            console.log('You found your hat!');
            process.exit();
        } else if (this.field[this.y][this.x] === '*') {
            console.log('You backtracked!');
            process.exit();
        }
    }

    // Generates a random field
    static generateField(height, width, percentHoles) {

        let fieldArray = [...Array(height)].map(e => Array(width).fill(''));

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (Math.floor(Math.random() * 100) <= percentHoles) {
                    fieldArray[i][j] = 'O';
                } else {
                    fieldArray[i][j] = '░';
                }
            }
        }

        let hatX = Math.floor(Math.random() * width);
        let hatY = Math.floor(Math.random() * height);

        // Prevents edge case of hat landing on player starting point
        while (hatX === 0 && hatY === 0) {
            hatX = Math.floor(Math.random() * width);
            hatY = Math.floor(Math.random() * height);
        }

        fieldArray[0][0] = '*';
        fieldArray[hatY][hatX] = '^';
        return fieldArray;
    }

    // Loops through each methods in order and finally calls itself recursively
    run() {
        this.print();
        this.prompt();
        this.playerMove();
        this.checkMove();
        this.run();
    }
}

// Allows user selection of game parameters
let inputWidth = prompt('Enter field width (50ish recommended): ');
inputWidth = parseInt(inputWidth, 10);
let inputHeight = prompt('Enter field height (25ish recommended): ');
inputHeight = parseInt(inputHeight, 10);
let inputPercentHoles = prompt('Enter percent holes (20ish recommended): ');
inputPercentHoles = parseInt(inputPercentHoles, 10);

// Calls Field static method to generate random field when program is ran
const gameField = new Field(Field.generateField(inputHeight, inputWidth, inputPercentHoles));

// Runs the program
gameField.run();