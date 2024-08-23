export const unit = 1000; // indicate millions

export const firmFinancialItems = [
  { label: "Revenues", id: "revenue", bold: true, sign: 1, translate: "Revenus" },
  { label: "cogs", id: "cogs", bold: false, sign: -1, translate: "Coût des ventes" },
  { label: "Inventory costs", id: "inventory_costs", bold: false, sign: -1, translate: "Coût des stocks" },
  {
    label: "Contribution before marketing",
    id: "contribution_b_m",
    bold: true,
    sign: 1,
    translate: "Contribution avant marketing",
  },
  {
    label: "Adverstising expenditure",
    id: "ads_expenses",
    bold: false,
    sign: -1,
    translate: "Dépenses publicitaires",
  },
  { label: "Commercial team costs", id: "comm_costs", bold: false, sign: -1, translate: "Coûts de l'équipe commerciale" },
  {
    label: "Contribution after marketing",
    id: "contribution_a_m",
    bold: true,
    sign: 1,
    translate: "Contribution après marketing",
  },
  {
    label: "Market research studies",
    id: "marketr_costs",
    bold: false,
    sign: -1,
    translate: "Études de marché",
  },
  {
    label: "Research and developement",
    id: "research_d",
    bold: false,
    sign: -1,
    translate: "Recherche et développement",
  },
  { label: "Interest paid", id: "interest_paid", bold: false, sign: -1, translate: "Intérêts payés" },
  {
    label: "Other Cost or Profit",
    id: "other_cost_profit",
    bold: false,
    sign: -1,
    translate: "Autre coût ou profit",
  },
  {
    label: "Earning before taxes",
    id: "net_contribution",
    bold: true,
    sign: 1,
    translate: "Bénéfice avant impôts (EBIT)",
  },
];

export const brandFinancialItems = [
  { label: "Revenues", id: "revenue", bold: true, sign: 1, translate: "Revenus" },
  { label: "cogs", id: "cogs", bold: false, sign: -1, translate: "Coût des ventes" },
  {
    label: "Inventory holding costs",
    id: "inv_holding_cost",
    bold: false,
    sign: -1,
    translate: "Coût des stocks",
  },
  {
    label: "Inventory disposal costs",
    id: "disposal_costs",
    bold: false,
    sign: -1,
    translate: "Coûts de destockage",
  },
  {
    label: "Contribution before marketing",
    id: "contribution_b_m",
    bold: true,
    sign: 1,
    translate: "Contribution avant marketing",
  },
  { label: "Adverstising expenditure", id: "ads_media", bold: false, sign: -1, translate: "Dépenses publicitaires" },
  { label: "Commercial team costs", id: "comm_costs", bold: false, sign: -1, translate: "Coûts de l'équipe commerciale" },
  {
    label: "Contribution after marketing",
    id: "contribution",
    bold: true,
    sign: 1,
    translate: "Contribution après marketing",
  },
];

export const firmFinancialChartItems = [
  { label: "REV", id: "revenue", display: false, axis: 1, percent: false, translate: "REV" },
  {
    label: "EBIT",
    id: "net_contribution",
    display: false,
    axis: 1,
    percent: false,
    translate: "EBIT",
  },
  {
    label: "Margin % Rev",
    id: "margin",
    display: true,
    axis: 2,
    percent: true,
    translate: "Marge % Rev",
  },
];

export const brandFinancialChartItems = [
  {
    label: "Production",
    id: "production_expense_of_revenue",
    display: false,
    axis: 1,
    translate: "Production",
  },
  {
    label: "Advertising and Commercial",
    id: "adcom_expense_of_revenue",
    display: false,
    axis: 1,
    translate: "Publicité et Commercial",
  },
  { label: "Other", id: "other_expense_of_revenue", display: false, axis: 1, translate: "Autre" },
];

export const productionItems = [
  { label: "Sales", id: "unit_sold", translate: "Ventes" },
  { label: "Production", id: "actual_production", translate: "Production" },
  { label: "Inventory", id: "inventory_end", translate: "Inventaire" },
];

