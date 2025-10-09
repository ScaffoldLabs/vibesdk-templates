type MessageRole = 'assistant' | 'user';

type ThreadMessage = {
	id: string;
	threadId: string;
	role: MessageRole;
	content: string;
	createdAt: string;
};

type ApiSuccessResponse<T> = {
	success: true;
	data: T;
};

type ApiErrorResponse = {
	success: false;
	error: string;
};

type ApiResponseBody = ApiSuccessResponse<ThreadMessage> | ApiSuccessResponse<ThreadMessage[]> | ApiErrorResponse;

type Env = {
	AI_GATEWAY_URL?: string;
	AI_GATEWAY_API_KEY?: string;
};

const CORS_HEADERS: HeadersInit = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
	'Access-Control-Allow-Headers': 'content-type',
};

function jsonResponse(status: number, body: ApiResponseBody): Response {
	const headers = new Headers(CORS_HEADERS);
	headers.set('content-type', 'application/json; charset=utf-8');
	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
}

function errorResponse(message: string, status = 400): Response {
	const payload: ApiErrorResponse = {
		success: false,
		error: message,
	};
	return jsonResponse(status, payload);
}

function createMessage(threadId: string, role: MessageRole, content: string): ThreadMessage {
	const createdAt = new Date().toISOString();
	return {
		id: `${threadId}-${createdAt}-${role}`,
		threadId,
		role,
		content,
		createdAt,
	};
}

async function handlePostMessage(request: Request, env: Env, threadId: string): Promise<Response> {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch (error) {
		return errorResponse(`Invalid JSON: ${String(error)}`, 400);
	}

	if (typeof payload !== 'object' || payload === null || !('content' in payload)) {
		return errorResponse('Request body must include a "content" field.', 422);
	}

	const contentValue = typeof (payload as { content: unknown }).content === 'string' ? (payload as { content: string }).content.trim() : '';

	if (!contentValue) {
		return errorResponse('Message content is required.', 422);
	}

	const basePrompt = `You are a helpful AI assistant that creates Expo / React Native ideas. Respond conversationally to the message: ${contentValue}`;

	if (env.AI_GATEWAY_URL && env.AI_GATEWAY_API_KEY) {
		try {
			const aiResponse = await fetch(env.AI_GATEWAY_URL, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${env.AI_GATEWAY_API_KEY}`,
				},
				body: JSON.stringify({
					model: 'gpt-4o-mini',
					messages: [
						{ role: 'system', content: 'You specialise in brainstorming delightful mobile journeys.' },
						{ role: 'user', content: basePrompt },
					],
				}),
			});

			if (aiResponse.ok) {
				const parsed = await aiResponse.json() as { choices?: { message?: { content?: string } }[] };
				const content = parsed.choices?.[0]?.message?.content?.trim();
				if (content) {
					const message = createMessage(threadId, 'assistant', content);
					return jsonResponse(200, { success: true, data: message });
				}
			}
		} catch (error) {
			console.warn('AI request failed, falling back to templated response.', error);
		}
	}

	const fallbackContent = `I love that idea! Try outlining screens, navigation, and data requirements next. You said: "${contentValue}".`;
	const message = createMessage(threadId, 'assistant', fallbackContent);
	return jsonResponse(200, { success: true, data: message });
}

function handleGetMessages(threadId: string): Response {
	const welcomeMessage = createMessage(
		threadId,
		'assistant',
		"I'm your Expo launch partner. Describe the mobile experience you want and I will help with flows, data, and implementation tips."
	);

	return jsonResponse(200, { success: true, data: [welcomeMessage] });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { method } = request;
		const url = new URL(request.url);

		if (method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: CORS_HEADERS,
			});
		}

		if (!url.pathname.startsWith('/api/threads/')) {
			return errorResponse('Not found', 404);
		}

		const [, , , threadId, resource] = url.pathname.split('/');
		if (!threadId) {
			return errorResponse('Thread ID is required.', 400);
		}

		if (resource !== 'messages') {
			return errorResponse('Unsupported resource.', 404);
		}

		if (method === 'GET') {
			return handleGetMessages(threadId);
		}

		if (method === 'POST') {
			return handlePostMessage(request, env, threadId);
		}

		return errorResponse('Method not allowed.', 405);
	},
};
