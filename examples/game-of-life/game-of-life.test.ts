import { createGameOfLife, GameOfLife } from './game-of-life'

describe('Game of life', () => {
	let gameOfLife: GameOfLife

	beforeEach(() => {
		gameOfLife = createGameOfLife(8, 4)
	})

	it('foundsNoLivingNeighboursInAnEmptyGrid', () => {
		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(0)
	})

	it('foundsOneLivingNeighbour', () => {
		gameOfLife.setLivingCell(0, 3)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(1)
	})

	it('foundsTwoLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(2)
	})

	it('foundsThreeLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(3)
	})

	it('foundsFourLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(4)
	})

	it('foundsFiveLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)
		gameOfLife.setLivingCell(2, 5)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(5)
	})

	it('foundsSixLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)
		gameOfLife.setLivingCell(2, 5)
		gameOfLife.setLivingCell(2, 4)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(6)
	})

	it('foundsSevenLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)
		gameOfLife.setLivingCell(2, 5)
		gameOfLife.setLivingCell(2, 4)
		gameOfLife.setLivingCell(2, 3)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(7)
	})

	it('foundsHeightLivingNeighbours', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)
		gameOfLife.setLivingCell(2, 5)
		gameOfLife.setLivingCell(2, 4)
		gameOfLife.setLivingCell(2, 3)
		gameOfLife.setLivingCell(1, 3)

		const neighboursCount = gameOfLife.countLivingNeighbours(1, 4)

		expect(neighboursCount).toBe(8)
	})

	it('foundsThreeLivingNeighboursForTheTopLeftCornerCell', () => {
		gameOfLife.setLivingCell(0, 1)
		gameOfLife.setLivingCell(1, 1)
		gameOfLife.setLivingCell(1, 0)

		const neighboursCount = gameOfLife.countLivingNeighbours(0, 0)

		expect(neighboursCount).toBe(3)
	})

	it('foundsThreeLivingNeighboursForTheBottomRightCornerCell', () => {
		gameOfLife.setLivingCell(3, 6)
		gameOfLife.setLivingCell(2, 6)
		gameOfLife.setLivingCell(2, 7)

		const neighboursCount = gameOfLife.countLivingNeighbours(3, 7)

		expect(neighboursCount).toBe(3)
	})

	it('aCellWithFewerThanTwoNeighboursDies', () => {
		gameOfLife.setLivingCell(0, 0)
		gameOfLife.setLivingCell(0, 1)

		gameOfLife.computeNextGeneration()

		expect(gameOfLife.isDead(0, 0)).toBeTruthy()
	})

	it('aCellWithAtLeastTwoNeighboursLives', () => {
		gameOfLife.setLivingCell(0, 0)
		gameOfLife.setLivingCell(0, 1)
		gameOfLife.setLivingCell(1, 1)

		gameOfLife.computeNextGeneration()

		expect(gameOfLife.isAlive(0, 0)).toBeTruthy()
	})

	it('aCellWithMoreThanThreeNeighboursDies', () => {
		gameOfLife.setLivingCell(1, 4)
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)
		gameOfLife.setLivingCell(1, 5)

		gameOfLife.computeNextGeneration()

		expect(gameOfLife.isDead(1, 4)).toBeTruthy()
	})

	it('aDeadCellWithThreeNeighboursGetsAlive', () => {
		gameOfLife.setLivingCell(0, 3)
		gameOfLife.setLivingCell(0, 4)
		gameOfLife.setLivingCell(0, 5)

		gameOfLife.computeNextGeneration()

		expect(gameOfLife.isAlive(1, 4)).toBeTruthy()
	})

	it('testAnHandMadeGrid', () => {
		gameOfLife.setLivingCell(1, 4);
		gameOfLife.setLivingCell(2, 3);
		gameOfLife.setLivingCell(2, 4);

		gameOfLife.computeNextGeneration()

		expect(gameOfLife.dumpGrid()).toBe(`
........
...**...
...**...
........
		`.trim())
	})
})