export const inventoryItems = [
  { label: "Units Sold", id: "unit_sold", translate: "Unités vendues" },
  { label: "Production plan (your decision)", id: "production_plan", translate: "Plan de production (votre décision)" },
  { label: "Actual production", id: "actual_production", translate: "Production effective" },
  { label: "Inventory at beginning of period", id: "inventory_beg", translate: "Inventaire au début de la période" },
  { label: "Inventory at end of period", id: "inventory_end", translate: "Inventaire à la fin de la période" },
];

export const costItems = [
  { label: "Current Unit Transfer Cost", id: "current_utc", translate: "Coût unitaire - actuel" },
  { label: "Average Unit Transfer Cost", id: "average_utc", translate: "Coût unitaire - moyen" },
  { label: "Unit Sold (in Thousands)", id: "unit_sold", translate: "Unités vendues (en milliers)" },
  { label: "COGS", id: "cogs", translate: "Coût des ventes" },
  { label: "Inventory at the end of Period", id: "inventory_end", translate: "Inventaire à la fin de la période" },
  { label: "Inventory Holding Cost", id: "inv_holding_cost", translate: "Coût des stocks" },
];

export const marketingItems = [
  { label: "Adverstising", id: "ads_expenses", translate: "Publicité" },
  { label: "Commercial Team", id: "comm_costs", translate: "Équipe commerciale" },
  { label: "Studies", id: "marketr_costs", translate: "Études" },
  { label: "R & D", id: "research_d", translate: "R & D" },
];

export const adcomItems = [
  { label: "Adverstising", id: "ads_media", translate: "Publicité" },
  { label: "Commercial Team", id: "comm_costs", translate: "Équipe commerciale" },
];

export const prodAdsItems = [
  { label: "Production planning (in Units)", id: "production", translate: "Planification de la production (en unités)" },
  { label: "Recommended Retail Price (in $)", id: "price", translate: "Prix de détail recommandé (en $)" },
  { label: "Advertising Media (in k$)", id: "advertising", translate: "Médias publicitaires (en k$)" },
];

export const perceptualItems = [
  { label: "Dimension 1", id: "dimension_name_1", translate: "Dimension 1" },
  { label: "Position 1", id: "objective_1", translate: "Position 1" },
  { label: "Dimension 2", id: "dimension_name_2", translate: "Dimension 2" },
  { label: "Position 2", id: "objective_2", translate: "Position 2" },
];

export const industryFinancialItems = [
  { id: "team_name", numeric: false, label: "Firm", translate: "Entreprise" },
  { id: "stockprice", numeric: true, label: "SPI", unit: 1, translate: "SPI" },
  { id: "revenue", numeric: true, label: "REV", unit: 1000, translate: "REV" },
  { id: "net_contribution", numeric: true, label: "NC", unit: 1000, translate: "NC" },
  { id: "cum_nc", numeric: true, label: "cum_nc", unit: 1000, translate: "CN_cum" },
];

export const industryMarketShareItems = [
  { label: "% $", id: "market_share", translate: "% $" },
  { label: "% U", id: "unit_market_share", translate: "% U" },
];

export const valueMsItems = [
  { field: "brand_name", id: "brand_name", numeric: false, label: "Brand", translate: "Marque" },
  {
    field: "value_market_share",
    id: "value_market_share",
    numeric: true,
    label: "Value Share",
    percent: true,
    translate: "Part de marché",
  },
  { field: "revenue", numeric: true, id: "revenue", label: "Retail Sales", translate: "Ventes" },
  { field: "variation", numeric: true, id: "revenue", label: "Variation", translate: "Variation" },
];

export const unitMsItems = [
  { field: "brand_name", id: "brand_name", numeric: false, label: "Brand", translate: "Marque" },
  {
    field: "unit_market_share",
    id: "unit_market_share",
    numeric: true,
    label: "Unit Share",
    percent: true,
    translate: "Part de marché unitaire",
  },
  { field: "unit_sold", id: "unit_sold", numeric: true, label: "Volume", translate: "Volume" },
  { field: "variation", id: "unit_sold", numeric: true, label: "Variation", translate: "Variation" },
];

export const financialItems1 = [
  { label: "Revenue", id: "revenue", translate: "Revenu" },
  { label: "Earnings before Taxes", id: "net_contribution", translate: "Bénéfice avant impôts (EBIT)" },
];

export const financialItems2 = [
  { label: "Production", id: "cogs", translate: "Production" },
  { label: "Marketing & Sales", id: "marcom", translate: "Marketing & Ventes" },
  { label: "R & D", id: "research_d", translate: "R & D" },
];



