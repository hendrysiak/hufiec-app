import axios from 'axios';
import { INGBilingDocument } from 'pages/ImportIncome/models/ing.biling.model';
import convert, { ElementCompact, Element } from 'xml-js';

export const getJsonFromServer = async (url: string): Promise<INGBilingDocument> => {
  const result = await axios.get(url);
  // Temporary any - library type
  const convertedJson: any = convert.xml2js(result.data, { compact: true });
  return convertedJson.Document as INGBilingDocument;
};
