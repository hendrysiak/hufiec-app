import { IncomeState } from './income.state.model';
import { UIState } from './ui.state.model';
import { UserState } from './user.state.model';

export interface RootState {
  ui: UIState;
  income: IncomeState;
  user: UserState;
}