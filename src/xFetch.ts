export function getAPIURL() {
	return 'http://127.0.0.1:3000';
}

function toQueryString(obj: any) {
	var parts = [];
	for (var i in obj) {
		if (obj.hasOwnProperty(i) && obj[i] != undefined) {
			parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}
	}
	return parts.join('&');
}
export namespace xFetch {
	export interface xResponse<T = any> {
		response: Response;
		json: T;
		error?: xError;
	}
	export interface xError {
		number: number;
		status: number;
		error_type: number;
		error_msg: string;
	}

	export interface Pagination {
		token?: string;
		limit?: string;
		skip?: string;
	}
}

function xget<T = any>(url: string, params?: any, options?: { skipBaseURL?: boolean }): Promise<xFetch.xResponse<T>> {
	let parsedURL: URL;
	return new Promise(async (solve) => {
		if (options?.skipBaseURL) parsedURL = new URL(url);
		else parsedURL = new URL(getAPIURL() + url);
		if (params) parsedURL.search = toQueryString(params);
		let p = await fetch(parsedURL.href, {
			headers: {
				Accept: 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache'
			},
			method: 'GET',
			mode: 'cors'
		});

		let jsonResult: any = {};
		try {
			jsonResult = await p.json();
		} catch {}
		if (p.status >= 400) {
			solve({ json: jsonResult, error: jsonResult, response: p });
		} else {
			solve({ json: jsonResult, response: p });
		}
	});
}

function xhttp<T = any>(url: string, method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'SEARCH', body?: any, options?: { skipBaseURL?: boolean }): Promise<xFetch.xResponse<T>> {
	let parsedURL: URL;
	return new Promise(async (solve, err) => {
		if (typeof body == 'object' && !(body instanceof FormData)) {
			body = JSON.stringify(body);
		}
		let Content_Type = body instanceof FormData ? 'X-Content-Type' : 'Content-Type';
		if (options?.skipBaseURL) parsedURL = new URL(url);
		else parsedURL = new URL(getAPIURL() + url);
		let p = await fetch(parsedURL.href, {
			headers: {
				Accept: 'application/json, text/javascript, */*;',
				[Content_Type]: 'application/json',
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache',
				'x-app-version': process.env.VERSION!
			},
			body: body,
			method: method,
			mode: 'cors'
		});
		let jsonResult: any = {};
		try {
			jsonResult = await p.json();
		} catch {}

		if (p.status >= 400) {
			solve({ json: jsonResult, error: jsonResult, response: p });
		} else {
			solve({ json: jsonResult, response: p });
		}
	});
}

export { xget, xhttp, toQueryString };
