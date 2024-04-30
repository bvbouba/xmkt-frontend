import { useTranslation } from "react-i18next";

export function SectionStats() {
  const { t } = useTranslation("common");
  const stats = [
    {
      label: t("Schools"),
      value: "+20",
    },
    {
      label: t("Students"),
      value: "+500",
    },
    {
      label: t("Simulations"),
      value: 3,
    },
  ];
  return (
    <section className="stats section">
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-y-6 justify-between">
          {stats.map((stat,idx) => (
            <div key={idx} className="stats__item flex-1 xl:border-r flex flex-col items-center">
              <div className="text-4xl xl:text-[64px] font-semibold text-accent-tertiary xl:mb-2">
                {stat.value}
              </div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SectionStats;
