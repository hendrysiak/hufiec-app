import { INGBilingDocument } from "models/ing.biling.model";
import convert, { ElementCompact, Element } from 'xml-js';
import { sortBilingFromING } from "./bank.helper";
import { IncomesBankModel } from "models/income.models";

export const getDataFromXml = async (file: File, setter: (data: IncomesBankModel[]) => void): Promise<void> => {
    const reader = new FileReader();
    const onload = () => {
      const { result } = reader;
  
      if (typeof result === 'string') {
        const convertedJson = convert.xml2js(result, { compact: true }) as Record<string, INGBilingDocument>;
        const sortedJSON = sortBilingFromING(convertedJson.Document);
        setter(sortedJSON);
      }
    };
  
    reader.onload = onload;
    reader.readAsText(file, 'windows-1250');
  };
  