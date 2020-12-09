import { IncomeState } from './income.state.model';
import { UIState } from './ui.state.model';

export interface RootState {
  ui: UIState
  income: IncomeState
}