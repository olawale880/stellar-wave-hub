import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function PUT(
	request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	const {id} = await params;
	const project = db
		.prepare("SELECT * FROM projects WHERE id = ?")
		.get(Number(id)) as Record<string, unknown> | undefined;
	if (!project)
		return Response.json({error: "Project not found"}, {status: 404});
	if (project.user_id !== auth.userId && auth.role !== "admin") {
		return Response.json({error: "Forbidden"}, {status: 403});
	}

	try {
		const body = await request.json();
		const allowed = [
			"name",
			"description",
			"category",
			"stellar_account_id",
			"stellar_contract_id",
			"tags",
			"website_url",
			"github_url",
			"logo_url",
		];
		const fields: string[] = [];
		const values: unknown[] = [];

		for (const key of allowed) {
			if (body[key] !== undefined) {
				fields.push(`${key} = ?`);
				values.push(body[key]);
			}
		}

		if (fields.length === 0)
			return Response.json({error: "No fields to update"}, {status: 400});

		fields.push("updated_at = CURRENT_TIMESTAMP");
		values.push(Number(id));
		db.prepare(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`).run(
			...values,
		);

		const updated = db
			.prepare("SELECT * FROM projects WHERE id = ?")
			.get(Number(id));
		return Response.json({project: updated});
	} catch (err) {
		console.error("Edit project error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
