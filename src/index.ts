import { addUser, getUsers } from "../db/db";

interface Env {
	DB: D1Database;
}

export interface User {
	username: string;
	display_name: string;
	media_url: string;
	title: string;
}

class UserHandler {
	async fetch(request: Request, env: Env) {
		try {
			const { pathname } = new URL(request.url);

			if (pathname === '/') {
				const users = await getUsers(env.DB);
				return new Response(JSON.stringify(users), {
					headers: { "Content-Type": "application/json" },
				});
			}

			if (pathname === '/add' && request.method === "POST") {
				const requestBody: any = await request.json();
				const user: User = {
					username: requestBody.username,
					display_name: requestBody.display_name,
					media_url: requestBody.media_url,
					title: requestBody.title
				};

				if (!user.username || !user.display_name || !user.media_url || !user.title) {
					return new Response(
						JSON.stringify({ success: false, message: 'All user fields are required' }),
						{ status: 400, headers: { "Content-Type": "application/json" } }
					);
				}

				const addResult = await addUser(env.DB, user);

				return new Response(JSON.stringify(addResult), {
					headers: { "Content-Type": "application/json" },
				});
			}

			return new Response("Invalid endpoint or method", {
				status: 404,
				headers: { "Content-Type": "text/plain" },
			});
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}
	}
}

export default new UserHandler();

