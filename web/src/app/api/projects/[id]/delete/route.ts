import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function DELETE(
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

	db.prepare("DELETE FROM ratings WHERE project_id = ?").run(Number(id));
	db.prepare("DELETE FROM projects WHERE id = ?").run(Number(id));

	return Response.json({message: "Project deleted"});
}
