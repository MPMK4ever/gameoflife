document.addEventListener('DOMContentLoaded', function (event) {
    var canvas = document.querySelector("#game");
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error("Element is not a canvas");
        return;
    }
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Unable to get canvas context!");
        return;
    }
    var width = canvas.width;
    var height = canvas.height;
    var TILE_SIZE = 20;
    var TILES_X = width / TILE_SIZE;
    var TILES_Y = height / TILE_SIZE;
    ctx.fillStyle = "rgb(100, 240, 150)";
    ctx.strokeStyle = "rgb(90, 90, 90)";
    ctx.lineWidth = 0.5;
    var isGamePaused = false;
    var gameSpeed = 1000;
    var drawBorders = function () {
        for (var i = 0; i < TILES_X; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE - 0.5, 0);
            ctx.lineTo(i * TILE_SIZE - 0.5, height);
            ctx.stroke();
        }
        for (var i = 0; i < TILES_Y; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * TILE_SIZE - 0.5);
            ctx.lineTo(width, i * TILE_SIZE - 0.5);
            ctx.stroke();
        }
    };
    var prepareBoard = function () {
        var board = [];
        for (var i = 0; i < TILES_X; i++) {
            var row = [];
            for (var j = 0; j < TILES_Y; j++) {
                row.push(false);
            }
            board.push(row);
        }
        return board;
    };
    var BOARD = prepareBoard();
    var isAlive = function (x, y) {
        if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) {
            return 0;
        }
        return BOARD[x][y] ? 1 : 0;
    };
    var neighboursCount = function (x, y) {
        var count = 0;
        for (var _i = 0, _a = [-1, 0, 1]; _i < _a.length; _i++) {
            var i = _a[_i];
            for (var _b = 0, _c = [-1, 0, 1]; _b < _c.length; _b++) {
                var j = _c[_b];
                if (!(i === 0 && j === 0)) {
                    count += isAlive(x + i, y + j);
                }
            }
        }
        return count;
    };
    var drawBoard = function () {
        for (var i = 0; i < TILES_X; i++) {
            for (var j = 0; j < TILES_Y; j++) {
                if (!isAlive(i, j)) {
                    continue;
                }
                ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    };
    var computeNextGeneration = function () {
        var board = prepareBoard();
        for (var i = 0; i < TILES_X; i++) {
            for (var j = 0; j < TILES_Y; j++) {
                if (isAlive(i, j)) {
                    var count = neighboursCount(i, j);
                    if (count === 2 || count === 3) {
                        board[i][j] = true;
                    }
                }
                else {
                    if (neighboursCount(i, j) === 3) {
                        board[i][j] = true;
                    }
                }
            }
        }
        return board;
    };
    var clear = function () {
        ctx.clearRect(0, 0, width, height);
    };
    var drawAll = function () {
        clear();
        drawBoard();
        drawBorders();
    };
    var nextGen = function () {
        if (isGamePaused) {
            return;
        }
        BOARD = computeNextGeneration();
        drawAll();
    };
    var nextGenLoop = function () {
        nextGen();
        setTimeout(nextGenLoop, gameSpeed);
    };
    BOARD[1][0] = true;
    BOARD[2][1] = true;
    BOARD[0][2] = true;
    BOARD[1][2] = true;
    BOARD[2][2] = true;
    canvas.addEventListener("click", function (e) {
        var x = Math.floor((e.clientX - canvas.offsetLeft) / TILE_SIZE);
        var y = Math.floor((e.clientY - canvas.offsetTop) / TILE_SIZE);
        BOARD[x][y] = !BOARD[x][y];
        drawAll();
    });
    var generateRandom = function () {
        var board = prepareBoard();
        for (var i = 0; i < TILES_X; i++) {
            for (var j = 0; j < TILES_Y; j++) {
                board[i][j] = Math.random() < 0.3;
            }
        }
        return board;
    };
    var clearBoard = function () {
        BOARD = prepareBoard();
        drawAll();
    };
    // Select buttons
    var startButton = document.getElementById('start');
    var pauseButton = document.getElementById('pause');
    var clearButton = document.getElementById('clear');
    var randomButton = document.getElementById('random');
    var fastButton = document.getElementById('fast');
    var slowButton = document.getElementById('slow');
    // Start Button Handler
    if (startButton) {
        startButton.addEventListener('click', function () {
            isGamePaused = false;
            // Any other logic you need to start the game
        });
    }
    // Pause Button Handler
    if (pauseButton) {
        pauseButton.addEventListener('click', function () {
            isGamePaused = true;
            // Any other logic you need to pause the game
        });
    }
    // Clear Button Handler
    if (clearButton) {
        clearButton.addEventListener('click', clearBoard);
    }
    // Random Button Handler
    if (randomButton) {
        randomButton.addEventListener('click', function () {
            BOARD = generateRandom();
            drawAll();
        });
    }
    // Increase Speed Button Handler
    if (fastButton) {
        fastButton.addEventListener('click', function () {
            // Decrease the gameSpeed by 100, but not less than 50
            gameSpeed = Math.max(50, gameSpeed - 100);
            console.log("game speed increased", gameSpeed);
            restartGameLoop(); // Restart the loop with new speed
        });
    }
    // Decrease Speed Button Handler
    if (slowButton) {
        slowButton.addEventListener('click', function () {
            // Increase the gameSpeed by 100, but not more than 2000
            gameSpeed = Math.min(2000, gameSpeed + 100);
            console.log("game speed decreased", gameSpeed);
            restartGameLoop(); // Restart the loop with new speed
        });
    }
    // Function to restart the game loop with the new speed
    var gameLoopTimeout;
    var restartGameLoop = function () {
        clearTimeout(gameLoopTimeout); // Clear the existing loop
        gameLoopTimeout = setTimeout(nextGenLoop, gameSpeed); // Start a new loop with updated speed
    };
    nextGenLoop();
});
