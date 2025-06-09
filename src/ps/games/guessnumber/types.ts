export type State = {
	solution: number[];
	board: { guess: number; offset: number; result: string }[];
	cap: number;
	turn: '';
};
