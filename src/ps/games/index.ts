import { Chess, meta as ChessMeta } from '@/ps/games/chess';
import { ConnectFour, meta as ConnectFourMeta } from '@/ps/games/connectfour';
import { LightsOut, meta as LightsOutMeta } from '@/ps/games/lightsout';
import { Mastermind, meta as MastermindMeta } from '@/ps/games/mastermind';
import { Othello, meta as OthelloMeta } from '@/ps/games/othello';
import { Scrabble, meta as ScrabbleMeta } from '@/ps/games/scrabble';
import { TicTacToe, meta as TicTacToeMeta } from '@/ps/games/tictactoe';
import { GamesList, type Meta } from '@/ps/games/types';

export const Games = {
	[GamesList.Chess]: {
		meta: ChessMeta,
		instance: Chess,
	},
	[GamesList.ConnectFour]: {
		meta: ConnectFourMeta,
		instance: ConnectFour,
	},
	[GamesList.LightsOut]: {
		meta: LightsOutMeta,
		instance: LightsOut,
	},
	[GamesList.Mastermind]: {
		meta: MastermindMeta,
		instance: Mastermind,
	},
	[GamesList.Othello]: {
		meta: OthelloMeta,
		instance: Othello,
	},
	[GamesList.Scrabble]: {
		meta: ScrabbleMeta,
		instance: Scrabble,
	},
	[GamesList.TicTacToe]: {
		meta: TicTacToeMeta,
		instance: TicTacToe,
	},
} satisfies Readonly<Record<GamesList, Readonly<{ meta: Meta; instance: unknown }>>>;
export type Games = typeof Games;
