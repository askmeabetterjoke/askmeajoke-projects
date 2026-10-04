"use client";

export function ControlledMetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="studio-tool-card rounded-2xl p-4">
      <p className="studio-card-kicker">Controlled · frontend tool</p>
      <p className="studio-card-label mt-2">{label}</p>
      <p className="studio-card-value mt-1">{value}</p>
      {note ? <p className="studio-card-note mt-2">{note}</p> : null}
    </div>
  );
}
