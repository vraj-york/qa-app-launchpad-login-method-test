import { useEffect, useMemo, useState } from 'react'
import logoMark from '@/assets/logos/logo-mark.svg'
import loginArt from '@/assets/illustrations/login-art.svg'
import emptyArt from '@/assets/illustrations/empty-tasks.svg'
import allDoneArt from '@/assets/illustrations/all-done.svg'
import iconPlus from '@/assets/icons/icon-plus.svg'
import iconSearch from '@/assets/icons/icon-search.svg'
import iconTrash from '@/assets/icons/icon-trash.svg'
import iconEdit from '@/assets/icons/icon-edit.svg'
import iconLogout from '@/assets/icons/icon-logout.svg'
import iconEye from '@/assets/icons/icon-eye.svg'
import iconEyeOff from '@/assets/icons/icon-eye-off.svg'
import iconCheck from '@/assets/icons/icon-check.svg'
import iconX from '@/assets/icons/icon-x.svg'

/* ---------- types & helpers ---------- */
type Category = 'Work' | 'Personal' | 'Health' | 'Home'
type Priority = 'Low' | 'Medium' | 'High'
type Task = { id: string; title: string; category: Category; priority: Priority; due: string; done: boolean; createdAt: number }
type Session = { email: string; name: string }

const CATEGORIES: Category[] = ['Work', 'Personal', 'Health', 'Home']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']
const SESSION_KEY = 'daytick-session'

const nameFromEmail = (email: string) =>
  email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim() || 'Friend'

const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

function seedTasks(): Task[] {
  const t = todayISO()
  return [
    { id: uid(), title: 'Reply to the team update thread', category: 'Work', priority: 'High', due: t, done: false, createdAt: Date.now() - 4000 },
    { id: uid(), title: 'Book dentist appointment', category: 'Health', priority: 'Medium', due: t, done: false, createdAt: Date.now() - 3000 },
    { id: uid(), title: 'Buy groceries for the week', category: 'Home', priority: 'Low', due: '', done: false, createdAt: Date.now() - 2000 },
    { id: uid(), title: 'Water the plants', category: 'Home', priority: 'Low', due: t, done: true, createdAt: Date.now() - 1000 },
  ]
}
function dueLabel(due: string) {
  if (!due) return null
  const today = todayISO()
  if (due === today) return { text: 'Due today', cls: 'bg-ochre-light text-[#8A5A12]' }
  if (due < today) return { text: 'Overdue', cls: 'bg-[#F9E2D8] text-clay' }
  const d = new Date(due + 'T12:00:00')
  return { text: `Due ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`, cls: 'bg-moss-light text-moss-dark' }
}
const priorityStyle: Record<Priority, string> = {
  High: 'bg-[#F9E2D8] text-clay', Medium: 'bg-ochre-light text-[#8A5A12]', Low: 'bg-moss-light text-moss-dark',
}
const categoryDot: Record<Category, string> = { Work: 'bg-[#7C5CBF]', Personal: 'bg-ochre', Health: 'bg-[#2E8B8B]', Home: 'bg-moss' }

function Icon({ src, className = 'h-5 w-5' }: { src: string; className?: string }) {
  return <img src={src} alt="" aria-hidden="true" className={className} />
}

