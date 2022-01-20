import { ICode } from 'models/codes.models';
import { DecisionCode } from 'models/decision.model';
// add for ICode generation;


const codeEventDateGenerator = (code: ICode) => {
  const { startDate, endDate } = code;

  if (endDate) {
    const month = new Date(startDate).getMonth() + 1;

    const startDay = `${new Date(startDate).getDate()}.${month > 9 ? month : '0' + month}`;
    return `${startDay} - ${new Date(endDate).toLocaleDateString()}`;
  }

  return `${new Date(startDate).toLocaleDateString()}`;
};

const decisionEventDateGenerator = (decision: DecisionCode) => {
  const { eventStartDate, eventEndDate } = decision;

  if (eventEndDate) {
    const month = new Date(eventStartDate).getMonth() + 1;

    const startDay = `${new Date(eventStartDate).getDate()}.${month > 9 ? month : '0' + month}`;
    return `${startDay} - ${new Date(eventEndDate).toLocaleDateString()}`;
  }

  return `${new Date(eventStartDate).toLocaleDateString()}`;
};

export const eventDateGenerator = (object: DecisionCode | ICode): string => {

  if ('responsiblePerson' in object) {
    return codeEventDateGenerator(object);
  }

  return decisionEventDateGenerator(object);

};