import type { Player } from '@/ps/games/types';

export type Turn = 'W' | 'B';

export type Board = (null | Turn)[][];

export type State = {
	turn: Turn;
	board: Board;
};

export type RenderCtx = {
	id: string;
	board: Board;
	header?: string;
	dimHeader?: boolean;
};

export type WinCtx = ({ type: 'win' } & Record<'winner' | 'loser', Player>) | { type: 'draw' };
