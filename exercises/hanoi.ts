export {}
type UnaryFunc<T, U> = (x: T) => U
type TertiaryFunc<T, U, V> = (x: T, y: U, z: V) => T
type QuatraryFunc<T, U> = (w: T, x: T, y: T, z: U) => U
type InfinaryFunc<T, U, V> = (x: T, y: U[]) => V
type Result<T, U, V> = { board: T, iterations: U, totalTime: V }

type Board = { 0: number[], 1: number[], 2: number[] }
type DiscPosition = { towerIndex: number, discIndex: number }

const setup = (n: number): Board => {
    return {
        0: Array.from(Array(n), (x, y: number): number => y).reverse(),
        1: [],
        2: [],
    }
}

const getNextPos = (pos: DiscPosition, n: number, board: Board): DiscPosition => {
    let nextTowerIndex: number = pos.towerIndex === 2 ? 0 : pos.towerIndex + 1
    let nextTower: number[] = board[nextTowerIndex]
    let nextDisc: number = nextTower[nextTower.length - 1]

    if ((nextDisc === undefined || board[pos.towerIndex][pos.discIndex] < nextDisc) && ((nextTowerIndex < 2 && nextTower.length + 1 < n) || nextTowerIndex === 2)) {
        return { towerIndex: nextTowerIndex, discIndex: nextTower.length > 0 ? nextTower.length : 0 }
    } else {
        nextTowerIndex = nextTowerIndex === 2 ? 0 : nextTowerIndex + 1
        nextTower = board[nextTowerIndex]
        nextDisc = nextTower[nextTower.length - 1]

        if ((nextDisc === undefined || board[pos.towerIndex][pos.discIndex] < nextDisc) && ((nextTowerIndex < 2 && nextTower.length + 1 < n) || nextTowerIndex === 2)) {
            return { towerIndex: nextTowerIndex, discIndex: nextTower.length > 0 ? nextTower.length : 0 }
        } else {
            return null
        }
    }
}

const getOtherDisc = (board: Board, avoid: number[]): DiscPosition => {
    let discPos: DiscPosition
    for (const tower in board) {
        if (discPos === undefined && board[tower].length > 0) {
            if (board[tower].filter(disc => avoid.indexOf(disc) > -1).length === 0) {
                discPos = { towerIndex: parseInt(tower), discIndex: board[tower].length - 1 }
            }
        }
    }
    return discPos
}

const displace = (disc: number, from: number, to: number, board: Board): Board => {
    return {
        ...board,
        [from]: board[from].filter((d: number, index: number) => index !== board[from].length - 1),
        [to]: [...board[to], disc]
    }
}

const game = (
    fSetup: UnaryFunc<number, Board>, 
    fGetNextPos: TertiaryFunc<DiscPosition, number, Board>, 
    fGetOtherDisc: InfinaryFunc<Board, number, DiscPosition>,
    fDisplace: QuatraryFunc<number, Board>
    ): UnaryFunc<number, Result<Board, number, string>> => {
    return (n: number): Result<Board, number, string> => {
        const start = new Date().getTime()
        let nbIterations: number = 0
        let hanoi: Board = fSetup(n)
        let smallestPos: DiscPosition = { towerIndex: 0, discIndex: n - 1 }

        while (hanoi[2].length < n) {
            // move smallest
            const nextSmallestPos: DiscPosition = fGetNextPos(smallestPos, n, hanoi)
            const smallestVal: number = hanoi[smallestPos.towerIndex][smallestPos.discIndex]
            hanoi = fDisplace(smallestVal, smallestPos.towerIndex, nextSmallestPos.towerIndex, hanoi)
            nbIterations++
            smallestPos = nextSmallestPos

            if (hanoi[2].length < n) {

                // move non-smallest piece
                let toAvoid: number[] = [0]
                let otherPos: DiscPosition
                let nextOtherPos: DiscPosition = null

                while (nextOtherPos === null) {
                    otherPos = fGetOtherDisc(hanoi, toAvoid)
                    nextOtherPos = fGetNextPos(otherPos, n, hanoi)

                    if (toAvoid.length >= n) {
                        console.log('No disk can move anymore !')
                        break
                    }

                    if (nextOtherPos === null) {
                        toAvoid.push(hanoi[otherPos.towerIndex][otherPos.discIndex])
                    }
                }

                const otherVal: number = hanoi[otherPos.towerIndex][otherPos.discIndex]
                hanoi = fDisplace(otherVal, otherPos.towerIndex, nextOtherPos.towerIndex, hanoi)
                nbIterations++
            }

            // Safety check
            if (nbIterations > Math.pow(2, n)) break
        }

        const end = new Date().getTime()
        return {
            board: hanoi, 
            iterations: nbIterations, 
            totalTime: `${end - start} ms`,
        }
    }
}



const hanoi = game(setup, getNextPos, getOtherDisc, displace)(20)

console.log(hanoi)
