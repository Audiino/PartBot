/* eslint-disable max-len */

export enum CardType {
	EXPLODING_VOLTORB = 'Exploding Voltorb',
	DEFUSE = 'Defuse',
	ALTER_THE_FUTURE = 'Alter the future',
	SEE_THE_FUTURE = 'See the future',
	TARGETED_ATTACK = 'Targeted attack',
	ATTACK = 'Attack',
	DRAW_FROM_BOTTOM = 'Draw from bottom',
	FAVOR = 'Favor',
	SHUFFLE = 'Shuffle',
	SKIP = 'Skip',
	NOPE = 'Nope',
	BEARD_CAT = 'Cat card: beard cat',
	CATTERMELON_CAT = 'Cat card: cattermelon cat',
	POTATO_CAT = 'Cat card: potato cat',
	RAINBOW_CAT = 'Cat card: rainbow cat',
	TACO_CAT = 'Cat card: taco cat',
	FERAL_CAT = 'Feral cat',
};

export const CardDescription: Record<CardType, string> = {
	[CardType.EXPLODING_VOLTORB]: "Show this card immediately. Unless you have a Defuse Card, you're dead. Discard all of your cards, including the Exploding Kitten.",
	[CardType.DEFUSE]: 'Instead of exploding, secretly put the Exploding Voltorb back into the draw pile.',
	[CardType.ALTER_THE_FUTURE]: 'Privately view and rearrange the top three cards of the draw pile.',
	[CardType.SEE_THE_FUTURE]: 'Privately view the top three cards of the draw pile.',
	[CardType.TARGETED_ATTACK]: 'End your turn without drawing a card. Force any player to take two turns. Play then continues from that player. This effect can stack.',
	[CardType.ATTACK]: 'End your turn without drawing a card. Force the next player to take two turns. This effect can stack.',
	[CardType.DRAW_FROM_BOTTOM]: 'End your turn by drawing the bottom card from the draw pile.',
	[CardType.FAVOR]: 'Force any player to give you a card of their choice.',
	[CardType.SHUFFLE]: 'Shuffle the draw pile.',
	[CardType.SKIP]: 'End your turn without drawing a card.',
	[CardType.NOPE]: 'Stop the action of another player. You can play this at any time. A Nope can be played on another Nope to negate it and create a Yup, and so on. Any cards that have been Noped are put in the discard pile.',
	[CardType.BEARD_CAT]: 'The Beard Cat is powerless on its own, but can be used in Special Combos.',
	[CardType.CATTERMELON_CAT]: 'The Cattermelon Cat is powerless on its own, but can be used in Special Combos.',
	[CardType.POTATO_CAT]: 'The Potato Cat is powerless on its own, but can be used in Special Combos.',
	[CardType.RAINBOW_CAT]: 'The Rainbow Cat is powerless on its own, but can be used in Special Combos.',
	[CardType.TACO_CAT]: 'The Taco Cat is powerless on its own, but can be used in Special Combos.',
	[CardType.FERAL_CAT]: 'The Feral Cat is powerless on its own, but can be used as any cat card in Special Combos.',
}

export enum CombosDescription {
	TWO_OF_A_KIND = 'Play any two identical cards to steal a random card from any player.',
	THREE_OF_A_KIND = "Play any three identical cards to name a card you want from any player. If they have it, you take the card. If they don't have it, you get nothing.",
	FIVE_DIFFERENT_KINDS = 'Play any five different cards to take one card from the discard pile.',
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