import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function GET(request: Request) {
	const auth = getAuthUser(request);
	if (!auth || auth.role !== "admin") {
		return Response.json({error: "Forbidden"}, {status: 403});
	}

	const projects = db
		.prepare(
			`
    SELECT p.*, u.username
    FROM projects p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.status = 'submitted'
    ORDER BY p.created_at DESC
  `,
		)
		.all();

	return Response.json({projects});
}
