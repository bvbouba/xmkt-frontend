import { ChartOptions } from "chart.js";
import { teamShapes, DEFAULT_LOCALE } from "./constants";
import {
  DimensionIdealsProps,
  DimensionScalesProps,
  SemanticIdealsProps,
  SemanticScalesProps,
  brandAwarenessProps,
  brandProps,
  channelProps,
  distributionCoverageProps,
  featureProps,
  firmProps,
  industryInfoProps,
  markertingMixProps,
  segmentProps,
  shoppingHabitProps,
} from "types";
import { colorGrades, segmentColors } from "./constants/colors";



export const formatAsMoney = (amount = 0, currency = "USD", locale = DEFAULT_LOCALE) =>
  new Intl.NumberFormat(locale, 
  ).format(amount);

  export const formatPrice = (price?: number) =>
  formatAsMoney(price || 0);

export function uppercase(string:string) {
  return string.toUpperCase();
}

export function lowercase(string:string) {
  return string.toLowerCase();
}


export function capitalize(string:string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function areAllWordsIncluded(source:string, target:string) {
  // Convert strings to lowercase and split into arrays of words
  const sourceWords = source.toLowerCase().split(/\s+/);
  const targetWords = target.toLowerCase().split(/\s+/);

  // Check if every word in sourceWords exists in targetWords
  return sourceWords.every(word => targetWords.includes(word));
}


export const getValueByPeriod = (
  data: firmProps[],
  period: number,
  field: string
) => {
  let temp = data.filter((row) => row.period_id === period);
  if (temp.length > 0) return temp[0][field];
  return null;
};
export const getValueByBrand = (
  data: brandProps[] | markertingMixProps[] | undefined,
  brand: string,
  period: number,
  field: string
) => {
  let temp = data?.filter(
    (row) => row.brand_name === brand && row.period_id === period
  );
  if (temp && temp.length > 0) return temp[0][field];
  return null;
};

export const getValueByPeriodMarket = (
  data: firmProps[] | undefined,
  period: number,
  market: number,
  field: string
) => {
  let temp = data?.filter(
    (row) => row.period_id === period && row.market_id === market
  );

  if (temp && temp.length > 0) return temp[0][field];
  return null;
};

export const getValueByTeam = (
  data: firmProps[],
  team: string,
  period: number,
  field: string
) => {
  let temp = data.filter(
    (row) => row.team_name === team && row.period_id === period
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

export const getEconomicData = (
  data: industryInfoProps[],
  period: number,
  economic_id: number,
  field: string,
  desc: string
) => {
  let temp = data.filter(
    (row2) => row2.period_id === period && row2.economic_id === economic_id
  );
  let unit = 1;

  if (desc.includes("%")) {
    unit = 100;
  }
  if (temp.length > 0) return temp[0][field] * unit;
  return null;
};

export const getValueByBrandSegment = (
  data: brandAwarenessProps[],
  brand: string,
  segment: string,
  field: string
) => {
  let temp = data.filter(
    (row) => row.brand_name === brand && row.segment_name === segment
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

export const getValueByChannelSegment = (
  data: shoppingHabitProps[],
  channel: string,
  segment: string,
  field: string
) => {
  let temp = data.filter(
    (row) => row.channel_name === channel && row.segment_name === segment
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

export const getValueByBrandChannel = (
  data: distributionCoverageProps[],
  brand: string,
  channel: string,
  field: string
) => {
  let temp = data.filter(
    (row) => row.brand_name === brand && row.channel_name === channel
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

export const getValueByBrandFeature = (
  data: SemanticScalesProps[],
  brand: string,
  feature: string,
  field: string
) => {
  let temp = data.filter(
    (row) => row.brand_name === brand && row.feature_name === feature
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

export const getValueBySegmentFeature = (
  data: SemanticIdealsProps[],
  segment: string,
  feature: string,
  field: string
) => {
  let temp = data.filter(
    (row) => row.segment_name === segment && row.feature_name === feature
  );
  if (temp.length > 0) return temp[0][field];
  return null;
};

interface dimensionProps { id: number;name: string}

interface props {
  mergedata: { [key: string]: any }[],
  xKey?: string;
  yKey?: string;
}

const getFirstLetter=(name:string)=>{
  if (name) return name[0]
  return ""
}

export const getMapData = ({mergedata,xKey,yKey}:props

) => {

  
  if(xKey === undefined || yKey === undefined) return null
  const labelColors = mergedata.map((entry) =>
    entry.segment_name
      ? segmentColors[entry.id-1]
      : colorGrades[entry.id-1][0]
  );
 
  // Calculate pairwise distances
  const distances: number[][] = [];
  for (let i = 0; i < mergedata.length; i++) {
    distances[i] = [];
    for (let j = 0; j < mergedata.length; j++) {
      if (i !== j) {
        const distance = Math.sqrt(
          Math.pow(mergedata[j][xKey] - mergedata[i][xKey], 2) +
            Math.pow(mergedata[j][yKey] - mergedata[i][yKey], 2)
        );
        distances[i][j] = distance;
      } else {
        distances[i][j] = Infinity; // Mark self-distance as infinity
      }
    }
  }

    // Identify close pairs of dots
const threshold = 0.5; // Adjust threshold as needed
const closePairs: { names: string[] }[] = [];
const visited = new Set<number>();

for (let i = 0; i < mergedata.length; i++) {
  if (visited.has(i)) {
    continue; // Skip dots that have already been included in a close pair
  }

  const closeTeamNames: string[] = [mergedata[i].name];
  visited.add(i);

  for (let j = i + 1; j < mergedata.length; j++) {
    if (!visited.has(j) && distances[i][j] < threshold) {
      if(mergedata[j].team_name){
      closeTeamNames.push(mergedata[j].name);
      visited.add(j);
      }
    }
  }

  if (closeTeamNames.length > 1) {
    closePairs.push({ names: closeTeamNames });
  }
}

  const data = {
    labels: mergedata.map((entry) =>
      entry.segment_name
        ? entry.segment_name.slice(0, 2).toUpperCase()
        : entry.name
    ),
    datasets: [
      {
        pointRadius: mergedata.map((entry) => (entry.segment_name ? 12 : 5)),
        pointStyle: mergedata.map((entry) => teamShapes[getFirstLetter(entry.team_name)]),
        borderColor: mergedata.map((entry) =>
          entry.segment_name
            ? segmentColors[entry.id-1]
            : colorGrades[entry.id-1][0]
        ),
        pointBorderWidth: mergedata.map((entry) =>
          entry.segment_name ? 2 : 0
        ),
        pointBackgroundColor: mergedata.map((entry) =>
          entry.segment_name ? "#ffffff" : colorGrades[entry.id-1][0]
        ),
        data: mergedata.map((entry) => ({
          x: entry[xKey || ""],
          y: entry[yKey || ""],
        })),
      },
    ],
  };


  return { data, labelColors,closePairs };
};

  export const getValueByBrandDimension =(data:DimensionScalesProps[],brand:string,dimension:string,field:string)=>{
    let temp = data.filter(row => row.brand_name===brand && row.dimension_name===dimension)
    if (temp.length > 0 ) return temp[0][field]
    return null
  }

export const getValueBySegmentDimension =(data:DimensionIdealsProps[],segment:string,dimension:string,field:string)=>{
  let temp = data.filter(row => row.segment_name===segment && row.dimension_name===dimension)
  if (temp.length > 0 ) return temp[0][field]
  return null
}


export const translateFeatures = (
  data: featureProps[],
  locale: string
): featureProps[] => {
  return data?.map((item) => {
    if (locale === 'fr') {
      return {
        ...item,
        name: item.name_fr,
        abbrev: item.abbrev_fr,
        unit: item.unit_fr,
      };
    }
    return item;
  });
};

export const translateGenericFunction = (
  data: segmentProps[] | channelProps[] | undefined,
  locale: string
): segmentProps[] | channelProps[] | undefined => {
  return data?.map((item) => {
    if (locale === 'fr') {
      return {
        ...item,
        name: item.name_fr,
      };
    }
    return item;
  });
};