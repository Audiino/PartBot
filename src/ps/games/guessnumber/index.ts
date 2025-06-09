import { type ReactElement } from 'react';

import { Game } from '@/ps/games/game';
import { render, renderCloseSignups } from '@/ps/games/guessnumber/render';
import { sample } from '@/utils/random';

import type { ToTranslate, TranslatedText } from '@/i18n/types';
import type { EndType } from '@/ps/games/common';
import type { BaseContext } from '@/ps/games/game';
import type { State } from '@/ps/games/guessnumber/types';
import type { User } from 'ps-client';

export { meta } from '@/ps/games/guessnumber/meta';

export class GuessNumber extends Game<State> {
    ended = false;
    setBy: User | null = null;

    constructor(ctx: BaseContext) {
		super(ctx);

		this.state.cap = parseInt(ctx.args.join(''));
		if (this.state.cap > 12 || this.state.cap < 4) this.throw();
		if (isNaN(this.state.cap)) this.state.cap = 10;
		super.persist(ctx);

		if (ctx.backup) return;
		this.state.board = [];
		this.state.solution = [sample(100, this.prng) + 1];        

		super.after(ctx);
	}

    renderCloseSignups(): ReactElement {
		return renderCloseSignups.bind(this)();
	}

	parseGuess(guess: string): boolean {
		const guessStr = guess.replace(/\s/g, '');
		if (!/^[0-9]{1,3}$/.test(guessStr)) this.throw();
		return true;
	}

	action(user: User, ctx: string): void {
		if (!this.started) this.throw('GAME.NOT_STARTED');
		if (!(user.id in this.players)) this.throw('GAME.IMPOSTOR_ALERT');

		this.parseGuess(ctx);

		const guess = parseInt(ctx);
		if (isNaN(guess) || guess < 1 || guess > 100) this.throw();

		if (this.state.board.length === 0) this.closeSignups();

		const offset = guess - this.state.solution[0];

		let result: string;
		if (offset < 0) {
			result = `${guess} too low`;
		} 
		else if (offset > 0) {
			result = `${guess} too high`;
		} 
		else {
			result = `${guess} correct`;
			this.state.board.push({ guess, offset, result });
			return this.end();
		}

		this.state.board.push({ guess, offset, result });
		
		if (this.state.board.length >= this.state.cap) {
			return this.end('loss');
		}

		this.nextPlayer();		
	}	

	external(user: User, ctx: string): void {
		if (this.state.board.length > 0) this.throw('GAME.ALREADY_STARTED');
		if (this.setBy) this.throw('TOO_LATE');
		if (user.id in this.players) this.throw('GAME.IMPOSTOR_ALERT');

		this.parseGuess(ctx);

		this.state.solution = [parseInt(ctx)];
		this.setBy = user;
		this.closeSignups();
	}

	onEnd(type: EndType): TranslatedText {
		this.ended = true;
		const player = Object.values(this.players)[0].name;		
		if (type === 'dq' || type === 'force') return this.$T('GAME.MASTERMIND.ENDED', { player });
		if (type === 'loss') 
			return this.$T('GAME.MASTERMIND.FAILED', { player, solution: this.state.solution.join(''), cap: this.state.cap });				
		const guesses = this.state.board.length;
		return `${player} guessed ${this.state.solution.join('')} in ${guesses} turn${guesses === 1 ? '' : 's'}!` as ToTranslate;	
	}

	render(asPlayer: string | null): ReactElement {
		return render.bind(this.renderCtx)(this.state, asPlayer ? (this.ended ? 'over' : 'playing') : 'spectator');
	}

}