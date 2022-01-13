import { DecisionCode } from 'models/decision.model';

export const eventDateGenerator = (decision: DecisionCode): string => {
  const { eventStartDate, eventEndDate } = decision;

  if (eventEndDate) {
    const startDay = `${new Date(eventEndDate).getDate()}.${new Date(eventEndDate).getMonth()}`;
    return `${startDay} - ${new Date(eventEndDate).toLocaleDateString()}`;
  }

  return `${new Date(eventStartDate).toLocaleDateString()}`;
};