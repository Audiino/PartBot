import { Button, Form } from '@/utils/components/ps';
import { repeat } from '@/utils/repeat';

import type { GuessNumber } from '@/ps/games/guessnumber/index';
import type { State } from '@/ps/games/guessnumber/types';
import type { ReactElement } from 'react';


export function renderCloseSignups(this: GuessNumber): ReactElement {
    const hasGuessed = this.state.board.length > 0;
    const player = Object.values(this.players)[0].name;	
    return (
		<>
			<hr />
			{player} is playing a round of {this.meta.name}!
			<Button value={`${this.renderCtx.simpleMsg} watch`} style={{ marginLeft: 16 }}>
				Watch
			</Button>
			{this.setBy || !hasGuessed ? (
				<>
					<br />
					<br />
				</>
			) : null}
			{this.setBy ? (
				`${this.setBy.name} has set a number for ${player}.`
			) : !hasGuessed ? (
				<Form value={`${this.renderCtx.simpleMsg} audience {num}`}>
					<label htmlFor="choosenumber">Set Number: </label>
					<input type="text" id="choosenumber" name="num" style={{ width: 30 }} /> &nbsp;&nbsp;
					<input type="submit" value="Set" />
				</Form>
			) : null}
			<hr />
		</>
	);
}

type This = { msg: string; simpleMsg: string };
export function render(this: This, data: State, mode: 'playing' | 'over' | 'spectator'): ReactElement {
    return (
        <div style={{ margin: '1em' }}>
			<h3>Guess the number between 1 and 100</h3>
			<ol>
				{data.board.map(({ guess, result }, i) => (
					<li key={i}>{result}</li>
				))}
			</ol>            
			{mode !== 'spectator' ? (
				<div style={{display: 'inline-block', verticalAlign: 'bottom' }}>
					{mode === 'over' ? (
						<Button value={`${this.simpleMsg} create ${data.cap}`}>Play Again</Button>
					) : (
						<Form value={`${this.simpleMsg} play {guess}`}>
							<input type="text" name="guess" placeholder="Your guess!" />
							<br />
							<br />
							<center>
								<input type="submit" value="Submit" />
							</center>
						</Form>
					)}
				</div>
			) : null}

		</div>

    );
}
