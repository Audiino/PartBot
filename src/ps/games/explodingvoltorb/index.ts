import { 
    CardType, 
    CardCountsSmall, 
    CardCountsMedium, 
    CardCountsLarge
} from '@/ps/games/explodingvoltorb/constants';
import { GamePhase, PhaseData } from '@/ps/games/explodingvoltorb/types';
import { render } from '@/ps/games/explodingvoltorb/render';
import { type BaseContext, BaseGame } from '@/ps/games/game';

import type { TranslatedText } from '@/i18n/types';
import type { User } from 'ps-client';
import type { RenderCtx, State } from '@/ps/games/explodingvoltorb/types';
import type { ActionResponse, EndType } from '@/ps/games/types';

export { meta } from '@/ps/games/explodingvoltorb/meta';

export class ExplodingVoltorb extends BaseGame<State> {
    selectedCards: number[] = [];
    turnCount: number | null = null;
    text: string[] = [];
    
    constructor(ctx: BaseContext) {
        super(ctx);
        super.persist(ctx);
    }
    
    action(user: User, ctx: string) {
        if (!this.started) this.throw('GAME.NOT_STARTED');
		if (user.id !== this.players[this.turn!].id) this.throw('GAME.IMPOSTOR_ALERT');
        const [action, value] = ctx.lazySplit(' ', 1) as [string | undefined, string | undefined];
		if (!action) this.throw();

        switch (action.charAt(0)) {
			// Select: s to make the cards buttons and go select
			case 's': {
				
				break;
			}			
			// Draw: d
			case 'd': {
                const turn = this.turn!;
				const drewVoltorb = this.draw();
                if (drewVoltorb) this.room.privateSend(turn, this.$T('GAME.EXPLODING_VOLTORB.DREW_VOLTORB'));

				break;
			}
			default:
				this.throw();
		}
        
        this.nextPlayer();
        this.update();        
    }


    draw(): boolean {        
        const topCard = this.state.board.drawPile.shift();
        const turn = this.turn!;

        if (!topCard) { // we shouldnt get here yet since this is drawing from an empty drawPile
            this.throw();
        }
    
        const isVoltorb = topCard === 'Exploding Voltorb';
    
        this.state.hand[turn].push(topCard);
    
        return isVoltorb;
    }
    
    onStart(): ActionResponse {		
        const numPlayers = Object.keys(this.players).length;        

        if (numPlayers >= 2 && numPlayers <= 3) {            
            this.state.baseCards = Object.entries(CardCountsSmall)
                .flatMap(([card, count]) => Array(Number(count)).fill(card as CardType));
        }
        else if (numPlayers >= 4 && numPlayers <= 7) {            
            this.state.baseCards = Object.entries(CardCountsMedium)
                .flatMap(([card, count]) => Array(Number(count)).fill(card as CardType));
        }
        else if (numPlayers >= 8) {            
            this.state.baseCards = Object.entries(CardCountsLarge)
                .flatMap(([card, count]) => Array(Number(count)).fill(card as CardType));
        }
        
        this.state.baseCards.shuffle(this.prng);        

        this.state.hand = {};
        Object.keys(this.players).forEach(player => {
            this.state.hand[player] = [CardType.DEFUSE, ...this.state.baseCards.splice(0, 7)];
        });           

        const voltorbs = Array(numPlayers - 1).fill(CardType.EXPLODING_VOLTORB);        
        
        this.state.board = {
            drawPile: [...this.state.baseCards, ...voltorbs].shuffle(this.prng),
            discardPile: [],
            discardPileLastPlayed: [],
        }	

        this.state.phase = GamePhase.WaitingForAction;
        this.state.phaseData = {
            phase: GamePhase.WaitingForAction,
            turnsLeft: 1,
        };
                             
		return { success: true, data: null };
	}

    render(side: string | null) {
		const isActive = !!side && side === this.turn;
		const ctx: RenderCtx = {
			id: this.id,												
            players: Object.fromEntries(
                this.turns.map(turn => {
                    const player = this.players[turn];
                    return [
                        player.id,
                        {
                            name: player.name,
                            hand: this.state.hand[player.id]?.length ?? 0,
                            out: player.out,
                        }
                    ];
                })
            ),
            drawPileAmount: this.state.board.drawPile.length,
            discardPileAmount: this.state.board.discardPile.length,
            discardPileLastPlayed: this.state.board.discardPileLastPlayed,
            hand: side ? this.state.hand[side] : undefined,
            selectedCards: side && side === this.turn ? this.selectedCards : [],
			isActive,
			side,
			turn: this.turn!,	
            phase: this.state.phase,
            phaseData: this.state.phaseData,		
		};

		if (isActive) {
			ctx.header = 'Your turn!';
		} else if (side) {
			ctx.header = `Waiting for ${this.players[this.turn!]?.name}...`;
			ctx.dimHeader = true;
		} else if (this.turn) {
			const current = this.players[this.turn];
			ctx.header = `Waiting for ${current.name}${this.sides ? ` (${this.turn})` : ''}...`;
		}
		return render.bind(this.renderCtx)(ctx);
	}
    
    
    
    
    
    onEnd() {
        return 'Done' as TranslatedText;
    }
}


