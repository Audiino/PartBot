import {     
	CardCountsLarge,
	CardCountsMedium,
	CardCountsSmall,
	CardDescription,
	CardType,
	ComboDescription,
	ComboType,
	ValidSingleCard,
} from '@/ps/games/explodingvoltorb/constants';
import { render, renderMove } from '@/ps/games/explodingvoltorb/render';
import { AllowedActions, GamePhase } from '@/ps/games/explodingvoltorb/types';
import { type BaseContext, BaseGame } from '@/ps/games/game';

import type { TranslatedText } from '@/i18n/types';
import type { Log } from '@/ps/games/explodingvoltorb/logs';
import type { CardPlayResult, CardSelectionResult, RenderCtx, State } from '@/ps/games/explodingvoltorb/types';
import type { ActionResponse, EndType } from '@/ps/games/types';
import type { User } from 'ps-client';

export { meta } from '@/ps/games/explodingvoltorb/meta';

export class ExplodingVoltorb extends BaseGame<State> {
	log: Log[] = [];	
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

		const allowed = AllowedActions[this.state.phase];
		if (!allowed.includes(action.charAt(0))) this.throw('GAME.EXPLODING_VOLTORB.INVALID_ACTION_FOR_PHASE');

		switch (action.charAt(0)) {
			// Select: s to make the cards buttons and go select
			case 's': {
				if (!value) this.throw();
				this.selectCard(value);

				const selectedCardAmount = this.getSelectedCardAmount(this.turn!);
				const selectedCardNames = this.getSelectedCardNames(this.turn!);
				const identical = this.areCardsIdentical(selectedCardNames);
				const unique = this.areCardsUnique(selectedCardNames);

				this.getCardSelectionResult( selectedCardAmount, selectedCardNames, identical, unique );
				
				break;
			}
			// Play: play card(s)
			case 'p': {
				if (!value) this.throw();
				this.parsePlayText(value, this.turn!);
				// TODO: actually play the card now, don't forget to add const result =
				// can probably start with shuffle or something easy

				// these were funny lol (i need a better way to tell myself what's happening)
				// but that is for later, aka ill do that when im forced to
				// if (!result.isValid) this.throw('INVALID_ALIAS');
				// else this.throw('GRAMMAR.OR');
				
			}
			// Nope: play a nope card
			case 'n': {
				break;
			}			
			// Draw: draw top card
			case 'd': {
				this.deselectAllCards();
				this.drawTopCard();				
				break;
			}
			// Replace: r to replace card
			case 'r': {
				if (!value) this.throw();
				this.replaceVoltorb(value);
				break;
			}
			default:
				this.throw();
		}
	}

	selectCard(value: string): void {
		const valueStr = value.replace(/\s/g, '');
		if (!/^\d+$/.test(valueStr)) this.throw();

		const index = parseInt(valueStr, 10);
		
		const turn = this.turn!;
		const hand = this.state.hand[turn];
		if (index < 0 || index >= hand.length) this.throw();

		if (this.state.selectedCards.length !== hand.length) {
			this.state.selectedCards = Array(hand.length).fill(false);
		}

		this.state.selectedCards[index] = !this.state.selectedCards[index];
		this.update();
	}

	deselectAllCards(): void {
		const turn = this.turn!;
		const hand = this.state.hand[turn];		
		this.state.selectedCards = Array(hand.length).fill(false);		
	}

	getSelectedCardNames(side: string): CardType[] {
		const hand = this.state.hand[side];
		const selected = this.state.selectedCards;
		if (!hand || !selected || hand.length !== selected.length) return [];

		return hand.filter((_, i) => selected[i]);
	}

	getSelectedCardAmount(side: string): number {
		const hand = this.state.hand[side];
		const selected = this.state.selectedCards;
		if (!hand || !selected || hand.length !== selected.length) return 0;

		return selected.filter(isSelected => isSelected).length;
	}

	areCardsIdentical(selectedCardNames: CardType[]): boolean {
		// TODO: i forgot about the feral cat case lol

		if (selectedCardNames.length === 0) return false;
		return selectedCardNames.every(card => card === selectedCardNames[0]);		
	}

	areCardsUnique(selectedCardNames: CardType[]): boolean {
		const uniqueCardNames = new Set(selectedCardNames);

		if (selectedCardNames.length === uniqueCardNames.size) return true;
		else return false;
	}

	getCardSelectionResult(
		selectedCardAmount: number,
		selectedCardNames: CardType[],
		identical: boolean,
		unique: boolean
	): CardSelectionResult {
		switch (selectedCardAmount) {
			case 1: {
				const card = selectedCardNames[0];

				if (!ValidSingleCard.has(card)) {
					return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: false };
				}
				else return { text: CardDescription[card], isValid: true };
			}
			case 2: {
				if (identical) {
					return { text: ComboDescription[ComboType.TWO_OF_A_KIND], isValid: true };
				}
				else {
					return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: false };
				}
			}
			case 3: {
				if (identical) {
					return { text: ComboDescription[ComboType.THREE_OF_A_KIND], isValid: true };
				}
				else {
					return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: false };
				}
			}
			case 4: {
				return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: true };
			}
			case 5: {
				if (unique) {
					return { text: ComboDescription[ComboType.FIVE_UNIQUE], isValid: true };
				}
				else {
					return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: false };
				}
			}
			default:				
				return { text: ComboDescription[ComboType.INVALID_CARD_SELECTION], isValid: false };
		}		
	}

	getActionText(selectedCards: boolean[]): string {
		const actionText = selectedCards.map((selected, index) => (selected ? index : null))
										.filter((index): index is number => index !== null)
										.join(", ");
  		return actionText;
	}

	parsePlayText(value: string, side: string): CardPlayResult {
		const valueStr = value.replace(/\s/g, '');
		if (!/^(\d+)(,\d+)*$/.test(valueStr)) {
			return { isValid: false};
		}		
		
		const indices = valueStr.split(',').map(num => parseInt(num, 10));
		const hand = this.state.hand[side];

		for (const i of indices) {
			if (i < 0 || i >= hand.length) {
				return { isValid: false };
			}
		}

		const cardsPlayed = indices.map(i => hand[i]);

		const identical = this.areCardsIdentical(cardsPlayed);
		const unique = this.areCardsUnique(cardsPlayed);
		const validCardsPlayed = this.getCardSelectionResult(indices.length, cardsPlayed, identical, unique);

		if (validCardsPlayed.isValid) {
			return {
			isValid: true,
			amount: indices.length,
			cardsPlayed,
			};
		}
		else {
			return { isValid: false };
		}
	}
		

	drawTopCard(): void {        		
		const turn = this.turn!;
		const player = this.players[turn];
		if (!player) this.throw();
		
		const topCard = this.state.board.drawPile.shift();

		if (!topCard) { // we shouldnt get here yet since this is drawing from an empty drawPile
			this.throw();
		}
	
		const drewVoltorb = topCard === 'EXPLODING_VOLTORB';

		const oldHand = this.state.hand[turn];
		this.state.hand[turn].push(topCard);	
		
		const hand = this.state.hand[turn];
		const hasDefuse = hand.includes(CardType.DEFUSE);
		
		let getsEliminated = false;

		if (drewVoltorb) {
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
				getsEliminated = true;				
			}
		}
		
		const logEntry: Log = {
			action: 'draw',
			time: new Date(),
			turn,
			ctx: { hand: oldHand, drawnCard: topCard, getsEliminated },
		};
		this.log.push(logEntry);
		this.room.sendHTML(...renderMove(logEntry, this));

		if (getsEliminated) {
			this.discardPlayerHand(turn);
			this.removePlayer(turn);			
			this.state.phase = GamePhase.WaitingForAction;
			this.update();
		}
		if (this.gameOver()) return this.end();		     
		
		if (!drewVoltorb) this.endTurn();
	}

	replaceVoltorb(value: string): void {
		const turn = this.turn!;
		const player = this.players[turn];
		if (!player) this.throw();

		const hand = this.state.hand[turn];
		if (!hand) this.throw();

		const defuseIndex = hand.indexOf(CardType.DEFUSE);
		if (defuseIndex === -1) this.throw();
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
		
		const [defuseCard] = hand.splice(defuseIndex, 1);
		
		this.state.board.discardPileLastPlayed = [];
		this.state.board.discardPileLastPlayed.push(defuseCard);
		this.state.board.discardPile.push(defuseCard);

		this.state.phase = GamePhase.WaitingForAction;

		const logEntry: Log = {
			action: 'replace',
			time: new Date(),
			turn,
			ctx: { replacePosition: position },
		};		
		this.log.push(logEntry);
		this.room.sendHTML(...renderMove(logEntry, this));
		
		this.endTurn();
	}
	
	discardPlayerHand(side: string): void {
		const hand = this.state.hand[side];
		if (!hand) this.throw();
		
		this.state.board.discardPileLastPlayed = [];
		this.state.board.discardPileLastPlayed.push(...hand);
		this.state.board.discardPile.push(...hand);
		this.state.hand[side] = [];
	}

	gameOver(): boolean {
		const players = Object.values(this.players).filter(player => !player.out);
		return players.length <= 1;
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
		this.state.selectedCards = Array(8).fill(false);
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
		
		const selectedCardNames = this.getSelectedCardNames(this.turn!);
		const selectedCardAmount = this.getSelectedCardAmount(this.turn!);
		const identical = this.areCardsIdentical(selectedCardNames);
		const unique = this.areCardsUnique(selectedCardNames);

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
			selection: {
				clickable: isActive && (this.state.phase !== 'Voltorb reaction'),
				index: this.state.selectedCards,
				cards: selectedCardNames,
				cardAmount: selectedCardAmount,
				hasAny: this.state.selectedCards.some(isSelected => isSelected),
				result: this.getCardSelectionResult( selectedCardAmount, selectedCardNames, identical, unique ),
				actionText: this.getActionText(this.state.selectedCards),
			},
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
