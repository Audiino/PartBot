/* eslint-disable max-len */

export enum CardType {
	EXPLODING_VOLTORB = 'EXPLODING_VOLTORB',
	DEFUSE = 'DEFUSE',
	ALTER_THE_FUTURE = 'ALTER_THE_FUTURE',
	SEE_THE_FUTURE = 'SEE_THE_FUTURE',
	TARGETED_ATTACK = 'TARGETED_ATTACK',
	ATTACK = 'ATTACK',
	DRAW_FROM_BOTTOM = 'DRAW_FROM_BOTTOM',
	FAVOR = 'FAVOR',
	SHUFFLE = 'SHUFFLE',
	SKIP = 'SKIP',
	NOPE = 'NOPE',
	BEARD_CAT = 'BEARD_CAT',
	CATTERMELON_CAT = 'CATTERMELON_CAT',
	POTATO_CAT = 'POTATO_CAT',
	RAINBOW_CAT = 'RAINBOW_CAT',
	TACO_CAT = 'TACO_CAT',
	FERAL_CAT = 'FERAL_CAT',
};

export const ValidSingleCard: Set<CardType> = new Set([
	CardType.ALTER_THE_FUTURE,
	CardType.SEE_THE_FUTURE,
	CardType.TARGETED_ATTACK,
	CardType.ATTACK,
	CardType.DRAW_FROM_BOTTOM,
	CardType.FAVOR,
	CardType.SHUFFLE,
	CardType.SKIP,
]);

type CardInfo = {
  name: string;
  description: string;
};

export const CardData: Record<CardType, CardInfo> = {
	[CardType.EXPLODING_VOLTORB]: {
		name: 'Exploding Voltorb',
		description: "Show this card immediately. Unless you have a Defuse Card, you're dead. Discard all of your cards, including the Exploding Kitten.",
	},
	[CardType.DEFUSE]: {
		name: 'Defuse',
		description: 'Instead of exploding, secretly put the Exploding Voltorb back into the draw pile.',
	},
	[CardType.ALTER_THE_FUTURE]: {
		name: 'Alter the future',
		description: 'Privately view and rearrange the top three cards of the draw pile.',
	},
	[CardType.SEE_THE_FUTURE]: {
		name: 'See the future',
		description: 'Privately view the top three cards of the draw pile.',
	},
	[CardType.TARGETED_ATTACK]: {
		name: 'Targeted attack',
		description: 'End your turn without drawing a card. Force any player to take two turns. Play then continues from that player. This effect can stack.',
	},
	[CardType.ATTACK]: {
		name: 'Attack',
		description: 'End your turn without drawing a card. Force the next player to take two turns. This effect can stack.',
	},
	[CardType.DRAW_FROM_BOTTOM]: {
		name: 'Draw from bottom',
		description: 'End your turn by drawing the bottom card from the draw pile.',
	},
	[CardType.FAVOR]: {
		name: 'Favor',
		description: 'Force any player to give you a card of their choice.',
	},
	[CardType.SHUFFLE]: {
		name: 'Shuffle',
		description: 'Shuffle the draw pile.',
	},
	[CardType.SKIP]: {
		name: 'Skip',
		description: 'End your turn without drawing a card.',
	},
	[CardType.NOPE]: {
		name: 'Nope',
		description: 'Stop the action of another player. You can play this at any time. A Nope can be played on another Nope to negate it and create a Yup, and so on. Any cards that have been Noped are put in the discard pile.',
	},
	[CardType.BEARD_CAT]: {
		name: 'Cat card: Beard cat',
		description: 'The Beard Cat is powerless on its own, but can be used in Special Combos.',
	},
	[CardType.CATTERMELON_CAT]: {
		name: 'Cat card: Cattermelon cat',
		description: 'The Cattermelon Cat is powerless on its own, but can be used in Special Combos.',
	},
	[CardType.POTATO_CAT]: {
		name: 'Cat card: Potato cat',
		description: 'The Potato Cat is powerless on its own, but can be used in Special Combos.',
	},
	[CardType.RAINBOW_CAT]: {
		name: 'Cat card: Rainbow cat',
		description: 'The Rainbow Cat is powerless on its own, but can be used in Special Combos.',
	},
	[CardType.TACO_CAT]: {
		name: 'Cat card: Taco cat',
		description: 'The Taco Cat is powerless on its own, but can be used in Special Combos.',
	},
	[CardType.FERAL_CAT]: {
		name: 'Cat card: Feral cat',
		description: 'The Feral Cat is powerless on its own, but can be used as any cat card in Special Combos.',
	},
}

