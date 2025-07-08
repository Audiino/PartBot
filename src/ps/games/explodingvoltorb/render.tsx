import { Button, Form, Username } from '@/utils/components/ps';
import { pluralize } from '@/utils/pluralize';
import { CardType } from '@/ps/games/explodingvoltorb/constants';

import type { RenderCtx } from '@/ps/games/explodingvoltorb/types';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

type This = { msg: string };

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
                            <div key={i}>{card}</div>
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