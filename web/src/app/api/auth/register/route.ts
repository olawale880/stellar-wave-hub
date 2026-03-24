import db from "@/lib/db";
import {hashPassword, signToken} from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const {username, email, password} = await request.json();
		if (!username || !email || !password) {
			return Response.json(
				{error: "Username, email, and password are required"},
				{status: 400},
			);
		}
		if (password.length < 6) {
			return Response.json(
				{error: "Password must be at least 6 characters"},
				{status: 400},
			);
		}

		const existing = db
			.prepare("SELECT id FROM users WHERE email = ? OR username = ?")
			.get(email, username);
		if (existing) {
			return Response.json(
				{error: "Email or username already taken"},
				{status: 409},
			);
		}

		const password_hash = await hashPassword(password);
		const result = db
			.prepare(
				"INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
			)
			.run(username, email, password_hash);

		const token = signToken({
			userId: Number(result.lastInsertRowid),
			role: "contributor",
		});
		return Response.json(
			{
				token,
				user: {
					id: Number(result.lastInsertRowid),
					username,
					email,
					role: "contributor",
				},
			},
			{status: 201},
		);
	} catch (err) {
		console.error("Register error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
