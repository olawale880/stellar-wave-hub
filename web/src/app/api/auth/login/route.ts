import db from "@/lib/db";
import {comparePassword, signToken} from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const {email, password} = await request.json();
		if (!email || !password) {
			return Response.json(
				{error: "Email and password are required"},
				{status: 400},
			);
		}

		const user = db
			.prepare("SELECT * FROM users WHERE email = ?")
			.get(email) as Record<string, unknown> | undefined;
		if (!user) {
			return Response.json({error: "Invalid credentials"}, {status: 401});
		}

		const valid = await comparePassword(
			password,
			user.password_hash as string,
		);
		if (!valid) {
			return Response.json({error: "Invalid credentials"}, {status: 401});
		}

		const token = signToken({
			userId: user.id as number,
			role: user.role as string,
		});
		return Response.json({
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				stellar_address: user.stellar_address,
				github_url: user.github_url,
				bio: user.bio,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
