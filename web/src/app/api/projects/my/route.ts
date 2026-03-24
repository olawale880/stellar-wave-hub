import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function GET(request: Request) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	const projects = db
		.prepare(
			`
    SELECT p.*,
      (SELECT AVG(r.score) FROM ratings r WHERE r.project_id = p.id) as avg_rating,
      (SELECT COUNT(*) FROM ratings r WHERE r.project_id = p.id) as rating_count
    FROM projects p
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `,
		)
		.all(auth.userId);

	return Response.json({projects});
}
