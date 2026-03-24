import db from "@/lib/db";
import {getAuthUser} from "@/lib/auth";
import slugify from "slugify";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const category = url.searchParams.get("category");
		const search = url.searchParams.get("search");
		const sort = url.searchParams.get("sort") || "newest";
		const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
		const limit = Math.min(
			50,
			Math.max(1, Number(url.searchParams.get("limit")) || 12),
		);
		const offset = (page - 1) * limit;

		let where = "WHERE p.status IN ('approved', 'featured')";
		const params: unknown[] = [];

		if (category) {
			where += " AND p.category = ?";
			params.push(category);
		}
		if (search) {
			where +=
				" AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)";
			const term = `%${search}%`;
			params.push(term, term, term);
		}

		let orderBy = "ORDER BY p.featured DESC, p.created_at DESC";
		if (sort === "oldest") orderBy = "ORDER BY p.created_at ASC";
		if (sort === "top-rated")
			orderBy = "ORDER BY avg_rating DESC NULLS LAST, p.created_at DESC";

		const countRow = db
			.prepare(`SELECT COUNT(*) as total FROM projects p ${where}`)
			.get(...params) as {total: number};

		const projects = db
			.prepare(
				`
      SELECT p.*, u.username,
        (SELECT AVG(r.score) FROM ratings r WHERE r.project_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM ratings r WHERE r.project_id = p.id) as rating_count
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      ${where}
      ${orderBy}
      LIMIT ? OFFSET ?
    `,
			)
			.all(...params, limit, offset);

		return Response.json({
			projects,
			pagination: {
				page,
				limit,
				total: countRow.total,
				pages: Math.ceil(countRow.total / limit),
			},
		});
	} catch (err) {
		console.error("List projects error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}

export async function POST(request: Request) {
	const auth = getAuthUser(request);
	if (!auth) return Response.json({error: "Unauthorized"}, {status: 401});

	try {
		const body = await request.json();
		const {
			name,
			description,
			category,
			stellar_account_id,
			stellar_contract_id,
			tags,
			website_url,
			github_url,
			logo_url,
		} = body;

		if (!name || !description || !category) {
			return Response.json(
				{error: "Name, description, and category are required"},
				{status: 400},
			);
		}

		let slug = slugify(name, {lower: true, strict: true});
		const existing = db
			.prepare("SELECT id FROM projects WHERE slug = ?")
			.get(slug);
		if (existing) slug = `${slug}-${Date.now()}`;

		const result = db
			.prepare(
				`
      INSERT INTO projects (name, slug, description, category, stellar_account_id, stellar_contract_id, tags, website_url, github_url, logo_url, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
			)
			.run(
				name,
				slug,
				description,
				category,
				stellar_account_id || null,
				stellar_contract_id || null,
				tags || null,
				website_url || null,
				github_url || null,
				logo_url || null,
				auth.userId,
			);

		const project = db
			.prepare("SELECT * FROM projects WHERE id = ?")
			.get(Number(result.lastInsertRowid));
		return Response.json({project}, {status: 201});
	} catch (err) {
		console.error("Create project error:", err);
		return Response.json({error: "Internal server error"}, {status: 500});
	}
}
