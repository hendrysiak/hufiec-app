import {
  getInitAccountState,
  getAccountState,
  getRegistry,
  getImportDates,
  getCodes,
  //   getAccountsStates,
} from "helpers/api-helpers/account.handler";

export const useInitialData = () => {
  const downloadData = async (team: number | null) => {
    try {
      await Promise.all([
        getInitAccountState(),
        getAccountState(),
        getCodes(team),
        getRegistry(),
        getImportDates(),
        // getAccountsStates(),
      ]);
    } catch (error) {
      console.error("Error downloading initial data:", error);
    }
  };

  return { downloadData };
};
