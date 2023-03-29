export enum ErrorType {
  EventError = 'event',
  YearError = 'year',
  NameError = 'name',
  TeamError = 'team',
}

export const ErrorTypesMap = {
  [ErrorType.EventError]: 'kodu',
  [ErrorType.YearError]: 'roku',
  [ErrorType.NameError]: 'danych',
  [ErrorType.TeamError]: 'drużyny',
};
