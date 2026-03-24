import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function GET(request: Request) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	const user = db
		.prepare(
			"SELECT id, username, email, role, stellar_address, github_url, bio, created_at FROM users WHERE id = ?",
		)
		.get(auth.userId);
	if (!user) return Response.json({error: "User not found"}, {status: 404});
	return Response.json({user});
}

export async function PUT(request: Request) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	try {
		const {username, bio, stellar_address, github_url} =
			await request.json();
		const fields: string[] = [];
		const values: unknown[] = [];

		if (username !== undefined) {
			fields.push("username = ?");
			values.push(username);
		}
		if (bio !== undefined) {
			fields.push("bio = ?");
			values.push(bio);
		}
		if (stellar_address !== undefined) {
			fields.push("stellar_address = ?");
			values.push(stellar_address);
		}
		if (github_url !== undefined) {
			fields.push("github_url = ?");
			values.push(github_url);
		}

		if (fields.length === 0)
			return Response.json({error: "No fields to update"}, {status: 400});

		values.push(auth.userId);
		db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(
			...values,
		);

		const user = db
			.prepare(
				"SELECT id, username, email, role, stellar_address, github_url, bio FROM users WHERE id = ?",
			)
			.get(auth.userId);
		return Response.json({user});
	} catch (err) {
		console.error("Update profile error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
