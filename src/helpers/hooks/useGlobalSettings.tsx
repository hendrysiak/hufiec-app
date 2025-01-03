import {
  getGlobalSettings,
  setGlobalSettings,
} from "helpers/editing-db.handler";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGlobalSettings = () => {
  const { data: globalSettings, isLoading } = useQuery(
    ["globalSettings"],
    getGlobalSettings
  );

  const queryClient = useQueryClient();

  const { setSnackbar } = useSnackbar();

  const saveIsMaintenanceModeMutation = useMutation(setGlobalSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries("globalSettings");
      setSnackbar({
        children: "Tryb roboczy ustawiony poprawnie",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        children: "Wystąpił błąd przy ustawianiu trybu roboczeg",
        severity: "error",
      });
    },
  });

  const saveEndOfPeriodToCalcMutation = useMutation(setGlobalSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries("globalSettings");
      setSnackbar({
        children: "Koniec okresu do kalkulacji ustawiony poprawnie",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        children: "Wystąpił błąd przy ustawianiu końca okresu do kalkulacji",
        severity: "error",
      });
    },
  });

  return {
    globalSettings: {
      isMaintenanceMode: globalSettings?.isMaintenanceMode,
      endOfPeriodToCalc: globalSettings?.endOfPeriodToCalc
        ? new Date(globalSettings?.endOfPeriodToCalc)
        : undefined,
    },
    isLoading,
    saveIsMaintenanceModeMutation,
    saveEndOfPeriodToCalcMutation,
  };
};
