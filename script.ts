export class GameBoard {
    private board: boolean[][];
    private ctx: CanvasRenderingContext2D;
    private readonly TILE_SIZE: number = 20;
    private readonly TILES_X: number;
    private readonly TILES_Y: number;
    public isGamePaused: boolean = false;
    public gameSpeed: number = 1000;
    private gameLoopTimeout?: ReturnType<typeof setTimeout>;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.TILES_X = width / this.TILE_SIZE;
        this.TILES_Y = height / this.TILE_SIZE;
        this.board = this.prepareBoard();

        this.initializeBoard();
    }
    public get tileSize(): number {
        return this.TILE_SIZE;
    }

    public getBoard(): boolean[][] {
        return this.board;
    }

    prepareBoard(): boolean[][] {
        const board: boolean[][] = [];
        for (let i = 0; i < this.TILES_X; i++) {
            board.push(new Array(this.TILES_Y).fill(false));
        }
        return board;
    }

    toggleCellState(x: number, y: number): void {
        if (x >= 0 && x < this.TILES_X && y >= 0 && y < this.TILES_Y) {
            this.board[x][y] = !this.board[x][y];
        }
    }

    generateRandomBoard(): void {
        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                this.board[i][j] = Math.random() < 0.3;
            }
        }
    }

    clearBoard(): void {
        this.board = this.prepareBoard();
    }

    drawBoard(): void {
        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                if (this.board[i][j]) {
                    this.ctx.fillRect(i * this.TILE_SIZE, j * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
                }
            }
        }
    }

    drawBorders(): void {
        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                this.ctx.strokeRect(i * this.TILE_SIZE, j * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
            }
        }
    }

    nextGeneration(): void {
        if (this.isGamePaused) {
            return;
        }

        const newBoard = this.prepareBoard();
        for (let x = 0; x < this.TILES_X; x++) {
            for (let y = 0; y < this.TILES_Y; y++) {
                const neighbors = this.countNeighbors(x, y);
                const alive = this.board[x][y];
                newBoard[x][y] = alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
            }
        }

        this.board = newBoard;
        this.draw();
    }

    countNeighbors(x: number, y: number): number {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.TILES_X && ny >= 0 && ny < this.TILES_Y) {
                    count += this.board[nx][ny] ? 1 : 0;
                }
            }
        }
        return count;
    }

    draw(): void {
        this.ctx.clearRect(0, 0, this.TILES_X * this.TILE_SIZE, this.TILES_Y * this.TILE_SIZE);
        this.drawBoard();
        this.drawBorders();
    }

    initializeBoard(): void {
        // Initialize the board with some cells alive for demonstration
        this.board[1][0] = true;
        this.board[2][1] = true;
        this.board[0][2] = true;
        this.board[1][2] = true;
        this.board[2][2] = true;
    }

    startGameLoop(): void {
        this.gameLoopTimeout = setTimeout(() => {
            this.nextGeneration();
            if (!this.isGamePaused) {
                this.startGameLoop();
            }
        }, this.gameSpeed);
    }

    setGameSpeed(speed: number): void {
        this.gameSpeed = speed;
        if (!this.isGamePaused) {
            this.restartGameLoop();
        }
    }
    private restartGameLoop(): void {
        if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
        }
        this.startGameLoop();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector("#game") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Unable to get canvas context!");
        return;
    }

    const game = new GameBoard(ctx, canvas.width, canvas.height);
    game.draw();

    canvas.addEventListener("click", e => {
        const x = Math.floor((e.clientX - canvas.offsetLeft) / game.tileSize);
        const y = Math.floor((e.clientY - canvas.offsetTop) / game.tileSize);
        game.toggleCellState(x, y);
        game.draw();
    });

        // Select buttons
        const startButton = document.getElementById('start');
        const pauseButton = document.getElementById('pause');
        const clearButton = document.getElementById('clear');
        const randomButton = document.getElementById('random');
        const fastButton = document.getElementById('fast');
        const slowButton = document.getElementById('slow');
    
        startButton?.addEventListener('click', () => {
            game.isGamePaused = false;
            game.startGameLoop();
        });
    
        pauseButton?.addEventListener('click', () => {
            game.isGamePaused = true;
        });
    
        clearButton?.addEventListener('click', () => {
            game.clearBoard();
            game.draw();
        });
    
        randomButton?.addEventListener('click', () => {
            game.generateRandomBoard();
            game.draw();
        });
    
        fastButton?.addEventListener('click', () => {
            game.setGameSpeed(Math.max(50, game.gameSpeed - 100));
        });
    
        slowButton?.addEventListener('click', () => {
            game.setGameSpeed(Math.min(2000, game.gameSpeed + 100));
        });
    });