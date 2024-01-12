import { GameBoard } from './script';

describe('GameBoard', () => {
    let ctxMock: CanvasRenderingContext2D;
    let gameBoard: GameBoard;

    beforeEach(() => {
        ctxMock = {
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            strokeRect: jest.fn(),
         
        } as unknown as CanvasRenderingContext2D;

        gameBoard = new GameBoard(ctxMock, 100, 100);
    });

    test('initializes with a correct board size', () => {
        const tileSize = gameBoard.tileSize;
        expect(gameBoard.getBoard().length).toBe(100 / tileSize);
        expect(gameBoard.getBoard()[0].length).toBe(100 / tileSize);
    });
    

    test('toggles cell state', () => {
        gameBoard.toggleCellState(1, 1);
        expect(gameBoard.getBoard()[1][1]).toBeTruthy();

        gameBoard.toggleCellState(1, 1);
        expect(gameBoard.getBoard()[1][1]).toBeFalsy();
    });

    test('clears the board', () => {
        gameBoard.toggleCellState(1, 1);
        gameBoard.clearBoard();
        expect(gameBoard.getBoard()[1][1]).toBeFalsy();
    });

   
});