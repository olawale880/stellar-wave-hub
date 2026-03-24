import db from "@/lib/db";
import {getRecentTransactions} from "@/lib/stellarService";

export async function GET(
	_request: Request,
	{params}: {params: Promise<{projectId: string}>},
) {
	const {projectId} = await params;
	const project = db
		.prepare(
			"SELECT id, name, stellar_account_id FROM projects WHERE id = ?",
		)
		.get(Number(projectId)) as Record<string, unknown> | undefined;

	if (!project)
		return Response.json({error: "Project not found"}, {status: 404});
	if (!project.stellar_account_id) {
		return Response.json(
			{error: "No Stellar account linked"},
			{status: 400},
		);
	}

	try {
		const transactions = await getRecentTransactions(
			project.stellar_account_id as string,
		);
		return Response.json({transactions});
	} catch (err) {
		console.error("Transactions error:", err);
		return Response.json(
			{error: "Failed to fetch transactions from Stellar"},
			{status: 502},
		);
	}
}
