import { maybe } from '../../src/maybe/maybe'
import { left, right } from '../../src/either/either'
import { Either } from '../../src'

const SCORES = ['love', 'fifteen', 'thirty', 'forty']

const MAX_SCORE_INDEX = SCORES.length - 1

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const getAllScoreText = (player: Player) => maybe(SCORES[player.scoreIndex]).flatMap(capitalize).fold()

type Player = {
	name: string
	scoreIndex: number
}

const createPlayer = (name: string): Player => ({
	name,
	scoreIndex: 0,
})

const createScoreMessage: (data: string) => Either<string, string> = left

type GameState = { players: [Player, Player] }

export type Game = { playerTwoScores: () => void; getScore: () => string; playerOneScores: () => void }

export const createGame = (firstPlayerName: string, secondPlayerName: string): Game => {
	const state: GameState = {
		players: [createPlayer(firstPlayerName), createPlayer(secondPlayerName)],
	}

	const [playerOne, playerTwo] = state.players

	const rank = () => playerOne.scoreIndex - playerTwo.scoreIndex

	const canWin = (player: Player) => player.scoreIndex > MAX_SCORE_INDEX

	const allCanWin = () => state.players.every(canWin)

	const isDraw = () => rank() === 0

	const isAll = () => isDraw() && state.players.every((it) => it.scoreIndex < MAX_SCORE_INDEX)

	const isDeuce = () => isDraw() && state.players.every((it) => it.scoreIndex >= MAX_SCORE_INDEX)

	const isPlayerOneWinning = () => {
		const requiredRank = allCanWin() ? 2 : 1
		return canWin(playerOne) && rank() >= requiredRank
	}

	const isPlayerTwoWinning = () => {
		const requiredRank = allCanWin() ? -2 : -1
		return canWin(playerTwo) && rank() <= requiredRank
	}

	const hasPlayerOneAdvantage = () => allCanWin() && rank() === 1
	const hasPlayerTwoAdvantage = () => allCanWin() && rank() === -1

	const score = (player: Player) => {
		player.scoreIndex++
	}

	return {
		getScore: (): string =>
			right<string, string>(`${getAllScoreText(playerOne)},${getAllScoreText(playerTwo)}`)
				.flatMap((it) => (isDeuce() ? createScoreMessage('Deuce') : it))
				.flatMap((it) => (hasPlayerOneAdvantage() ? createScoreMessage(`Advantage ${playerOne.name}`) : it))
				.flatMap((it) => (hasPlayerTwoAdvantage() ? createScoreMessage(`Advantage ${playerTwo.name}`) : it))
				.flatMap((it) => (isPlayerOneWinning() ? createScoreMessage(`${playerOne.name} wins`) : it))
				.flatMap((it) => (isPlayerTwoWinning() ? createScoreMessage(`${playerTwo.name} wins`) : it))
				.flatMap((it) => (isAll() ? createScoreMessage(`${getAllScoreText(playerOne)} all`) : it))
				.fold(),
		playerOneScores: () => score(playerOne),
		playerTwoScores: () => score(playerTwo),
	}
}
