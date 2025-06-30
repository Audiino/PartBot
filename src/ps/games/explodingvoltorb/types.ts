import { CardType } from '@/ps/games/explodingvoltorb/constants'


export type State = {
	turn: string;
	hand: Record<string, CardType[]>;
    baseCards: CardType[];
    board: { drawPile: CardType[]; discardPile: CardType[]; discardPileLastPlayed: CardType[] };        
};

export type RenderCtx = {
	id: string;		
	header?: string;
	dimHeader?: boolean;
	players?: Record<string, { name: string; hand: number; out?: boolean | undefined }>;
    drawPileAmount: number;
    discardPileAmount: number;
    discardPileLastPlayed: CardType[];
	hand: CardType[] | undefined;
	isActive: boolean;
	side: string | null;
	turn: string;	
    phase: GamePhase;
    phaseData: PhaseData;
};

export enum GamePhase {
    WaitingForAction = 'Waiting for action',
    NopingWindow = 'Noping window',
    ResolvingAction = 'Resolving action',
    DrawingCard = 'Drawing card',
    VoltorbReaction = 'Voltorb reaction',
    EndOfTurn = 'End of turn',    
}

export type PhaseData =
  | { phase: GamePhase.WaitingForAction; turnsLeft: number }
  | { phase: GamePhase.NopingWindow; playedCards: CardType[]; timerEndsAt: number; nopes: string[] } // nopes as user IDs
  | { phase: GamePhase.ResolvingAction; actionSucessful: boolean; playedCards: CardType[] }
  | { phase: GamePhase.DrawingCard; }
  | { phase: GamePhase.VoltorbReaction; hasDefuse: boolean; voltorbDrawn: boolean }
  | { phase: GamePhase.EndOfTurn; turnsLeft: number }
  
  