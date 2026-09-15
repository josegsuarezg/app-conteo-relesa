'use client'

import { useMemo, useState } from 'react'
import { Check, ClipboardList, Mail, Minus, Plus, RotateCcw, Search, Send, Truck, X } from 'lucide-react'
import productCatalog from '@/data/products.json'

const recipients = ['shosman@relesa.com.ar', 'sruiz@relesa.com.ar', 'brotondo@relesa.com.ar', 'farguero@relesa.com.ar', 'cvanina@relesa.com.ar', 'jsuarez@relesa.com.ar', 'llobo@relesa.com.ar']

const products = productCatalog.map((product) => ({ code: product.material, name: product.descripcion }))

export default function Page() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [query, setQuery] = useState('')
  const [operator, setOperator] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const filteredProducts = useMemo(() => products.filter((product) => `${product.code} ${product.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  const totalUnits = Object.values(counts).reduce((sum, count) => sum + count, 0)
  const countedItems = Object.values(counts).filter((count) => count > 0).length
  const progress = Math.round((countedItems / products.length) * 100)

  function updateCount(code: string, amount: number) {
    setCounts((current) => ({ ...current, [code]: Math.max(0, (current[code] || 0) + amount) }))
    setSent(false)
  }

  function setManualCount(code: string, value: string) {
    const parsedValue = value === '' ? 0 : Number.parseInt(value, 10)
    if (!Number.isNaN(parsedValue)) {
      setCounts((current) => ({ ...current, [code]: Math.max(0, parsedValue) }))
      setSent(false)
    }
  }

  function sendReport() {
    const lines = products.filter((product) => counts[product.code] > 0).map((product) => `${product.code} - ${product.name}: ${counts[product.code]}`)
    const body = [`CONTEO DE MERCADERÍA — RELESA`, `Operador: ${operator || 'Sin especificar'}`, `Fecha: ${new Date().toLocaleString('es-AR')}`, '', ...lines, '', `Total de unidades: ${totalUnits}`, `Ítems contados: ${countedItems}/${products.length}`, notes ? `Observaciones: ${notes}` : ''].join('\n')
    window.location.href = `mailto:${recipients.join(',')}?subject=${encodeURIComponent('Conteo de mercadería — RELESA')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f7f8fa] text-[#18202b]">
      <header className="border-b border-[#dfe4ea] bg-white">
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coca_cola_reginald_lee_sa_logo-tNoz2tcWNsPCdlzJk2VhejbqXgU472.jpg" alt="Coca-Cola Reginald Lee S.A." className="h-12 w-12 shrink-0 rounded-md object-cover sm:h-16 sm:w-16" />
            <div className="hidden h-8 w-px bg-[#dfe4ea] sm:block" />
            <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#75808d] sm:text-[10px] sm:tracking-[0.2em]">RELESA</p><p className="truncate text-xs font-semibold text-[#293442] sm:text-sm">Conteo de mercadería</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#fff1f1] px-3 py-2 text-xs font-semibold text-[#d71920]"><Truck size={15} /> Inventario</div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 pb-8 pt-5 sm:px-6 sm:pt-7 lg:pt-10">
        <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d71920]">Planilla digital</p><h1 className="text-3xl font-black tracking-tight text-[#18202b] sm:text-4xl">Contá cada unidad.</h1><p className="mt-2 max-w-xl text-sm text-[#687483]">Registrá el inventario de mercadería y enviá el resumen al equipo cuando termines.</p></div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e5e8ec] bg-white px-4 py-3 shadow-sm"><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div><div><p className="text-xs font-bold text-[#293442]">Progreso</p><p className="text-xs text-[#8993a0]">{countedItems} de {products.length} ítems</p></div></div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="stat-card"><span className="stat-icon bg-[#fff1f1] text-[#d71920]"><ClipboardList size={18}/></span><div><p className="stat-label">Productos listados</p><p className="stat-value">{products.length}</p></div></div>
          <div className="stat-card"><span className="stat-icon bg-[#fff7e8] text-[#c27a00]"><Check size={18}/></span><div><p className="stat-label">Ítems contados</p><p className="stat-value">{countedItems}</p></div></div>
          <div className="stat-card"><span className="stat-icon bg-[#eef8f2] text-[#21824c]"><Plus size={18}/></span><div><p className="stat-label">Unidades totales</p><p className="stat-value">{totalUnits}</p></div></div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <section className="rounded-2xl border border-[#e1e5ea] bg-white shadow-[0_8px_30px_rgba(24,32,43,0.04)]">
            <div className="flex flex-col gap-4 border-b border-[#edf0f3] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-[#25303d]">Listado de materiales</h2><p className="mt-1 text-xs text-[#8a94a1]">Usá + y − o escribí la cantidad directamente</p></div><div className="relative w-full sm:w-60"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba4ae]" size={16}/><input aria-label="Buscar producto" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar material..." className="h-10 w-full rounded-xl border border-[#e2e6eb] bg-[#fafbfc] pl-9 pr-8 text-sm outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"/>{query && <button onClick={() => setQuery('')} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9ba4ae]"><X size={15}/></button>}</div></div>
            <div className="divide-y divide-[#f0f2f4]">{filteredProducts.map((product) => <div key={product.code} className="flex min-w-0 items-start justify-between gap-2 px-3 py-3 transition hover:bg-[#fffafa] sm:items-center sm:gap-3 sm:px-5 sm:py-3.5"><div className="min-w-0 flex-1 pr-1"><span className="mr-2 inline-block w-9 align-top text-[11px] font-bold text-[#d71920] sm:mr-3 sm:text-xs">{product.code}</span><span className="text-[11px] font-medium leading-4 text-[#35404d] sm:text-sm sm:leading-5">{product.name}</span></div><div className="flex shrink-0 items-center gap-0.5 sm:gap-2"><button type="button" onClick={() => updateCount(product.code, -1)} aria-label={`Disminuir ${product.name}`} className="count-button"><Minus aria-hidden="true" size={14}/></button><input type="number" min="0" inputMode="numeric" aria-label={`Cantidad de ${product.name}`} value={counts[product.code] || 0} onChange={(event) => setManualCount(product.code, event.target.value)} className={`h-8 w-10 rounded-lg border border-[#e2e6eb] bg-white px-0 text-center text-xs font-bold outline-none focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10 sm:h-9 sm:w-14 sm:text-sm ${counts[product.code] ? 'text-[#d71920]' : 'text-[#aab2bb]'}`} /><button type="button" onClick={() => updateCount(product.code, 1)} aria-label={`Aumentar ${product.name}`} className="count-button count-plus"><Plus aria-hidden="true" size={14}/></button></div></div>)}</div>
            {filteredProducts.length === 0 && <div className="p-10 text-center text-sm text-[#7c8793]">No encontramos materiales con esa búsqueda.</div>}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#e1e5ea] bg-white p-5 shadow-[0_8px_30px_rgba(24,32,43,0.04)]"><h2 className="font-bold text-[#25303d]">Datos del conteo</h2><label className="mt-5 block text-xs font-bold text-[#66717e]">OPERADOR</label><input value={operator} onChange={(event) => setOperator(event.target.value)} placeholder="Nombre y apellido" className="mt-2 h-11 w-full rounded-xl border border-[#e2e6eb] px-3 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"/><label className="mt-4 block text-xs font-bold text-[#66717e]">OBSERVACIONES <span className="font-normal text-[#a5adb6]">(opcional)</span></label><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Agregá algún comentario..." rows={4} className="mt-2 w-full resize-none rounded-xl border border-[#e2e6eb] p-3 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"/><button onClick={sendReport} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d71920] text-sm font-bold text-white shadow-[0_5px_14px_rgba(215,25,32,0.22)] transition hover:bg-[#b9141a] active:scale-[0.98]"><Send size={16}/> {sent ? 'Resumen preparado' : 'Enviar resumen'}</button><p className="mt-3 text-center text-[11px] leading-4 text-[#929ba5]">Se abrirá tu aplicación de correo con el resumen y los destinatarios cargados.</p></section>
            <section className="rounded-2xl border border-[#f0d9d9] bg-[#fff7f7] p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#c51b22]">Resumen actual</p><p className="mt-1 text-2xl font-black text-[#25303d]">{totalUnits} <span className="text-sm font-medium text-[#7f8994]">unidades</span></p></div><Mail className="text-[#d71920]" size={22}/></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1dada]"><div className="h-full rounded-full bg-[#d71920] transition-all" style={{ width: `${progress}%` }}/></div></section>
            <button onClick={() => setShowReset(true)} className="flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-[#8b949e] transition hover:text-[#d71920]"><RotateCcw size={14}/> Reiniciar conteo</button>
          </aside>
        </div>
      </div>
      {showReset && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18202b]/40 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-bold">¿Reiniciar conteo?</h2><p className="mt-2 text-sm text-[#687483]">Se borrarán todas las cantidades ingresadas. Esta acción no se puede deshacer.</p><div className="mt-6 flex gap-3"><button onClick={() => setShowReset(false)} className="h-11 flex-1 rounded-xl border border-[#e1e5ea] text-sm font-bold">Cancelar</button><button onClick={() => { setCounts({}); setShowReset(false); setSent(false) }} className="h-11 flex-1 rounded-xl bg-[#d71920] text-sm font-bold text-white">Reiniciar</button></div></div></div>}
    </main>
  )
}
