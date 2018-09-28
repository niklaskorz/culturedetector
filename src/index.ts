import * as yargs from "yargs";
import * as data from "./data/6d.json";

interface Args extends yargs.Argv {
  pdi: number;
  idv: number;
  mas: number;
  uai: number;
  ltowvs: number;
}

const [pdi, idv, mas, uai, ltowvs] = yargs.argv._ as any as number[];

interface Country {
  ctr: string;
  country: string;
  pdi: number;
  idv: number;
  mas: number;
  uai: number;
  ltowvs: number;
  ivr: null;
}

const isCountry = (entry: typeof data[0]): entry is Country =>
  entry.pdi != null &&
  entry.idv != null &&
  entry.mas != null &&
  entry.uai != null &&
  entry.ltowvs != null;

const filteredData: Country[] = data.filter<Country>(isCountry);

interface CountrySum {
  country: Country;
  sum: number;
}

function calculateDifference(
  pdi: number,
  idv: number,
  mas: number,
  uai: number,
  ltowvs: number,
  ivr?: number
) {
  const sumArray = filteredData.map(country => {
    let idvDiff = Math.abs(country.idv - idv);
    let pdiDiff = Math.abs(country.pdi - pdi);
    let masDiff = Math.abs(country.mas - mas);
    let uaiDiff = Math.abs(country.uai - uai);
    let ltowvsDiff = Math.abs(country.ltowvs - ltowvs);

    let sum = idvDiff + pdiDiff + masDiff + uaiDiff + ltowvsDiff;

    return { country, sum };
  });

  sumArray.sort((a, b) => a.sum - b.sum);
  return sumArray;
}

const formatCountry = (country: Country) => `${country.country.padEnd(20)} (PDI: ${country.pdi}, IDV: ${country.idv}, MAS: ${country.mas}, UAI: ${country.uai}, LTO: ${country.ltowvs})`

const results = calculateDifference(pdi, idv, mas, uai, ltowvs).slice(0, 10);
results.forEach((result, i) => {
  console.log(`${i}: ${formatCountry(result.country)} => ${result.sum}`);
});
