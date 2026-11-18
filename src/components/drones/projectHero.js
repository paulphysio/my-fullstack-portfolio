import { titleScene, loadImage } from './page';
import { picture, frame, shape, text, group, FONTS, C } from './compose';

/* Shared by the project detail page(s): header copy + the split drone hero. */

export const headerFor = (project) => ({
  eyebrow: `$ cat ./projects/${project.slug}`,
  title: project.title,
  sub: project.description,
  meta: `${project.status} · ${project.year} · ${project.tech.slice(0, 3).join(' · ')}`,
});

/** Split hero: title on one side, the live site painted by drones on the other. */
export async function projectHero(ctx, project) {
  const { M, CW, mobile, region } = ctx;
  const img = await loadImage(project.image);
  const h = region.bottom - region.top;
  const textRegion = mobile ? { top: region.top, bottom: region.top + h * 0.5 } : region;
  const els = titleScene({ ...ctx, region: textRegion }, { ...headerFor(project), longTitle: true, maxWidth: mobile ? CW : CW * 0.44 });
  const bx = mobile ? M : M + CW * 0.5;
  const bw = mobile ? CW : CW * 0.5;
  const bh = mobile ? Math.min(h * 0.42, bw * 0.66) : Math.min(h * 0.8, bw * 0.68);
  const by = mobile ? region.top + h * 0.53 : region.top + (h - bh) / 2;
  const host = (project.live || '').replace(/^https?:\/\//, '').replace(/\/$/, '') || project.slug;
  els.push(
    group({
      id: 'browser',
      slot: 'browser',
      order: 0.1,
      children: [
        frame({ id: 'bf', x: bx, y: by, w: bw, h: bh, r: 14, color: C.cyan, lineWidth: 1.3, spacing: 1.3 }),
        shape({
          id: 'bb',
          bbox: { x: bx, y: by, w: 80, h: 38 },
          spacing: 1.15,
          paint(c) {
            [C.red, C.yellow, C.okgreen].forEach((col, i) => {
              c.fillStyle = col;
              c.beginPath();
              c.arc(bx + 22 + i * 17, by + 19, 4.5, 0, Math.PI * 2);
              c.fill();
            });
          },
        }),
        text({ id: 'url', x: bx + bw / 2, y: by + 11, str: host, font: FONTS.mono(500, 12), color: C.dim, align: 'center', spacing: 1.1 }),
      ],
    })
  );
  if (img) {
    const budget = mobile ? 11000 : 30000;
    els.push(
      picture({
        id: 'shot',
        slot: 'shot',
        img,
        x: bx + 2,
        y: by + 38,
        w: bw - 4,
        h: bh - 40,
        fit: 'cover',
        alignTop: true,
        radius: 10,
        spacing: Math.max(mobile ? 2 : 2.3, Math.sqrt((bw * (bh - 38)) / budget)),
        order: 0.35,
      })
    );
  }
  return els;
}