/* ---------- login ---------- */
function LoginPage({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'Enter a valid email address, e.g. you@example.com.'
    if (password.length < 6) next.password = 'Password needs at least 6 characters (any password works — this is a demo).'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    setTimeout(() => {
      const session = { email: email.trim().toLowerCase(), name: nameFromEmail(email.trim()) }
      if (remember) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      else sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      onLogin(session)
    }, 550)
  }

  const inputCls = (bad?: string) =>
    `w-full rounded-xl border bg-cream px-4 py-3 text-[15px] outline-none transition placeholder:text-mutedink/60 focus:ring-4 focus:ring-moss/15 ${bad ? 'border-clay focus:border-clay' : 'border-warmline focus:border-moss'}`

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-5 py-5">
        <img src={logoMark} alt="Daytick" className="h-9 w-9" />
        <span className="font-display text-[22px] font-bold tracking-tight">Daytick</span>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 pb-14 lg:grid-cols-2">
        {/* Art panel */}
        <section className="rise order-2 lg:order-1">
          <div className="overflow-hidden rounded-[28px] border border-warmline bg-ochre-light/50 shadow-card">
            <img src={loginArt} alt="A calm day's to-do list on a desk, with a pencil and a small plant" className="w-full" />
          </div>
          <h2 className="mt-7 font-display text-[30px] font-semibold leading-tight tracking-tight sm:text-[34px]">Today, one tick<br />at a time.</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mutedink">A calm little list for a busy day. Add what matters, tick it off, and watch the day feel lighter — no setup, no fuss.</p>
          <ul className="mt-5 space-y-2.5 text-[14px] font-medium">
            {['Your list is saved on this device', 'Filter by Work, Personal, Health or Home', 'Works with any email — no account needed'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-moss"><Icon src={iconCheck} className="h-3 w-3" /></span>{t}
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section className="rise order-1 lg:order-2">
          <div className="mx-auto w-full max-w-[440px] rounded-[24px] border border-warmline bg-cream p-7 shadow-lift sm:p-9">
            <h1 className="font-display text-[28px] font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-mutedink">Sign in to open your list. This is a demo login — use <strong className="font-semibold text-ink">any email</strong> and a password of 6+ characters.</p>

            <form onSubmit={submit} noValidate className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold">Email address</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }} className={inputCls(errors.email)} aria-invalid={!!errors.email} />
                {errors.email && <p role="alert" className="mt-1.5 text-[13px] font-medium text-clay">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold">Password</label>
                <div className="relative">
                  <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" placeholder="At least 6 characters" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }} className={`${inputCls(errors.password)} pr-12`} aria-invalid={!!errors.password} />
                  <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg hover:bg-paper focus:outline-none focus:ring-2 focus:ring-moss/40">
                    <Icon src={showPw ? iconEyeOff : iconEye} className="h-5 w-5" />
                  </button>
                </div>
                {errors.password && <p role="alert" className="mt-1.5 text-[13px] font-medium text-clay">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                    className="h-[18px] w-[18px] rounded accent-[#3E6B34]" /> Remember me
                </label>
                <span className="text-[13px] text-mutedink">Demo only — nothing is sent anywhere</span>
              </div>

              <button type="submit" disabled={busy}
                className="w-full rounded-xl bg-moss py-3.5 text-[15px] font-bold text-cream shadow-card transition hover:bg-moss-dark focus:outline-none focus:ring-4 focus:ring-moss/25 disabled:cursor-wait disabled:opacity-70">
                {busy ? 'Opening your list…' : 'Sign in to my list'}
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-paper px-4 py-3 text-[13px] leading-relaxed text-mutedink">
              <span className="font-semibold text-ink">Try it:</span> email <span className="font-semibold text-ink">alex@example.com</span>, password <span className="font-semibold text-ink">daytick</span> — or invent your own. Each email gets its own saved list.
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-warmline">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-[12.5px] text-mutedink">
          <span>Daytick — a simple to-do app. Demo login, no backend.</span><span>Your tasks never leave this browser.</span>
        </div>
      </footer>
    </div>
  )
}

/* ---------- todo app ---------- */
function TodoApp({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const storageKey = `daytick-tasks-${session.email}`
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { const raw = localStorage.getItem(storageKey); if (raw) return JSON.parse(raw) as Task[] } catch { /* ignore */ }
    return seedTasks()
  })
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Personal')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [due, setDue] = useState('')
  const [addError, setAddError] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'done'>('all')
  const [catFilter, setCatFilter] = useState<'All' | Category>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'newest' | 'due' | 'priority'>('newest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(tasks)) }, [tasks, storageKey])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2600); return () => clearTimeout(id) }, [toast])

  const doneCount = tasks.filter((t) => t.done).length
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0
  const allDone = tasks.length > 0 && doneCount === tasks.length

  const visible = useMemo(() => {
    const pRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
    const list = tasks.filter((t) =>
      (status === 'all' || (status === 'done' ? t.done : !t.done)) &&
      (catFilter === 'All' || t.category === catFilter) &&
      t.title.toLowerCase().includes(query.trim().toLowerCase()))
    return [...list].sort((a, b) =>
      sort === 'due' ? (a.due || '9999').localeCompare(b.due || '9999') :
      sort === 'priority' ? pRank[a.priority] - pRank[b.priority] || b.createdAt - a.createdAt :
      b.createdAt - a.createdAt)
  }, [tasks, status, catFilter, query, sort])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setAddError('Give your task a name first.'); return }
    setTasks((p) => [{ id: uid(), title: title.trim(), category, priority, due, done: false, createdAt: Date.now() }, ...p])
    setTitle(''); setDue(''); setAddError(''); setToast('Task added to your list.')
  }
  const toggle = (id: string) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const remove = (id: string) => { setTasks((p) => p.filter((t) => t.id !== id)); setToast('Task deleted.') }
  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, title: editTitle.trim() } : t)))
    setEditingId(null); setToast('Task updated.')
  }

  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-20 border-b border-warmline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-3.5">
          <img src={logoMark} alt="Daytick" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-[19px] font-bold tracking-tight">Daytick</p>
            <p className="text-[11.5px] text-mutedink">{dateStr}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-moss font-display text-[14px] font-bold text-cream" aria-hidden="true">{session.name.charAt(0)}</span>
              <span className="max-w-[170px] leading-tight">
                <span className="block truncate text-[13.5px] font-semibold">{session.name}</span>
                <span className="block truncate text-[11.5px] text-mutedink">{session.email}</span>
              </span>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 rounded-full border border-warmline bg-cream px-3.5 py-2 text-[13px] font-semibold transition hover:border-clay hover:text-clay focus:outline-none focus:ring-4 focus:ring-moss/15">
              <Icon src={iconLogout} className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16">
        {/* greeting + progress */}
        <section className="rise pt-8">
          <h1 className="font-display text-[32px] font-semibold tracking-tight sm:text-[36px]">Hello, {session.name.split(' ')[0]}.</h1>
          <p className="mt-1 text-[15px] text-mutedink">
            {tasks.length === 0 ? 'Your list is empty — add your first task below.' :
              allDone ? 'Everything is ticked off. Enjoy the rest of your day.' :
              `You have ${tasks.length - doneCount} thing${tasks.length - doneCount === 1 ? '' : 's'} left today. One tick at a time.`}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[{ label: 'Tasks today', value: tasks.length }, { label: 'Still to do', value: tasks.length - doneCount }, { label: 'Ticked off', value: doneCount }].map((s) => (
              <div key={s.label} className="rounded-2xl border border-warmline bg-cream px-4 py-3.5 shadow-card">
                <p className="font-display text-[26px] font-bold leading-none tabular-nums">{s.value}</p>
                <p className="mt-1.5 text-[12px] font-medium text-mutedink">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-warmline bg-cream px-4 py-3.5 shadow-card" aria-label={`Day progress: ${pct}% complete`}>
            <div className="flex items-center justify-between text-[12.5px] font-semibold"><span>Day progress</span><span className="tabular-nums text-moss-dark">{pct}%</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-warmline/70">
              <div className="h-full rounded-full bg-moss transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </section>

        {/* add task */}
        <section className="rise mt-6 rounded-[22px] border border-warmline bg-cream p-5 shadow-card">
          <h2 className="font-display text-[19px] font-semibold tracking-tight">Add a task</h2>
          <form onSubmit={addTask} className="mt-3.5">
            <div className="flex gap-2.5">
              <input value={title} onChange={(e) => { setTitle(e.target.value); setAddError('') }} placeholder="e.g. Call Mum about Sunday lunch"
                aria-label="Task name" className="min-w-0 flex-1 rounded-xl border border-warmline bg-paper px-4 py-3 text-[15px] outline-none placeholder:text-mutedink/60 focus:border-moss focus:ring-4 focus:ring-moss/15" />
              <button type="submit" className="flex shrink-0 items-center gap-1.5 rounded-xl bg-moss px-4 py-3 text-[14.5px] font-bold text-cream transition hover:bg-moss-dark focus:outline-none focus:ring-4 focus:ring-moss/25">
                <Icon src={iconPlus} className="h-[18px] w-[18px]" /> Add
              </button>
            </div>
            {addError && <p role="alert" className="mt-2 text-[13px] font-medium text-clay">{addError}</p>}
            <div className="mt-3.5 flex flex-wrap gap-2.5">
              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-mutedink">List
                <select value={category} onChange={(e) => setCategory(e.target.value as Category)} aria-label="Category"
                  className="rounded-lg border border-warmline bg-paper px-2.5 py-2 text-[13px] font-semibold text-ink outline-none focus:border-moss">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-mutedink">Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label="Priority"
                  className="rounded-lg border border-warmline bg-paper px-2.5 py-2 text-[13px] font-semibold text-ink outline-none focus:border-moss">
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-mutedink">Due
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date"
                  className="rounded-lg border border-warmline bg-paper px-2.5 py-[7px] text-[13px] font-semibold text-ink outline-none focus:border-moss" />
              </label>
              {due && <button type="button" onClick={() => setDue('')} className="self-center text-[12.5px] font-semibold text-mutedink underline underline-offset-2 hover:text-clay">Clear date</button>}
            </div>
          </form>
        </section>

        {/* filters */}
        <section className="mt-7">
          <div className="flex flex-wrap items-center gap-2">
            {([['all', 'All'], ['active', 'To do'], ['done', 'Done']] as const).map(([v, label]) => (
              <button key={v} onClick={() => setStatus(v)} aria-pressed={status === v}
                className={`rounded-full px-4 py-2 text-[13.5px] font-bold transition focus:outline-none focus:ring-4 focus:ring-moss/15 ${status === v ? 'bg-ink text-cream' : 'border border-warmline bg-cream hover:border-moss'}`}>
                {label}{v === 'all' ? ` · ${tasks.length}` : v === 'done' ? ` · ${doneCount}` : ` · ${tasks.length - doneCount}`}
              </button>
            ))}
            <div className="relative ml-auto w-full sm:w-[210px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"><Icon src={iconSearch} className="h-4 w-4" /></span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" aria-label="Search tasks"
                className="w-full rounded-full border border-warmline bg-cream py-2 pl-9 pr-8 text-[13.5px] outline-none placeholder:text-mutedink/60 focus:border-moss focus:ring-4 focus:ring-moss/15" />
              {query && <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full hover:bg-paper"><Icon src={iconX} className="h-3.5 w-3.5" /></button>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(['All', ...CATEGORIES] as const).map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} aria-pressed={catFilter === c}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition focus:outline-none focus:ring-4 focus:ring-moss/15 ${catFilter === c ? 'bg-moss text-cream' : 'bg-moss-light/60 text-moss-dark hover:bg-moss-light'}`}>{c}</button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-[12.5px] font-semibold text-mutedink">Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort tasks"
                className="rounded-lg border border-warmline bg-cream px-2 py-1.5 text-[12.5px] font-semibold text-ink outline-none focus:border-moss">
                <option value="newest">Newest first</option><option value="due">Due date</option><option value="priority">Priority</option>
              </select>
            </label>
          </div>
        </section>

        {/* list */}
        <section className="mt-4" aria-live="polite">
          {allDone && status !== 'done' && !query && catFilter === 'All' ? (
            <div className="rise rounded-[22px] border border-warmline bg-cream px-6 py-10 text-center shadow-card">
              <img src={allDoneArt} alt="A big green tick — all tasks done" className="mx-auto w-[190px]" />
              <h2 className="mt-4 font-display text-[24px] font-semibold tracking-tight">All done. Nicely ticked.</h2>
              <p className="mx-auto mt-1.5 max-w-sm text-[14px] text-mutedink">Every task on your list is complete. Add something new above, or just enjoy the quiet.</p>
              {doneCount > 0 && <button onClick={() => { setTasks((p) => p.filter((t) => !t.done)); setToast('Completed tasks cleared.') }} className="mt-5 rounded-full border border-warmline px-4 py-2 text-[13px] font-bold hover:border-clay hover:text-clay focus:outline-none focus:ring-4 focus:ring-moss/15">Clear completed</button>}
            </div>
          ) : visible.length === 0 ? (
            <div className="rise rounded-[22px] border border-dashed border-warmline bg-cream/70 px-6 py-10 text-center">
              <img src={emptyArt} alt="An empty list, ready for a first task" className="mx-auto w-[180px]" />
              <h2 className="mt-4 font-display text-[22px] font-semibold tracking-tight">
                {tasks.length === 0 ? 'Nothing here yet' : 'No tasks match that'}
              </h2>
              <p className="mx-auto mt-1.5 max-w-sm text-[14px] text-mutedink">
                {tasks.length === 0 ? 'Add your first task in the box above — something small is a great start.' : 'Try a different search or filter, or add a new task above.'}
              </p>
              {(query || catFilter !== 'All' || status !== 'all') && tasks.length > 0 && (
                <button onClick={() => { setQuery(''); setCatFilter('All'); setStatus('all') }} className="mt-4 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-cream focus:outline-none focus:ring-4 focus:ring-moss/20">Show everything</button>
              )}
            </div>
          ) : (
            <>
              <ul className="space-y-2.5">
                {visible.map((t) => {
                  const dl = dueLabel(t.due)
                  return (
                    <li key={t.id} className={`rise flex items-start gap-3 rounded-2xl border bg-cream px-4 py-3.5 shadow-card transition ${t.done ? 'border-warmline opacity-75' : 'border-warmline hover:border-moss/40'}`}>
                      <button onClick={() => toggle(t.id)} aria-label={t.done ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`} aria-pressed={t.done}
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[8px] border-2 transition focus:outline-none focus:ring-4 focus:ring-moss/20 ${t.done ? 'pop border-moss bg-moss' : 'border-[#C9B995] bg-paper hover:border-moss'}`}>
                        {t.done && <Icon src={iconCheck} className="h-3.5 w-3.5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        {editingId === t.id ? (
                          <form onSubmit={(e) => { e.preventDefault(); saveEdit(t.id) }} className="flex gap-2">
                            <input autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)} aria-label="Edit task name"
                              className="min-w-0 flex-1 rounded-lg border border-moss bg-paper px-2.5 py-1.5 text-[14.5px] outline-none focus:ring-4 focus:ring-moss/15" />
                            <button type="submit" className="rounded-lg bg-moss px-3 py-1.5 text-[13px] font-bold text-cream">Save</button>
                            <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-warmline px-3 py-1.5 text-[13px] font-bold">Cancel</button>
                          </form>
                        ) : (
                          <p className={`text-[15px] font-medium leading-snug ${t.done ? 'text-mutedink line-through' : ''}`}>{t.title}</p>
                        )}
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold">
                          <span className="flex items-center gap-1.5 rounded-full bg-paper px-2 py-0.5 text-mutedink"><span className={`h-2 w-2 rounded-full ${categoryDot[t.category]}`} />{t.category}</span>
                          <span className={`rounded-full px-2 py-0.5 ${priorityStyle[t.priority]}`}>{t.priority}</span>
                          {dl && <span className={`rounded-full px-2 py-0.5 ${dl.cls}`}>{dl.text}</span>}
                        </div>
                      </div>

                      {editingId !== t.id && (
                        <div className="flex shrink-0 gap-1">
                          <button onClick={() => { setEditingId(t.id); setEditTitle(t.title) }} aria-label={`Edit "${t.title}"`} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-paper focus:outline-none focus:ring-2 focus:ring-moss/40"><Icon src={iconEdit} className="h-[17px] w-[17px]" /></button>
                          <button onClick={() => remove(t.id)} aria-label={`Delete "${t.title}"`} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[#F9E2D8]/60 focus:outline-none focus:ring-2 focus:ring-clay/40"><Icon src={iconTrash} className="h-[17px] w-[17px]" /></button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
              {doneCount > 0 && (
                <div className="mt-4 text-right">
                  <button onClick={() => { setTasks((p) => p.filter((t) => !t.done)); setToast('Completed tasks cleared.') }} className="text-[13px] font-bold text-mutedink underline underline-offset-2 hover:text-clay focus:outline-none">Clear {doneCount} completed</button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-warmline">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-[12.5px] text-mutedink">
          <span className="flex items-center gap-2"><img src={logoMark} alt="" aria-hidden="true" className="h-5 w-5" /> Daytick — today, one tick at a time.</span>
          <span>Signed in as {session.email} · saved on this device</span>
        </div>
      </footer>

      {toast && (
        <div role="status" className="rise fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-cream shadow-lift">{toast}</div>
      )}
    </div>
  )
}

/* ---------- root ---------- */
export default function App() {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as Session) : null
    } catch { return null }
  })

  const logout = () => { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); setSession(null) }

  return session ? <TodoApp key={session.email} session={session} onLogout={logout} /> : <LoginPage onLogin={setSession} />
}
