import type { CardType } from '@/ps/games/explodingvoltorb/constants'

export type State = {
	turn: string;
	hand: Record<string, CardType[]>;
	baseCards: CardType[];
	board: { drawPile: CardType[]; discardPile: CardType[]; discardPileLastPlayed: CardType[] };        
	phase: GamePhase;
	phaseData: PhaseData;
};

export type RenderCtx = {
	id: string;		
	header?: string;
	dimHeader?: boolean;
	players: Record<string, { name: string; hand: number; out?: boolean | undefined }>;
	board: { drawPileAmount: number; discardPileAmount: number; discardPileLastPlayedAmount: Record<CardType, number>};
	hand: CardType[] | undefined;
	selectedCards: number[];
	isActive: boolean;
	side: string | null;
	turn: string;	
	phase: GamePhase;
	phaseData: PhaseData;
};

export type WinCtx = { type: 'win'; winnerIDs: string[] } | { type: 'draw' };

export enum GamePhase {
	WaitingForAction = 'Waiting for action',
	NopingWindow = 'Noping window',
	ResolvingAction = 'Resolving action',
	DrawingCard = 'Drawing card',
	VoltorbReaction = 'Voltorb reaction',
	EndOfTurn = 'End of turn',    
}

export type PhaseDataMap = {
	[GamePhase.WaitingForAction]: {
		phase: GamePhase.WaitingForAction;
		turnsLeft: number;
	};
	[GamePhase.NopingWindow]: {
		phase: GamePhase.NopingWindow;
		playedCards: CardType[];
		nopes: string[]; // usernames of ppl who noped
	};
	[GamePhase.ResolvingAction]: {
		phase: GamePhase.ResolvingAction;
		actionSuccessful: boolean;
		playedCards: CardType[];
	};
	[GamePhase.DrawingCard]: {
		phase: GamePhase.DrawingCard;
	};
	[GamePhase.VoltorbReaction]: {
		phase: GamePhase.VoltorbReaction;
		hasDefuse: boolean;
		voltorbDrawn: boolean;
	};
	[GamePhase.EndOfTurn]: {
		phase: GamePhase.EndOfTurn;
		turnsLeft: number;
	};
}

type Phase = keyof PhaseDataMap;
type PhaseData = PhaseDataMap[Phase];
