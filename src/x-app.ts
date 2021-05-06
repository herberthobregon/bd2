import { CtLit, html, property, customElement, css, state, query } from '@conectate/ct-lit';
import '@conectate/ct-select';
import '@conectate/ct-button';
import { xget, xhttp } from './xFetch';
import { CtSelect } from '@conectate/ct-select';

@customElement('x-app')
export class XApp extends CtLit {
	static styles = css`
		:host {
			display: block;
			padding: 24px;
			max-width: 900px;
			margin: 24px auto;
			border-radius: 24px;
			border: 1px solid #e2e2e2;
		}
		table {
			margin: 0 auto;
			max-width: 600px;
			width: 100%;
			border-collapse: collapse;
			page-break-inside: avoid;
		}
		table,
		td,
		th {
			border: 1px solid black;
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}
	`;
	@state() private page = 0;
	@state() private rows: any[] = [];
	@state() private cols: string[] = [];
	@query('#select') select: CtSelect;

	render() {
		return html` ${this.getPage(this.page)}`;
	}

	getPage(page: number) {
		switch (page) {
			case 0:
				return html`<ct-select id="select" label="Seleccione la consulta a realizar" .items=${this.getItems()} .value=${0}></ct-select>
					<div>
						<ct-button raised @click=${this.getQuery}>Consultar</ct-button>
					</div>
					<h2>Resultados</h2>
					<table>
						<tr>
							${this.cols.map((col) => html`<th>${col}</th>`)}
						</tr>
						${this.rows.map(
							(row) => html`<tr>
								${this.cols.map((col) => html`<td>${row[col]}</td>`)}
							</tr>`
						)}
					</table>`;
		}
	}

	async getQuery() {
		let { json, error } = await xget('/query', { query: this.select.value });
		if (error) {
			alert(error.error_msg);
			return;
		}
		this.cols = Object.keys(json[0] || {});
		this.rows = json;
	}

	getItems() {
		return [
			{ text: 'Operaciones realizados por un cuentahabiente', value: 0 },
			{ text: 'Totales de créditos y débitos para una institución financiera', value: 1 },
			{ text: 'cuentahabientes', value: 2 },
			{ text: 'Instituciones bancarias', value: 3 },
			{ text: 'Movimientos por cuentahabiente por mes', value: 4 }
		];
	}
}
