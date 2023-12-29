import { XMLParser } from "fast-xml-parser";
import { sleep } from "./sleep";

export const parser = new XMLParser({ ignoreAttributes: false });

export async function parseXML(url: string, userAgent: string, password?: string) {
	const headers: Record<string, string> = {
		'User-Agent': userAgent
	};

	if (password) {
		headers['X-Password'] = password;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers
	});

	if (response.status === 404) {
		throw new Error("Error 404")
	}

	if (response.status === 409) {
		return {"status": `failed with error code 409`}
	}

	if (response.status === 429) {
		await sleep(Number(response.headers.get('retry-after')) * 1000 + 2000)
		return await parseXML(url, userAgent, password ? password : "")
	}

	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}