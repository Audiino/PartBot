import { 
    CardType, 
    CardCountsSmall, 
    CardCountsMedium, 
    CardCountsLarge
} from '@/ps/games/explodingvoltorb/constants';
import { GamePhase, PhaseDataMap } from '@/ps/games/explodingvoltorb/types';
import { render } from '@/ps/games/explodingvoltorb/render';
import { type BaseContext, BaseGame } from '@/ps/games/game';

import type { TranslatedText } from '@/i18n/types';
import type { User } from 'ps-client';
import type { State, RenderCtx, WinCtx } from '@/ps/games/explodingvoltorb/types';
import type { ActionResponse, EndType } from '@/ps/games/types';

export { meta } from '@/ps/games/explodingvoltorb/meta';

export class ExplodingVoltorb extends BaseGame<State> {
    selectedCards: number[] = [];
    turnCount: number | null = null;
    winCtx?: WinCtx | { type: EndType };
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
				const drewVoltorb = this.drawTopCard();

                if (drewVoltorb) {
                    const hand = this.state.hand[turn];
                    const hasDefuse = hand.includes(CardType.DEFUSE);                    
            
                    this.state.phase = GamePhase.VoltorbReaction;
                    this.state.phaseData = {
                        phase: GamePhase.VoltorbReaction,
                        hasDefuse,
                        voltorbDrawn: true,
                    };
            
                    this.room.privateSend(turn, this.$T('GAME.EXPLODING_VOLTORB.DREW_VOLTORB'));                    

                    if (hasDefuse) {
                        this.update();
                    }
                    else {
                        this.discardPlayerHand(turn);
                        // if you dont have defuse, eliminate the player and yeet their cards to the discardPile
                        // this.removePlayer but we need it to be out, not ff or dq                        
                    }                    
                    
                    
                    return;
                }

                this.nextPlayer();
                this.update();  
				break;
			}
            // Replace: r to replace card
            case 'r': {
                if (!value) this.throw();
                this.replaceVoltorb(value);
                this.nextPlayer();
                this.update();  
				break;
            }
			default:
				this.throw();
		}                      
    }


    drawTopCard(): boolean {        
        const topCard = this.state.board.drawPile.shift();
        const turn = this.turn!;

        if (!topCard) { // we shouldnt get here yet since this is drawing from an empty drawPile
            this.throw();
        }
    
        const isVoltorb = topCard === 'Exploding Voltorb';            

        this.state.hand[turn].push(topCard);
    
        return isVoltorb;
    }

    replaceVoltorb(value: string): void {
        const turn = this.turn!;
		const player = this.players[turn];
		if (!player) this.throw();
        const hand = this.state.hand[turn];
	    if (!hand) this.throw();

        const voltorbIndex = hand.indexOf(CardType.EXPLODING_VOLTORB);
	    if (voltorbIndex === -1) this.throw('GAME.EXPLODING_VOLTORB.NO_VOLTORB_IN_HAND');


        const position = parseInt(value.trim(), 10);

        if (
            isNaN(position) ||
		    !/^\d+$/.test(value.trim()) ||
		    position < 1 ||
		    position > this.state.board.drawPile.length + 1
        ) {
            this.throw('GAME.EXPLODING_VOLTORB.INVALID_VOLTORB_REPLACEMENT');
	    }	        
        
	    const [voltorbCard] = hand.splice(voltorbIndex, 1);
        this.state.board.drawPile.splice(position - 1, 0, voltorbCard);	

        const defuseIndex = hand.indexOf(CardType.DEFUSE);
	    if (defuseIndex === -1) this.throw();
	    const [defuseCard] = hand.splice(defuseIndex, 1);
        this.state.board.discardPile.push(defuseCard);
        this.state.board.discardPileLastPlayed.push(defuseCard);
        
	    this.state.phase = GamePhase.WaitingForAction;
	    this.state.phaseData = {};
    }
    
    discardPlayerHand(side: string): void {
        const hand = this.state.hand[side];
        if (!hand) this.throw;
        
        this.state.board.discardPile.push(...hand);
        this.state.hand[side] = [];
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
        const hand = side ? this.state.hand[side] : undefined;

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
            board: {
                drawPileAmount: this.state.board.drawPile.length,
                discardPileAmount: this.state.board.discardPile.length,
                discardPileLastPlayedAmount: this.state.board.discardPileLastPlayed.reduce((cardCount, card) => {
                    cardCount[card] = (cardCount[card] || 0) + 1;
                    return cardCount;
                }, {} as Record<CardType, number>),
            },                     
            hand,
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
        
    onEnd(type?: EndType): TranslatedText {
        if (type) {
			this.winCtx = { type };
			if (type === 'dq') return this.$T('GAME.ENDED_AUTOMATICALLY', { game: this.meta.name, id: this.id });			
			return this.$T('GAME.ENDED', { game: this.meta.name, id: this.id });
		}
		
        return "Done" as TranslatedText;
    }
}
