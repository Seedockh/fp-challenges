export {}
type NullaryFunc<T> = () => T
type TertiaryFunc<T, U, V> = (x: T, y: U, z: U) => T

type Line = number[]
type Board = Line[]

const setup = (): Board => new Array(8).fill(new Array(8).fill(0)) 
const display = (board: Board): void[] => board.map(line => console.log(line.join(' ')))

const add = (board: Board, line: number, box: number): Board => {
    for (let [i, boardLine] of board.entries()) {
        if (i === line) board[i] = boardLine.map((x: number): number => 1)
        else {
            for (let [j, b] of boardLine.entries()) {
                if (j === box) board[i][j] = 1
            }
        }
    }
    return board
}

const game = (
    fSetup: NullaryFunc<Board>,
    fAdd: TertiaryFunc<Board, number, number>,
) => () => {
        const eightQueens = fSetup()
        return fAdd(eightQueens, 3, 3)
    }

let eightQueens = game(setup, add)()
display(eightQueens)