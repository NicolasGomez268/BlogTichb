export default function AdBanner({
  title = "Espacio publicitario",
  subtitle = "Tu marca aca",
  orientation = "horizontal",
}) {
  const isVertical = orientation === "vertical";

  return (
    <aside
      className={[
        "relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#0c2f59] via-[#103f77] to-[#0f2a4d]",
        isVertical ? "min-h-[320px]" : "min-h-[130px]",
      ].join(" ")}
      aria-label="Publicidad"
    >
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#E34234]/30 blur-2xl" />
      <div className="absolute -bottom-8 -right-10 h-28 w-28 rounded-full bg-white/15 blur-xl" />

      <div
        className={[
          "relative z-10 flex h-full w-full flex-col justify-between p-4",
          isVertical ? "gap-6" : "gap-2",
        ].join(" ")}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-200/90">
          Publicidad
        </p>
        <div>
          <p className={isVertical ? "text-2xl font-extrabold text-yellow-300" : "text-xl font-extrabold text-yellow-300"}>
            {title}
          </p>
          <p className="mt-1 text-sm text-zinc-100/90">{subtitle}</p>
        </div>
      </div>
    </aside>
  );
}
