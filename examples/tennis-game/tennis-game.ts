import { just, maybe, nothing } from '../../src/maybe/maybe'
import { Maybe } from '../../src'

type Player = {
	name: string
	scoreIndex: number
}

const SCORES = ['love', 'fifteen', 'thirty', 'forty']

const MAX_SCORE_INDEX = SCORES.length - 1

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const getAllScoreText = (player: Player) =>
	maybe(SCORES[player.scoreIndex])
		.flatMap(capitalize)
		.getOrElse(() => '')

const createPlayer = (name: string): Player => ({
	name,
	scoreIndex: 0,
})

type EitherBool = Maybe<true>
const fromBoolean = (expression: boolean): EitherBool => maybe(expression || undefined)

type GameState = { players: [Player, Player] }

export type TennisGame = { playerTwoScores: () => void; getScore: () => string; playerOneScores: () => void }

type MaybeScore = Maybe<string>

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

	const handleDraw = (): MaybeScore =>
		isDeuce()
			.flatMap(() => 'Deuce')
			.mapLeft(() => isAll().flatMap(() => `${getAllScoreText(playerOne)} all`))

	const handleAdvantage = (): MaybeScore => {
		const rank = getRank()
		const spread = Math.abs(rank)
		const topPlayer = rank > 0 ? playerOne : playerTwo
		return allCanWin()
			.flatMap(() => (spread === 1 ? `Advantage ${topPlayer.name}` : nothing()))
			.mapLeft(() => (canWin(topPlayer) && spread >= 2 ? just(`${topPlayer.name} wins`) : nothing()))
	}

	return {
		getScore: (): string =>
			isDraw()
				.flatMap(handleDraw)
				.mapLeft(handleAdvantage)
				.getOrElse(() => `${getAllScoreText(playerOne)},${getAllScoreText(playerTwo)}`),
		playerOneScores: () => score(playerOne),
		playerTwoScores: () => score(playerTwo),
	}
}
