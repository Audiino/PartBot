import { Button, Form, Username } from '@/utils/components/ps';
import { Logger } from '@/utils/logger';
import { pluralize } from '@/utils/pluralize';
import { CardType, CardDescription } from '@/ps/games/explodingvoltorb/constants';

import type { ExplodingVoltorb } from '@/ps/games/explodingvoltorb';
import type { Log } from '@/ps/games/explodingvoltorb/logs';
import type { RenderCtx } from '@/ps/games/explodingvoltorb/types';
import type { ReactElement, ReactNode } from 'react';

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

function PlayerHands({ players }: { players: RenderCtx['players'] }): ReactElement[] {
	return Object.values(players).map(player => {
		const username = <Username name={player.name} />;
		return (
			<div>
				{player.out ? <s>{username}</s> : username}: {player.hand}				
			</div>
		);
	});
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
			<PlayerHands players={ctx.players} />
		</UserPanel>        

		{ctx.side ? (
			<>
				<UserPanel>
					<div>						
						{ctx.hand?.map((card, i) => (
							<div key={i} style={{ margin: '2px 0' }}>
								<details>
									<summary style={{ cursor: 'pointer' }}>
										{card}
									</summary>
									
									<div style={{ border: '1px solid', borderRadius: 4, padding: '4px 8px', marginTop: 4 }}>									
										<div>
											{CardDescription[card]}
										</div>
										<Button value={`${this.msg} ! s ${i}`}>
											Select card
										</Button>
									</div>

								</details>
							</div>
						))}
					</div>
				</UserPanel>
				{ctx.isActive ? (
					<>       
					{ctx.phase === 'Voltorb reaction' ? (
						<UserPanel>  
							<div>You drew a Voltorb!</div>
							{ctx.hand?.includes(CardType.DEFUSE) ? (
								<Form value={`${this.msg} ! r {replaceVoltorb}`} style={{ margin: '4px 0' }}>
									<input name="replaceVoltorb" placeholder="1 for top most position" width="100" style={{ marginRight: 4 }} />
									<button>Replace</button>
								</Form>
							) : (
								<div>Rip you have no Defuse cards, you exploded.</div>                                                                
							)}
						</UserPanel>
					) : null }
						<UserPanel>                              
							<Button value={`${this.msg} ! d`} style={{ border: '2px solid darkred', borderRadius: 4 }}>
								End turn and draw
							</Button>                                                      
						</UserPanel>
					</>
				) : null}
			</>
		) : null}        
		
		</center>
	);
}