import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function POST(request: Request) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	try {
		const {
			project_id,
			score,
			purpose_score,
			innovation_score,
			usability_score,
			review_text,
		} = await request.json();

		if (!project_id || !score || score < 1 || score > 5) {
			return Response.json(
				{error: "project_id and score (1-5) are required"},
				{status: 400},
			);
		}

		const project = db
			.prepare("SELECT id, user_id FROM projects WHERE id = ?")
			.get(project_id) as Record<string, unknown> | undefined;
		if (!project)
			return Response.json({error: "Project not found"}, {status: 404});
		if (project.user_id === auth.userId) {
			return Response.json(
				{error: "Cannot rate your own project"},
				{status: 400},
			);
		}

		db.prepare(
			`
      INSERT INTO ratings (project_id, user_id, score, purpose_score, innovation_score, usability_score, review_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(project_id, user_id) DO UPDATE SET
        score = excluded.score,
        purpose_score = excluded.purpose_score,
        innovation_score = excluded.innovation_score,
        usability_score = excluded.usability_score,
        review_text = excluded.review_text,
        created_at = CURRENT_TIMESTAMP
    `,
		).run(
			project_id,
			auth.userId,
			score,
			purpose_score || null,
			innovation_score || null,
			usability_score || null,
			review_text || null,
		);

		return Response.json({message: "Rating saved"}, {status: 201});
	} catch (err) {
		console.error("Rating error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
