import { render } from '@/ps/games/tictactoe/render';
import { BaseContext, BaseGame, createGrid } from '@/ps/games/game';
import { repeat } from '@/utils/repeat';

import type { TranslatedText } from '@/i18n/types';
import type { Board, Turn, State, RenderCtx, WinCtx } from '@/ps/games/tictactoe/types';
import type { User } from 'ps-client';
import type { EndType } from '@/ps/games/types';

export { meta } from '@/ps/games/tictactoe/meta';

export class TicTacToe extends BaseGame<State> {
    text: string[] = [];
    winCtx?: WinCtx | { type: EndType };

    constructor(ctx: BaseContext) {
        super(ctx);
        super.persist(ctx);

        this.state.board = createGrid<Turn | null>(3, 3, () => null);
    }
    
    action(user: User, ctx: string) {        
        if (!this.started) this.throw('GAME.NOT_STARTED');
		if (user.id !== this.players[this.turn!].id) this.throw('GAME.IMPOSTOR_ALERT');
		const [i, j] = ctx.split('-').map(num => parseInt(num));
		if (isNaN(i) || isNaN(j)) this.throw();
		const res = this.play([i, j], this.turn!);
		if (!res) this.throw();        
    }

    play([i, j]: [number, number], turn: Turn): Board | null | boolean {        
        const board = this.state.board;
		
		if (board[i][j]) return null;
        board[i][j] = turn;

        if (this.won([i, j], turn)) {
			const other = this.getNext(turn);
			this.winCtx = { type: 'win', winner: this.players[turn], loser: this.players[other] };
			this.end();
			return true;
		}
        if (board.flat().every(cell => !!cell)) {
			// board full
			this.winCtx = { type: 'draw' };
			this.end();
			return true;
		}
		this.nextPlayer();
		return board;        
    }

    won([i, j]: [number, number], turn: Turn): boolean {
		const board = this.state.board;
		const directions = [
			[0, 1], // horizontal
			[1, 0], // vertical
			[1, 1], // NE
			[-1, 1], // SE
		];
		const X = i;
		const Y = j;
		const offsets = repeat(null, 2 * 4 - 1).map((_, k) => k - 4 + 1);
		for (const dir of directions) {
			let streak = 0;
			for (const offset of offsets) {
				const x = X + offset * dir[0];
				const y = Y + offset * dir[1];
				if (board[x]?.[y] === turn) streak++;
				else streak = 0;
				if (streak >= 3) return true;
			}
		}
		return false;
	}

    render(side: Turn | null) {
        const ctx: RenderCtx = {
            board: this.state.board,
            id: this.id,
        }
        if (this.winCtx) {
			ctx.header = 'Game ended.';
		} else if (side === this.turn) {
			ctx.header = 'Your turn!';
		} else if (side) {
			ctx.header = 'Waiting for opponent...';
			ctx.dimHeader = true;
		} else if (this.turn) {
			const current = this.players[this.turn];
			ctx.header = `Waiting for ${current.name}${this.sides ? ` (${this.turn})` : ''}...`;
		}
		return render.bind(this.renderCtx)(ctx);
    }
    onEnd(type?: EndType): TranslatedText {
		if (type) {
			this.winCtx = { type };
			if (type === 'dq') return this.$T('GAME.ENDED_AUTOMATICALLY', { game: this.meta.name, id: this.id });
			return this.$T('GAME.ENDED', { game: this.meta.name, id: this.id });
		}
		if (this.winCtx?.type === 'draw') {
			return this.$T('GAME.DRAW', { players: [this.players.W.name, this.players.B.name].list(this.$T) });
		}
		if (this.winCtx && this.winCtx.type === 'win')
			return this.$T('GAME.WON_AGAINST', {
				winner: `${this.winCtx.winner.name} (${this.winCtx.winner.turn})`,
				game: this.meta.name,
				loser: `${this.winCtx.loser.name} (${this.winCtx.loser.turn})`,
				ctx: '',
			});
		throw new Error(`winCtx not defined for TTT - ${JSON.stringify(this.winCtx)}`);
	}
}
