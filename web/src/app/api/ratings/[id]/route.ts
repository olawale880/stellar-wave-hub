import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";

export async function DELETE(
	request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	const {id} = await params;
	const rating = db
		.prepare("SELECT * FROM ratings WHERE id = ?")
		.get(Number(id)) as Record<string, unknown> | undefined;
	if (!rating)
		return Response.json({error: "Rating not found"}, {status: 404});
	if (rating.user_id !== auth.userId && auth.role !== "admin") {
		return Response.json({error: "Forbidden"}, {status: 403});
	}

	db.prepare("DELETE FROM ratings WHERE id = ?").run(Number(id));
	return Response.json({message: "Rating deleted"});
}
