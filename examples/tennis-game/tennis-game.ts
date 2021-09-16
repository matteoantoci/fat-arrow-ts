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

const fromBoolean = (expression: boolean): Either<false, true> => (expression ? right(true) : left(false))

type GameState = { players: [Player, Player] }

export type TennisGame = { playerTwoScores: () => void; getScore: () => string; playerOneScores: () => void }

export const createGame = (firstPlayerName: string, secondPlayerName: string): TennisGame => {
	const state: GameState = {
		players: [createPlayer(firstPlayerName), createPlayer(secondPlayerName)],
	}

	const [playerOne, playerTwo] = state.players

	const getRank = () => playerOne.scoreIndex - playerTwo.scoreIndex

	const canWin = (player: Player) => player.scoreIndex > MAX_SCORE_INDEX

	const allCanWin = () => fromBoolean(state.players.every(canWin))

	const isDraw = () => fromBoolean(getRank() === 0)

	const isAll = () => fromBoolean(state.players.every((it) => it.scoreIndex < MAX_SCORE_INDEX))

	const isDeuce = () => fromBoolean(state.players.every((it) => it.scoreIndex >= MAX_SCORE_INDEX))

	const score = (player: Player) => {
		player.scoreIndex++
	}

	const handleDraw = (): Either<false, string> =>
		isDeuce()
			.flatMap(() => 'Deuce')
			.mapLeft(() => isAll().flatMap(() => `${getAllScoreText(playerOne)} all`))

	const handleAdvantage = (): Either<false, string> => {
		const rank = getRank()
		const spread = Math.abs(rank)
		const player = rank > 0 ? playerOne : playerTwo
		return allCanWin()
			.flatMap((): Either<false, string> => (spread === 1 ? right(`Advantage ${player.name}`) : left(false)))
			.mapLeft(() => (canWin(player) && spread >= 2 ? right(`${player.name} wins`) : left(false)))
	}

	return {
		getScore: (): string =>
			isDraw()
				.flatMap(handleDraw)
				.mapLeft(handleAdvantage)
				.fold(() => `${getAllScoreText(playerOne)},${getAllScoreText(playerTwo)}`),
		playerOneScores: () => score(playerOne),
		playerTwoScores: () => score(playerTwo),
	}
}
