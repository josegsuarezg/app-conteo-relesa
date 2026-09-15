import { Resend } from 'resend'

const recipients = [
  'shosman@relesa.com.ar',
  'sruiz@relesa.com.ar',
  'brotondo@relesa.com.ar',
  'farguero@relesa.com.ar',
  'cvanina@relesa.com.ar',
  'jsuarez@relesa.com.ar',
  'llobo@relesa.com.ar',
]

type ReportProduct = {
  code: string
  name: string
  quantity: number
}

type ReportPayload = {
  operator?: string
  notes?: string
  products?: ReportProduct[]
  totalUnits?: number
  countedItems?: number
  totalProducts?: number
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] || character)
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: 'RESEND_API_KEY no está configurada.' }, { status: 503 })
  }

  let payload: ReportPayload
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'El cuerpo de la solicitud no es válido.' }, { status: 400 })
  }

  const products = (payload.products || []).filter((product) => Number.isFinite(product.quantity) && product.quantity > 0)
  if (products.length === 0) {
    return Response.json({ error: 'Debe existir al menos un material con stock superior a 0.' }, { status: 400 })
  }

  const operator = String(payload.operator || 'Sin especificar').slice(0, 120)
  const notes = String(payload.notes || '').slice(0, 2000)
  const date = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())
  const rows = products.map((product) => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(product.code)}</td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(product.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:700">${product.quantity}</td></tr>`).join('')
  const html = `<div style="font-family:Arial,sans-serif;color:#18202b"><h1 style="color:#d71920">Conteo de mercadería — RELESA</h1><p><strong>Operador:</strong> ${escapeHtml(operator)}<br><strong>Fecha:</strong> ${date}</p><table style="border-collapse:collapse;width:100%;max-width:720px"><thead><tr style="background:#f7f8fa;text-align:left"><th style="padding:8px">Código</th><th style="padding:8px">Material</th><th style="padding:8px;text-align:right">Stock</th></tr></thead><tbody>${rows}</tbody></table><p><strong>Total de unidades:</strong> ${Number(payload.totalUnits) || 0}<br><strong>Ítems contados:</strong> ${Number(payload.countedItems) || products.length}/${Number(payload.totalProducts) || products.length}</p>${notes ? `<p><strong>Observaciones:</strong> ${escapeHtml(notes)}</p>` : ''}</div>`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: 'Playa RELESA <playa@relesa.com.ar>',
    to: recipients,
    subject: `Conteo de mercadería — RELESA — ${date}`,
    html,
  }, { idempotencyKey: `conteo-relesa/${crypto.randomUUID()}` })

  if (error) {
    return Response.json({ error: error.message }, { status: 502 })
  }

  return Response.json({ id: data?.id })
}

export const runtime = 'nodejs'
