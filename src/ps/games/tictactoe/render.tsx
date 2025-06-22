import { Table } from '@/ps/games/render';
import { Button } from '@/utils/components/ps';

import type { RenderCtx, Turn } from '@/ps/games/tictactoe/types';
import type { CellRenderer } from '@/ps/games/render';
import type { ReactElement } from 'react';

const roundStyles = { height: 24, width: 24, display: 'inline-block', borderRadius: 100, marginLeft: 3, marginTop: 3 };

type This = { msg: string };

export function renderBoard(this: This, ctx: RenderCtx): ReactElement {
	const Cell: CellRenderer<Turn | null> = ({ cell, i, j }) => {
		const action = cell === null;
		return (
			<td style={{ height: 30, width: 30, background: 'green', borderCollapse: 'collapse', border: '1px solid black' }}>
				{cell ? (
					<span style={{ ...roundStyles, background: cell === 'W' ? 'white' : 'black' }} />
				) : action ? (
					<Button value={`${this.msg} play ${i}-${j}`} style={{ ...roundStyles, border: '1px dashed black', background: '#6666' }}>
						{' '}
					</Button>
				) : null}
			</td>
		);
	};

	return <Table<Turn | null> board={ctx.board} labels={{ row: '1-9', col: 'A-Z' }} Cell={Cell} />;        
}


export function render(this: { msg: string }, ctx: RenderCtx) {
    return (
        <>      
        <center>
            <h1>{ctx.header}</h1>
            {renderBoard.bind(this)(ctx)}
        </center>      
        </>
    );
}
