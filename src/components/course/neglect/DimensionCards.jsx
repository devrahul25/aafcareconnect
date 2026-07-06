import { Utensils, Stethoscope, GraduationCap, Heart, ShieldAlert } from "lucide-react";

const DIMENSIONS = [
  { key: "physical", title: "Physical Neglect", icon: Utensils, tint: "bg-orange-50 text-orange-600 border-orange-200", bar: "border-l-orange-400",
    summary: "Lack of adequate food, clothing, warmth or safe housing.",
    indicators: ["Persistent hunger", "Inadequate clothing for the weather", "Poor hygiene or untreated infestations", "Unsafe or unsanitary home"] },
  { key: "medical", title: "Medical Neglect", icon: Stethoscope, tint: "bg-rose-50 text-rose-600 border-rose-200", bar: "border-l-rose-400",
    summary: "Health, dental and prescribed medication needs left untreated.",
    indicators: ["Repeatedly missed appointments", "Untreated illness or injury", "Withheld or uncollected medication", "Delayed immunisations"] },
  { key: "educational", title: "Educational Neglect", icon: GraduationCap, tint: "bg-blue-50 text-blue-600 border-blue-200", bar: "border-l-blue-400",
    summary: "Persistent absence, lateness or failure to access schooling.",
    indicators: ["Chronic absenteeism", "Frequent lateness", "No school place secured", "Excluded and unsupported"] },
  { key: "emotional", title: "Emotional Neglect", icon: Heart, tint: "bg-violet-50 text-violet-600 border-violet-200", bar: "border-l-violet-400",
    summary: "Absence of affection, responsiveness and emotional security.",
    indicators: ["Lack of warmth or comfort", "Distress ignored", "No stimulation or play", "Isolation from peers"] },
  { key: "supervisory", title: "Supervisory Neglect", icon: ShieldAlert, tint: "bg-amber-50 text-amber-600 border-amber-200", bar: "border-l-amber-400",
    summary: "Leaving children unsupervised in unsafe or age-inappropriate situations.",
    indicators: ["Left alone for long periods", "In charge of younger siblings", "Exposed to unsafe adults", "Out late unsupervised"] },
];

export default function DimensionCards() {
  return (
    <section>
      <h2 className="font-heading font-bold text-lg text-slate-900">The Five Dimensions of Neglect</h2>
      <p className="text-sm text-slate-500 mb-4">Neglect is rarely one act — it is a pattern of omissions across these five domains.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DIMENSIONS.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.key} className={`card border-l-4 ${d.bar} p-4 hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-lg ${d.tint} border flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-heading font-bold text-slate-900">{d.title}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">{d.summary}</p>
              <ul className="space-y-1">
                {d.indicators.map((ind) => (
                  <li key={ind} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}