import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function PUT(
	request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const auth = getAuthUser(request);
	if (!auth || auth.role !== "admin") {
		return Response.json({error: "Forbidden"}, {status: 403});
	}

	const {id} = await params;
	const project = db
		.prepare("SELECT * FROM projects WHERE id = ?")
		.get(Number(id));
	if (!project)
		return Response.json({error: "Project not found"}, {status: 404});

	try {
		const body = await request.json().catch(() => ({}));
		const featured = body.featured ? 1 : 0;
		const status = featured ? "featured" : "approved";

		db.prepare(
			"UPDATE projects SET status = ?, featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		).run(status, featured, Number(id));
		const updated = db
			.prepare("SELECT * FROM projects WHERE id = ?")
			.get(Number(id));
		return Response.json({project: updated});
	} catch (err) {
		console.error("Approve error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
