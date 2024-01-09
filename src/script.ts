 document.addEventListener('DOMContentLoaded', (event) => {
     const canvas = document.querySelector("#game");
     

     if (!canvas) {
         console.error("Canvas element not found!");
         return;
     }

     if (!(canvas instanceof HTMLCanvasElement)) {
         console.error("Element is not a canvas");
         return;
    }

     const ctx = canvas.getContext("2d");

     if (!ctx) {
         console.error("Unable to get canvas context!");
         return;
     }
    
    const width = canvas.width;
    const height = canvas.height;
    
    const TILE_SIZE = 20;
    const TILES_X = width / TILE_SIZE;
    const TILES_Y = height / TILE_SIZE;

    ctx.fillStyle = "rgb(100, 240, 150)";
    ctx.strokeStyle = "rgb(90, 90, 90)";
    ctx.lineWidth = 0.5;

    let isGamePaused = false;
    let gameSpeed = 1000;


    const drawBorders = () => {
        for (let i = 0; i < TILES_X; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE - 0.5, 0);
            ctx.lineTo(i * TILE_SIZE - 0.5, height);
            ctx.stroke();
        }

        for (let i = 0; i < TILES_Y; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * TILE_SIZE - 0.5);
            ctx.lineTo(width, i * TILE_SIZE - 0.5);
            ctx.stroke();
        }
    };

    const prepareBoard = (): boolean[][] => {
        const board: boolean[][] = [];
        for (let i = 0; i < TILES_X; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < TILES_Y; j++) {
                row.push(false);
            }
            board.push(row);
        }
        return board;
    }
    
    let BOARD = prepareBoard();

    const isAlive = (x: number, y: number): number => {
        if (x <0 || x>= TILES_X || y < 0 || y >= TILES_Y) {
            return 0;
        }
        return BOARD[x][y] ? 1: 0;
    }

    const neighboursCount = (x: number, y: number): number => {
        let count = 0;
        for(let i of [-1,0,1]){
            for(let j of [-1,0,1]){
                if(! (i=== 0 && j === 0)) {
                    count += isAlive(x +i, y +j);
                }
            }
        }
        return count;
    }

    const drawBoard = () => {
        for(let i=0;i<TILES_X;i++) {
            for(let j=0;j<TILES_Y;j++) {
                if (!isAlive(i,j)) {
                    continue;
                }
                ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    const computeNextGeneration = () => {
        const board = prepareBoard();
        for(let i=0;i<TILES_X;i++) {
            for(let j=0;j<TILES_Y;j++) {
                if (isAlive(i, j)) {
                    const count = neighboursCount(i,j);
                    if (count === 2 || count ===3) {
                        board[i][j] = true;
                    }
                } else {
                    if (neighboursCount(i,j)===3) {
                        board[i][j] = true;
                    }
                }
                }
            }
        
        return board;
    }

const clear = () => {
        ctx.clearRect(0,0,width, height);
    }
const drawAll = () => {
    clear();
    drawBoard();
    drawBorders();
}

const nextGen = () => {
    if (isGamePaused) {
        return;
    }
    BOARD = computeNextGeneration();
    drawAll();
}

const nextGenLoop = () => {
    nextGen();
    setTimeout(nextGenLoop, gameSpeed);
}

BOARD[1][0] = true;
BOARD[2][1] = true;
BOARD[0][2] = true;
BOARD[1][2] = true;
BOARD[2][2] = true;

canvas.addEventListener("click", e => {
    const x = Math.floor( (e.clientX - canvas.offsetLeft) / TILE_SIZE);
    const y = Math.floor( (e.clientY - canvas.offsetTop) / TILE_SIZE);
    BOARD[x][y] = !BOARD[x][y];
    drawAll();
});

const generateRandom = () => {
    const board = prepareBoard();
    for(let i=0;i<TILES_X;i++) {
        for(let j=0;j<TILES_Y;j++) {
            board[i][j] = Math.random() < 0.3;
        }
    }
    return board;
}

const clearBoard = () => {
    BOARD = prepareBoard();
    drawAll();
};

    // Select buttons
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const clearButton = document.getElementById('clear');
    const randomButton = document.getElementById('random');
    const fastButton = document.getElementById('fast');
    const slowButton = document.getElementById('slow');

    // Start Button Handler
    if (startButton) {
        startButton.addEventListener('click', () => {
        isGamePaused = false;
        // Any other logic you need to start the game
    });
}

    // Pause Button Handler
    if (pauseButton){
    pauseButton.addEventListener('click', () => {
        isGamePaused = true;
        // Any other logic you need to pause the game
    });
}

    // Clear Button Handler
    if (clearButton) {
        clearButton.addEventListener('click', clearBoard);
}

    // Random Button Handler
    if (randomButton){
    randomButton.addEventListener('click', () => {
        BOARD = generateRandom();
        drawAll();
    });
    }
    
    // Increase Speed Button Handler
if (fastButton) {
    fastButton.addEventListener('click', () => {
        // Decrease the gameSpeed by 100, but not less than 50
        gameSpeed = Math.max(50, gameSpeed - 100);
        console.log("game speed increased", gameSpeed);
        restartGameLoop(); // Restart the loop with new speed
    });
}

// Decrease Speed Button Handler
if (slowButton) {
    slowButton.addEventListener('click', () => {
        // Increase the gameSpeed by 100, but not more than 2000
        gameSpeed = Math.min(2000, gameSpeed + 100);
        console.log("game speed decreased", gameSpeed);
        restartGameLoop(); // Restart the loop with new speed
    });
}

// Function to restart the game loop with the new speed
let gameLoopTimeout;
const restartGameLoop = () => {
    clearTimeout(gameLoopTimeout); // Clear the existing loop
    gameLoopTimeout = setTimeout(nextGenLoop, gameSpeed); // Start a new loop with updated speed
};

nextGenLoop();

});
