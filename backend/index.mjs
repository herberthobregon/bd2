import express from 'express';
import cors from 'cors';
import { session } from './cassandra.mjs';

const app = express();
const port = 3000;

app.use(cors());

app.get('/query', async (req, res) => {
	/** @type {{ query: 0 | 1 | 2 | 3 | 4 | 5, id: string }} */
	let query = req.query;

	switch (Number(query.query)) {
		case 0: {
			let r = await session.execute(`SELECT * FROM log_operaciones WHERE cliente_id='${query.id}'`);
			return res.json(r.rows.length > 0 ? r.rows : [{no_data: ''}]);
		}
		case 1: {
			let creditos = await session.execute(`SELECT SUM(monto) as sum FROM log_operaciones_by_empresa WHERE entidad_id='${query.id}' AND tipo in (0,2)`);
			let debitos = await session.execute(`SELECT SUM(monto) as sum FROM log_operaciones_by_empresa WHERE entidad_id='${query.id}' AND tipo in (1,3,4)`);
			return res.json([
				{
					creditos: creditos.rows[0].sum,
					debitos: debitos.rows[0].sum
				}
			]);
		}
		case 2: {
			let r = await session.execute(`SELECT * as sum FROM cuentas WHERE id='${query.id}'`);
			return res.json(r.rows);
		}
		case 3: {
			let r = await session.execute(`SELECT * as sum FROM entidad WHERE id='${query.id}'`);
			return res.json(r.rows);
		}
		case 5: {
			let r = await session.execute(`SELECT * as sum FROM log_operaciones WHERE cliente_id='${query.id}'`);
			return res.json(r.rows);
		}
	}

	res.json([]);
});

app.listen(port, '0.0.0.0', () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
