import db from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Support lookup by numeric ID or slug
  const isNumeric = /^\d+$/.test(id);
  const project = isNumeric
    ? (db
        .prepare(
          `SELECT p.*, u.username, u.github_url as user_github
           FROM projects p LEFT JOIN users u ON p.user_id = u.id
           WHERE p.id = ?`
        )
        .get(Number(id)) as Record<string, unknown> | undefined)
    : (db
        .prepare(
          `SELECT p.*, u.username, u.github_url as user_github
           FROM projects p LEFT JOIN users u ON p.user_id = u.id
           WHERE p.slug = ?`
        )
        .get(id) as Record<string, unknown> | undefined);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const ratings = db
    .prepare(
      `SELECT r.*, u.username
       FROM ratings r LEFT JOIN users u ON r.user_id = u.id
       WHERE r.project_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(project.id);

  const avgRow = db
    .prepare(
      `SELECT
         AVG(score) as avg_score,
         AVG(purpose_score) as avg_purpose,
         AVG(innovation_score) as avg_innovation,
         AVG(usability_score) as avg_usability,
         COUNT(*) as total
       FROM ratings WHERE project_id = ?`
    )
    .get(project.id) as Record<string, unknown>;

  return Response.json({ project, ratings, averages: avgRow });
}
