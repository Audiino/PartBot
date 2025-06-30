import { GamesList } from '@/ps/games/types';
import { fromHumanTime } from '@/tools';

import type { Meta } from '@/ps/games/types';

export const meta: Meta = {
	name: 'Exploding Voltorb',
	id: GamesList.ExplodingVoltorb,
	aliases: ['ev'],
	players: 'many',

	minSize: 2,
	maxSize: 10,
	
	autostart: false,
	pokeTimer: fromHumanTime('30 sec'),
	timer: fromHumanTime('1 min'),
};
