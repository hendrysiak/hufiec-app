export enum ActionTypes {
  FETCH_FILE = 'FETCH_FILE',
  FETCH_CODES = 'FETCH_CODES',
  FETCH_CODES_TEAMS = 'FETCH_CODES_TEAMS',
  FETCH_FILE_FAILED = 'FETCH_FILE_FAILED',
  SORT_INCOME = 'SORT_INCOME',
  EDIT_INCOME = 'EDIT_INCOME',
  SET_ACCOUNT_STATE = 'SET_ACCOUNT_STATE',
  SET_REGISTRY_STATE = 'SET_REGISTRY_STATE',
  SET_IMPORT_DATES = 'SET_IMPORT_DATES',

  EDIT_DB_INCOME = 'EDIT_DB_INCOME',
  EDIT_DB_OUTCOME = 'EDIT_DB_OUTCOME',  
  ADD_DB_INCOME = 'ADD_DB_INCOME',
  ADD_DB_OUTCOME = 'ADD_DB_OUTCOME',  
  DELETE_DB_INCOME = 'DELETE_DB_INCOME',
  DELETE_DB_OUTCOME = 'DELETE_DB_OUTCOME',  
  
  ASSIGN_INCOME_BY_CODE = 'ASSIGN_INCOME_BY_CODE',
  ASSIGN_INCOME_TO_ACCOUNT = 'ASSIGN_INCOME_TO_ACCOUNT',
  ASSIGN_OUTCOME_TO_ACCOUNT = 'ASSIGN_OUTCOME_TO_ACCOUNT',
  
  LOADING_START = 'LOADING_START',
  LOADING_END = 'LOADING_END',
  SENDING_TEAM = 'SENDING_TEAM',

  ADD_MEMBER = 'ADD_MEMBER',
  EDIT_MEMBER = 'EDIT_MEMBER',
  DELETE_MEMBER = 'DELETE_MEMBER'
}
