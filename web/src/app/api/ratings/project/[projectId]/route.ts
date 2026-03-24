import db from "@/lib/db";

export async function GET(
	_request: Request,
	{params}: {params: Promise<{projectId: string}>},
) {
	const {projectId} = await params;

	const ratings = db
		.prepare(
			`
    SELECT r.*, u.username
    FROM ratings r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.project_id = ?
    ORDER BY r.created_at DESC
  `,
		)
		.all(Number(projectId));

	return Response.json({ratings});
}
