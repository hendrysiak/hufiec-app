import { ShowModal } from '../pages/Team/helpers/typeViewModal.enum';

// export interface IViewModal {
//   open: VIEW_MODAL.finances | VIEW_MODAL.team | VIEW_MODAL.form | VIEW_MODAL.empty
// }

export type IViewModal = ShowModal.Finances | ShowModal.Team | ShowModal.Form | ShowModal.Empty;
