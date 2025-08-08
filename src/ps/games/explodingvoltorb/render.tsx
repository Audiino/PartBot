import { Button, Form, Username } from '@/utils/components/ps';
import { Logger } from '@/utils/logger';
import { pluralize } from '@/utils/pluralize';
import { CardType, CardDescription } from '@/ps/games/explodingvoltorb/constants';

import type { ExplodingVoltorb } from '@/ps/games/explodingvoltorb';
import type { Log } from '@/ps/games/explodingvoltorb/logs';
import type { GamePhase, RenderCtx } from '@/ps/games/explodingvoltorb/types';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';

type This = { msg: string };

export function renderMove(logEntry: Log, { id, players, renderCtx: { msg } }: ExplodingVoltorb): [ReactElement, { name: string }] {
	const Wrapper = ({ children }: { children: ReactNode }): ReactElement => (
		<>
			<hr />
			{children}
			<Button name="send" value={`${msg} watch`} style={{ float: 'right' }}>
				Watch!
			</Button>
			<hr />
		</>
	);

	const playerName = players[logEntry.turn]?.name;
	const opts = { name: `${id}-chatlog` };

	switch (logEntry.action) {
		case 'draw':
			const getsEliminated = logEntry.ctx.getsEliminated;
			return [
				<Wrapper>				
					<Username name={playerName} /> drew a
					{getsEliminated ? (' Voltorb and blew up!') : (' card.')}
				</Wrapper>,
				opts,
			];
		case 'replace':
			return [
				<Wrapper>
					<Username name={playerName} /> replaced the Voltorb.
				</Wrapper>,
				opts,
			];	
		case 'nope':
			return [
				// TODO: well first i have to write the card logic, then noping comes next
				<Wrapper>
					nope: you should not be seeing this yet D: 
				</Wrapper>,
				opts,
			];	
		case 'play':			
			return [
				// TODO: playing card logic
				<Wrapper>
					play: you should not be seeing this yet D: 
				</Wrapper>,
				opts,
			];				
		default:
			Logger.log('EV had some weird move', logEntry, players);
			return [
				<Wrapper>
					Well <i>something</i> happened, I think! Someone go poke PartMan
				</Wrapper>,
				opts,
			];
	}
}

function UserPanel({ children }: { children: ReactNode }): ReactElement {
	return (
		<div style={{ width: 320, backgroundColor: '#5552', border: '1px solid', borderRadius: 4, padding: '12px 16px', margin: 8 }}>
			{children}
		</div>
	);
}

function PlayerHandAmount({ players }: { players: RenderCtx['players'] }): ReactElement[] {
	return Object.values(players).map(player => {
		const username = <Username name={player.name} />;
		return (
			<div>
				{player.out ? <s>{username}</s> : username}: {player.hand}				
			</div>
		);
	});
}

function PlayerHand(
	{ isActive, hand, selection, msg }: 
	{ isActive: boolean; hand: CardType[] | undefined; selection: { cards: boolean[] }; msg: string; }):
	ReactElement | null {
		if (!hand) return null;

		return (
			<UserPanel>
				<div>
					{hand?.map((card, i) => (
						<div key={i} style={{ margin: '2px 0' }}>
							<details>
								<summary style={{ cursor: 'pointer' }}>
									{isActive ? (
										<>
										{selection.cards[i] ? (
												<Button value={`${msg} ! s ${i}`}><b>{card}</b></Button>
										) : (
												<Button value={`${msg} ! s ${i}`}>{card}</Button>
										)}
										</>
									) : (
										<>{card}</>
									)}
								</summary>
								<div style={{ border: '1px solid', borderRadius: 4, padding: '4px 8px', marginTop: 4 }}>
									{CardDescription[card]}<br></br>
								</div>
							</details>
						</div>
					))}
				</div>
			</UserPanel>
		)
}

function CardSelection({ isActive, selection }: { isActive: boolean; selection: { cardNames: CardType[]; cardAmount: number; hasAny: boolean; } }): ReactElement | null {
	if (!isActive) return null;
	if (selection.hasAny) return (
		<UserPanel>
			<div>You have selected {pluralize(selection.cardAmount, 'card', 'cards')}: {selection.cardNames.join(", ")}</div>
		</UserPanel>
	)
	else return (
		null
	)	
}

function EndTurnAndDraw({ isActive, phase, msg }: { isActive: boolean; phase: GamePhase; msg: string }): ReactElement | null {
	if (!isActive) return null;
	if (phase === 'Voltorb reaction') return null;

	return (
		<UserPanel>
			<Button value={`${msg} ! d`} style={{ border: '2px solid darkred', borderRadius: 4 }}>
				End turn and draw
			</Button>
		</UserPanel>
	)
}

function VoltorbReaction(
	{ isActive, phase, hand, msg }: 
	{ isActive: boolean; phase: GamePhase; hand: CardType[] | undefined; msg: string }
	): ReactElement | null {
	if (!isActive) return null;
	if (phase !== 'Voltorb reaction') return null;
	
	return (		
		<UserPanel>  
			<div>You drew a Voltorb!</div>
			{hand?.includes(CardType.DEFUSE) ? (
				<Form value={`${msg} ! r {replaceVoltorb}`} style={{ margin: '4px 0' }}>
					<input name="replaceVoltorb" placeholder="1 for top most position" width="100" style={{ marginRight: 4 }} />
					<button>Replace</button>
				</Form>
			) : (
				<div>Rip you have no Defuse cards, you exploded.</div>
			)}
		</UserPanel>		
	)
}

export function render(this: This, ctx: RenderCtx): ReactElement {
	return (
		<center>
			<UserPanel>
				<div>Draw pile: {pluralize(ctx.board.drawPileAmount, 'card', 'cards')}</div>
				<div>Discard pile: {pluralize(ctx.board.discardPileAmount, 'card', 'cards')}</div>
				<div>
					Last played:{" "}
					{Object.entries(ctx.board.discardPileLastPlayedAmount)
						.map(([card, count]) => `${card}: ${count}`)
						.join(", ")}
				</div>
				<hr />
				<PlayerHandAmount players={ctx.players}/>
			</UserPanel>
			
			{ctx.side ? (
				// TODO: The effect of CardSelection is: (CardDescription)
				// Invalid play
				// confirm (or doesn't exist if invalid)
				<>
				<VoltorbReaction isActive={ctx.isActive} phase={ctx.phase} hand={ctx.hand} msg={this.msg}/>
				<CardSelection isActive={ctx.isActive} selection={ctx.selection}/>		
				<PlayerHand isActive={ctx.isActive} hand={ctx.hand} selection={ctx.selection} msg={this.msg}/>
				<EndTurnAndDraw isActive={ctx.isActive} phase={ctx.phase} msg={this.msg}/>			
				</>
			) : null}		
		</center>
	);
}