export const CardName: Record<CardType, string> = Object.fromEntries(
	Object.entries(CardData).map(([key, value]) => [key, value.name])
) as Record<CardType, string>;

export const CardDescription: Record<CardType, string> = Object.fromEntries(
	Object.entries(CardData).map(([key, value]) => [key, value.description])
) as Record<CardType, string>;

export enum ComboType {
	TWO_OF_A_KIND = 'Two of a kind',
	THREE_OF_A_KIND = 'Three of a kind',
	FIVE_UNIQUE = 'Five unique cards',
	INVALID_CARD_SELECTION = 'Invalid card selection',
}

export const ComboDescription: Record<ComboType, string> = {
	[ComboType.TWO_OF_A_KIND]: 'Play any two identical cards to steal a random card from any player.',
	[ComboType.THREE_OF_A_KIND]: "Play any three identical cards to name a card you want from any player. If they have it, you take the card. If they don't have it, you get nothing.",
	[ComboType.FIVE_UNIQUE]: 'Play any five different cards to take one card from the discard pile.',
	[ComboType.INVALID_CARD_SELECTION]: 'Your current card selection is invalid and does not do anything.',
}

// total 41
export const CardCountsSmall: Record<CardType, number> = {
	[CardType.EXPLODING_VOLTORB]: 0,
	[CardType.DEFUSE]: 0,
	[CardType.ALTER_THE_FUTURE]: 2,
	[CardType.SEE_THE_FUTURE]: 3,
	[CardType.TARGETED_ATTACK]: 2,
	[CardType.ATTACK]: 2,
	[CardType.DRAW_FROM_BOTTOM]: 3,
	[CardType.FAVOR]: 2,
	[CardType.SHUFFLE]: 2,
	[CardType.SKIP]: 4,
	[CardType.NOPE]: 4,
	[CardType.BEARD_CAT]: 3,
	[CardType.CATTERMELON_CAT]: 3,
	[CardType.POTATO_CAT]: 3,
	[CardType.RAINBOW_CAT]: 3,
	[CardType.TACO_CAT]: 3,
	[CardType.FERAL_CAT]: 2,
};

// total 60
export const CardCountsMedium: Record<CardType, number> = {
	[CardType.EXPLODING_VOLTORB]: 0,
	[CardType.DEFUSE]: 0,
	[CardType.ALTER_THE_FUTURE]: 4,
	[CardType.SEE_THE_FUTURE]: 3,
	[CardType.TARGETED_ATTACK]: 3,
	[CardType.ATTACK]: 3,
	[CardType.DRAW_FROM_BOTTOM]: 4,
	[CardType.FAVOR]: 4,
	[CardType.SHUFFLE]: 4,
	[CardType.SKIP]: 6,
	[CardType.NOPE]: 5,
	[CardType.BEARD_CAT]: 4,
	[CardType.CATTERMELON_CAT]: 4,
	[CardType.POTATO_CAT]: 4,
	[CardType.RAINBOW_CAT]: 4,
	[CardType.TACO_CAT]: 4,
	[CardType.FERAL_CAT]: 4,
};

// total 101
export const CardCountsLarge: Record<CardType, number> = {
	[CardType.EXPLODING_VOLTORB]: 0,
	[CardType.DEFUSE]: 0,
	[CardType.ALTER_THE_FUTURE]: 6,
	[CardType.SEE_THE_FUTURE]: 6,
	[CardType.TARGETED_ATTACK]: 5,
	[CardType.ATTACK]: 5,
	[CardType.DRAW_FROM_BOTTOM]: 7,
	[CardType.FAVOR]: 6,
	[CardType.SHUFFLE]: 6,
	[CardType.SKIP]: 10,
	[CardType.NOPE]: 9,
	[CardType.BEARD_CAT]: 7,
	[CardType.CATTERMELON_CAT]: 7,
	[CardType.POTATO_CAT]: 7,
	[CardType.RAINBOW_CAT]: 7,
	[CardType.TACO_CAT]: 7,
	[CardType.FERAL_CAT]: 6,
};