import { IncomeState } from './income.state.model';
import { UIState } from './ui.state.model';
import { IUser } from './user.model.state';

export interface RootState {
  ui: UIState;
  income: IncomeState;
  user: IUser;
}