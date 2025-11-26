interface SkeletonListProps {
  rows?: number
  hasMedia?: boolean
  variant?: 'default' | 'supply' | 'service' | 'pack' | 'supply-select' | 'comparator' | 'form' | 'form-pack' | 'login' | 'role-selection'
}

const SkeletonList = ({ rows = 3, hasMedia = false, variant = 'default' }: SkeletonListProps) => {
  if (variant === 'supply') {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-7 w-7 rounded-lg bg-slate-200" />
                <div className="h-7 w-7 rounded-lg bg-slate-200" />
              </div>
            </div>
            <div className="mb-2.5 h-3 w-full rounded bg-slate-200" />
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="h-2.5 w-12 rounded bg-slate-200 mb-1" />
                <div className="h-4 w-10 rounded bg-slate-200" />
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="h-2.5 w-12 rounded bg-slate-200 mb-1" />
                <div className="h-4 w-10 rounded bg-slate-200" />
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="h-2.5 w-12 rounded bg-slate-200 mb-1" />
                <div className="h-4 w-10 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'service') {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-2.5 w-20 rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
              </div>
              <div className="h-7 w-28 rounded-full border border-slate-200 bg-slate-100 flex-shrink-0" />
            </div>
            <div className="mb-2 h-3 w-full rounded bg-slate-200" />
            <div className="mb-1 h-3 w-2/3 rounded bg-slate-200" />
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <div>
                <div className="h-2.5 w-20 rounded bg-slate-200 mb-1" />
                <div className="h-3 w-16 rounded bg-slate-200" />
              </div>
              <div>
                <div className="h-2.5 w-12 rounded bg-slate-200 mb-1" />
                <div className="h-3 w-14 rounded bg-slate-200" />
              </div>
              <div>
                <div className="h-2.5 w-14 rounded bg-slate-200 mb-1" />
                <div className="h-3 w-16 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'pack') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-5 w-2/3 rounded bg-slate-200" />
              </div>
              <div className="text-right space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-200 ml-auto" />
                <div className="h-6 w-24 rounded bg-slate-200 ml-auto" />
                <div className="h-3 w-16 rounded bg-slate-200 ml-auto" />
              </div>
            </div>
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'supply-select') {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-slate-200" />
                <div className="h-2.5 w-24 rounded bg-slate-200" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <div className="h-2.5 w-12 rounded bg-slate-200" />
                  <div className="h-6 w-6 rounded-lg bg-slate-200" />
                  <div className="h-6 w-12 rounded-lg bg-slate-200" />
                  <div className="h-6 w-6 rounded-lg bg-slate-200" />
                </div>
                <div className="h-7 w-7 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'comparator') {
    return (
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-card">
        {/* Header skeleton */}
        <div className="mb-4 sm:mb-6 space-y-2">
          <div className="h-3 w-40 rounded bg-slate-200" />
          <div className="h-6 sm:h-8 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>

        {/* Vista Desktop: Tabla skeleton */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100">
          <div className="animate-pulse">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100">
              <div className="grid grid-cols-6 gap-4">
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-200 ml-auto" />
              </div>
            </div>
            {Array.from({ length: rows || 3 }).map((_, index) => (
              <div key={index} className="border-b border-slate-100 px-5 py-5">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-32 rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-20 rounded bg-slate-200" />
                  <div className="h-6 w-16 rounded-full bg-slate-200" />
                  <div className="h-4 w-12 rounded bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-9 w-32 rounded-full bg-slate-200 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vista Mobile: Cards skeleton */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: rows || 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 space-y-1.5">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                  <div className="h-2.5 w-16 rounded bg-slate-200" />
                  <div className="h-5 w-20 rounded bg-slate-200" />
                </div>
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                  <div className="h-2.5 w-12 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded bg-slate-200" />
                </div>
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                  <div className="h-2.5 w-14 rounded bg-slate-200" />
                  <div className="h-5 w-12 rounded bg-slate-200" />
                </div>
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                  <div className="h-2.5 w-16 rounded bg-slate-200" />
                  <div className="h-5 w-20 rounded bg-slate-200" />
                </div>
              </div>
              <div className="mb-3 h-9 w-full rounded-xl border border-slate-200 bg-white" />
              <div className="h-10 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (variant === 'form') {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="mb-4 space-y-2">
          <div className="h-2.5 w-32 rounded bg-slate-200" />
          <div className="h-5 w-40 rounded bg-slate-200" />
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-9 w-full rounded-xl bg-slate-200" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-9 w-full rounded-xl bg-slate-200" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-20 w-full rounded-xl bg-slate-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <div className="h-9 w-24 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'form-pack') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mb-4 space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-48 rounded bg-slate-200" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-20 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="grid gap-2">
              <div className="h-16 w-full rounded-xl bg-slate-200" />
              <div className="h-16 w-full rounded-xl bg-slate-200" />
            </div>
            <div className="h-9 w-full rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mb-3 space-y-2">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-56 rounded bg-slate-200" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200" />
                    <div className="h-2.5 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-lg bg-slate-200" />
                    <div className="h-6 w-12 rounded-lg bg-slate-200" />
                    <div className="h-6 w-6 rounded-lg bg-slate-200" />
                    <div className="h-7 w-7 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'login') {
    return (
      <section className="mx-auto w-full max-w-md animate-pulse rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-8 shadow-card">
        <header className="mb-6 sm:mb-8 text-center">
          <div className="h-3 w-32 rounded bg-slate-200 mx-auto" />
          <div className="mt-2 h-8 w-48 rounded bg-slate-200 mx-auto" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-200 mx-auto" />
        </header>
        <div className="space-y-5">
          <div>
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-12 w-full rounded-2xl bg-slate-200" />
          </div>
          <div>
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="mt-2 h-12 w-full rounded-2xl bg-slate-200" />
          </div>
          <div>
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-2 h-12 w-full rounded-2xl bg-slate-200" />
          </div>
          <div className="h-12 w-full rounded-full bg-slate-200" />
        </div>
      </section>
    )
  }

  if (variant === 'role-selection') {
    return (
      <div className="role-selection">
        <div className="role-selection__shell">
          <div className="role-selection__back animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
          </div>
          <div className="role-selection__mark animate-pulse">
            <div className="h-12 w-12 rounded-full bg-slate-200 mx-auto" />
          </div>
          <div className="role-selection__heading animate-pulse">
            <div className="h-8 w-80 rounded bg-slate-200 mx-auto" />
            <div className="mt-2 h-5 w-64 rounded bg-slate-200 mx-auto" />
          </div>
          <div className="role-selection__grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="role-card animate-pulse">
                <div className="role-card__icon">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                </div>
                <div className="h-6 w-32 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Variante default (para DemandaList y otros)
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 rounded bg-slate-200" />
              <div className="h-5 w-3/4 rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200 flex-shrink-0" />
          </div>
          <div className="mt-2 h-4 w-full rounded bg-slate-200" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <div className="h-3 w-20 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
            <div>
              <div className="h-3 w-12 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-14 rounded bg-slate-200" />
            </div>
            <div>
              <div className="h-3 w-20 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Variante default (para DemandaList y otros)
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            {hasMedia && <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-xl bg-slate-200" />}
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="h-5 w-3/4 rounded bg-slate-200" />
              </div>
              <div className="h-4 w-full rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200 flex-shrink-0" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <div className="h-3 w-20 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
            <div>
              <div className="h-3 w-12 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-14 rounded bg-slate-200" />
            </div>
            <div>
              <div className="h-3 w-20 rounded bg-slate-200 mb-1" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonList
