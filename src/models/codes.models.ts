export type Event = {
  code: string;
  teams?: string[];
};
export interface ApprovedEvent extends Event {
  approvalInfo?: string;
};
