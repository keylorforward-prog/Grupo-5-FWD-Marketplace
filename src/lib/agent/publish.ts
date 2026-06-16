import type { ExtractedProject } from './types';
import { ok, err, type Result } from '@/lib/result';

const TIPO_CAMBIO_USD_CRC = 520;
const PRESUPUESTO_MINIMO_CRC = 100_000;

function mapPlazoDias(durationWeeks: number): 5 | 15 | 30 {
  if (durationWeeks <= 2) return 5;
  if (durationWeeks <= 4) return 15;
  return 30;
}

function usdToCrc(usd: number): number {
  return usd * TIPO_CAMBIO_USD_CRC;
}

function buildDescripcion(project: ExtractedProject): string {
  let desc = project.description;

  if (desc.length < 100 && project.raw_requirements) {
    desc = `${desc}\n\nRequerimientos:\n${project.raw_requirements}`;
  }

  if (desc.length < 100) {
    desc = `${desc}\n\nProyecto creado con el asistente IA de FWD Marketplace para resolver una necesidad de negocio concreta.`;
  }

  return desc;
}

export async function publishProjectFromAgent(
  project: ExtractedProject,
  conversacionId?: number,
): Promise<Result<{ id: number }>> {
  try {
    const presupuestoMinCrc = project.budget_min > 0
      ? Math.max(usdToCrc(project.budget_min), PRESUPUESTO_MINIMO_CRC)
      : PRESUPUESTO_MINIMO_CRC;

    const payload: Record<string, unknown> = {
      titulo: project.title.slice(0, 200),
      descripcion: buildDescripcion(project),
      tecnologias_requeridas: project.stack.join(', '),
      usar_ia: 'SI',
      plazo_dias: mapPlazoDias(project.duration_weeks),
      presupuesto_min: presupuestoMinCrc,
      id_conversacion_ia: conversacionId ?? null,
    };

    if (project.budget_max > 0) {
      payload.presupuesto_max = usdToCrc(project.budget_max);
    }

    const res = await fetch('/api/dashboard-empresario/propuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data: { success: boolean; data?: { id_propuesta: number }; message?: string } =
      await res.json();

    if (!res.ok) {
      return err(data.message ?? 'No se pudo publicar el proyecto. Intentá de nuevo.');
    }

    return ok({ id: data.data!.id_propuesta });
  } catch {
    return err('No se pudo publicar el proyecto. Intentá de nuevo.');
  }
}