export const teamColors: Record<string, string> = {
  L: "#f94877",
  M: "#ff5700",
  R: "#0077B5",
  S: "#09b83e",
  T: "#dd4b39",
};

export const teamShapes: Record<string, string> = {
  L: "rect",
  M: "triangle",
  R: "circle",
  S: "rectRounded",
  T: "rectRotated",
};

export const segmentColors: Record<string, string> = {
  Explorers: "#0077b5",
  Shoppers: "#df2029",
  Professionals: "#ea4c89",
  "High Earners": "#09b83e",
  Savers: "#2c3e50",
};

export const periods = [
  {
    id: "current_period",
    label: "Current Period",
    end: "current_period",
    begin: "last_period",
    translate: "Période actuelle",
  },
  {
    id: "next_period",
    label: "Next Period",
    end: "next_period",
    begin: "current_period",
    translate: "Prochaine période",
  },
  {
    id: "five_period",
    label: "Five Periods",
    end: "five_period",
    begin: "current_period",
    average: true,
    n: 5,
    translate: "5 périodes",
  },
];

export const periods1 = [
  { end: "next_period", begin: "current_period", label: "Next Period", translate: "Prochaine période" },
  { end: "five_period", begin: "current_period", label: "Total Five Periods", translate: "Total de 5 périodes" },
  {
    end: "five_period",
    begin: "current_period",
    label: "Average Five Periods",
    average: true,
    n: 5,
    translate: "Moyenne de 5 périodes",
  },
];

export const DEFAULT_LOCALE = "fr";


export function transformConstants(locale:string) {
  const isFrench = locale === DEFAULT_LOCALE;

  const transformItem = (item:any) => {
    if (isFrench && item.translate) {
      return { ...item, label: item.translate };
    }
    return item;
  };

  const transformedFirmFinancialItems = firmFinancialItems.map(transformItem);
  const transformedBrandFinancialItems = brandFinancialItems.map(transformItem);
  const transformedFirmFinancialChartItems = firmFinancialChartItems.map(transformItem);
  const transformedBrandFinancialChartItems = brandFinancialChartItems.map(transformItem);
  const transformedProductionItems = productionItems.map(transformItem);
  const transformedInventoryItems = inventoryItems.map(transformItem);
  const transformedCostItems = costItems.map(transformItem);
  const transformedMarketingItems = marketingItems.map(transformItem);
  const transformedAdcomItems = adcomItems.map(transformItem);
  const transformedProdAdsItems = prodAdsItems.map(transformItem);
  const transformedPerceptualItems = perceptualItems.map(transformItem);
  const transformedIndustryFinancialItems = industryFinancialItems.map(transformItem);
  const transformedIndustryMarketShareItems = industryMarketShareItems.map(transformItem);
  const transformedValueMsItems = valueMsItems.map(transformItem);
  const transformedUnitMsItems = unitMsItems.map(transformItem);
  const transformedFinancialItems1 = financialItems1.map(transformItem);
  const transformedFinancialItems2 = financialItems2.map(transformItem);
  const transformedPeriods = periods.map(transformItem);
  const transformedPeriods1 = periods1.map(transformItem);

  return {
    firmFinancialItems: transformedFirmFinancialItems,
    brandFinancialItems: transformedBrandFinancialItems,
    firmFinancialChartItems: transformedFirmFinancialChartItems,
    brandFinancialChartItems: transformedBrandFinancialChartItems,
    productionItems: transformedProductionItems,
    inventoryItems: transformedInventoryItems,
    costItems: transformedCostItems,
    marketingItems: transformedMarketingItems,
    adcomItems: transformedAdcomItems,
    prodAdsItems: transformedProdAdsItems,
    perceptualItems: transformedPerceptualItems,
    industryFinancialItems: transformedIndustryFinancialItems,
    industryMarketShareItems: transformedIndustryMarketShareItems,
    valueMsItems: transformedValueMsItems,
    unitMsItems: transformedUnitMsItems,
    financialItems1: transformedFinancialItems1,
    financialItems2: transformedFinancialItems2,
    periods: transformedPeriods,
    periods1: transformedPeriods1,
  };
}

export const barThickness = 40

