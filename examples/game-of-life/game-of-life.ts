import { Either, left, maybe, right } from '../../src'
import { repeat } from '../../src/lambda/lambda'

type Cell = Either<string, string>

const createAliveCell = (): Cell => right('*')

const createDeadCell = (): Cell => left('.')

type CheckPatterns = [row: number, col: number][]

const createCheckPattern = (row: number, col: number): CheckPatterns => [
	[row - 1, col - 1],
	[row - 1, col],
	[row - 1, col + 1],
	[row, col + 1],
	[row, col - 1],
	[row + 1, col - 1],
	[row + 1, col],
	[row + 1, col + 1],
]

export interface GameOfLife {
	countLivingNeighbours(row: number, col: number): number

	setLivingCell(row: number, col: number): void

	isDead(row: number, col: number): boolean

	isAlive(row: number, col: number): boolean

	computeNextGeneration(): void

	dumpGrid(): string
}

type GameOfLifeState = {
	grid: Cell[][]
}

const createInitialState = (width: number, height: number): GameOfLifeState => ({
	grid: repeat(height, () => repeat(width, createDeadCell)),
})

export const createGameOfLife = (width: number, height: number): GameOfLife => {
	const state: GameOfLifeState = createInitialState(width, height)

	const getCell = (row: number, col: number) => maybe(state.grid[row]).flatMap((it) => maybe(it[col]))

	const setLivingCell = (row: number, col: number): void => {
		maybe(state.grid[row]).fold(
			() => {},
			(it) => {
				it[col] = createAliveCell()
			}
		)
	}

	const countLivingNeighbours = (row: number, col: number) =>
		createCheckPattern(row, col).reduce(
			(acc, [rowIndex, colIndex]) =>
				getCell(rowIndex, colIndex).fold(
					() => acc,
					(it) =>
						it.fold(
							() => acc,
							() => acc + 1
						)
				),
			0
		)

	const isDead = (row: number, col: number) =>
		getCell(row, col).fold(
			() => false,
			(it) => it.isLeft
		)

	const isAlive = (row: number, col: number) =>
		getCell(row, col).fold(
			() => false,
			(it) => it.isRight
		)

	const createNextGeneration = (): Cell[][] =>
		state.grid.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				const livingNeighbours = countLivingNeighbours(rowIndex, colIndex)

				if (livingNeighbours === 3) return createAliveCell()

				return cell.flatMap((it) => (livingNeighbours < 2 || livingNeighbours > 3 ? createDeadCell() : right(it)))
			})
		)

	const computeNextGeneration = (): void => {
		state.grid = createNextGeneration()
	}

	const dumpGrid = (): string => state.grid.map((row) => row.map((cell) => cell.fold()).join('')).join('\n')

	return {
		countLivingNeighbours,
		setLivingCell,
		isDead,
		isAlive,
		computeNextGeneration,
		dumpGrid,
	}
}
