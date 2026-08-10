import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const stats = await base44.asServiceRole.entities.SiteStats.list();

    let newCount;
    if (stats.length === 0) {
      const created = await base44.asServiceRole.entities.SiteStats.create({ visits: 1 });
      newCount = 1;
    } else {
      newCount = (stats[0].visits || 0) + 1;
      await base44.asServiceRole.entities.SiteStats.update(stats[0].id, { visits: newCount });
    }

    return Response.json({ visits: newCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}