import type { CardType } from '@/ps/games/explodingvoltorb/constants';
import type { BaseLog } from '@/ps/games/types';
import type { Satisfies, SerializedInstance } from '@/types/common';
import type { Point } from '@/utils/grid';

export type Log = Satisfies<
	BaseLog,
	{
		time: Date;
		turn: string;
	} & (
		| {
				action: 'draw';
				ctx: { hand: CardType[]; drawnCard: CardType; getsEliminated: boolean; }            								
		  }
		| {     action: 'replace'; 
				ctx: { replacePosition: number } 
		  }
		| {     action: 'nope'; 
				ctx: { rack: string[] } 
		  }
		| {     action: 'play'; 
				ctx: { rack: string[] } 
		  }  
	)
>;

export type APILog = SerializedInstance<Log>;
