import { createGame, TennisGame } from './tennis-game'
import { repeat } from '../../src'

describe('Tennis game', () => {
	let game: TennisGame

	beforeEach(() => {
		game = createGame('Foo', 'Bar')
	})

	describe('when in new game state', () => {
		it('has right score', () => {
			const score = game.getScore()

			expect(score).toBe('Love all')
		})
	})

	describe('when player one wins first ball', () => {
		it('has right score', () => {
			game.playerOneScores()

			const score = game.getScore()
			expect(score).toBe('Fifteen,Love')
		})
	})

	describe('when both fifteen', () => {
		it('has right score', () => {
			game.playerOneScores()
			game.playerTwoScores()

			const score = game.getScore()
			expect(score).toBe('Fifteen all')
		})
	})

	describe('when player one wins first three balls', () => {
		it('has right score', () => {
			setScore(game, 3, 0)

			const score = game.getScore()
			expect(score).toBe('Forty,Love')
		})
	})

	describe('when players are deuce', () => {
		it('has right score', () => {
			setScore(game, 3, 3)

			const score = game.getScore()
			expect(score).toBe('Deuce')
		})
	})

	describe('when player one wins the game', () => {
		it('has right score', () => {
			setScore(game, 4, 0)

			const score = game.getScore()
			expect(score).toBe('Foo wins')
		})
	})

	describe('when player two wins the game', () => {
		it('has right score', () => {
			setScore(game, 1, 4)

			const score = game.getScore()
			expect(score).toBe('Bar wins')
		})
	})

	describe('when players are deuce 4', () => {
		it('has right score', () => {
			setScore(game, 4, 4)

			const score = game.getScore()
			expect(score).toBe('Deuce')
		})
	})

	describe('when player two has advantage', () => {
		it('has right score', () => {
			setScore(game, 4, 5)

			const score = game.getScore()
			expect(score).toBe('Advantage Bar')
		})
	})

	describe('when player one has advantage', () => {
		it('has right score', () => {
			setScore(game, 5, 4)

			const score = game.getScore()
			expect(score).toBe('Advantage Foo')
		})
	})

	describe('when player two wins after advantage', () => {
		it('has right score', () => {
			setScore(game, 6, 8)

			const score = game.getScore()
			expect(score).toBe('Bar wins')
		})
	})

	describe('when player one wins after advantage', () => {
		it('has right score', () => {
			setScore(game, 8, 6)

			const score = game.getScore()
			expect(score).toBe('Foo wins')
		})
	})

	const setScore = (game: TennisGame, p1Score: number, p2Score: number) => {
		repeat(p1Score, game.playerOneScores)
		repeat(p2Score, game.playerTwoScores)
	}
})
