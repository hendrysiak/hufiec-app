import { Box, Button, Paper, CircularProgress, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";

import { useGlobalSettings } from "helpers/hooks/useGlobalSettings";

const GlobalSettings = () => {
  const {
    globalSettings,
    isLoading,
    saveEndOfPeriodToCalcMutation,
    saveIsMaintenanceModeMutation,
  } = useGlobalSettings();

  if (isLoading) return <CircularProgress variant="determinate" />;

  return (
    <Paper elevation={3} sx={{ marginY: "16px" }}>
      <Box p={4}>
        <h2>Ustawienia globalne</h2>
        <Box pt={3.5} pb={3.5}>
          <p>
            Tutaj znajdziesz globalne ustawienia dla aplikacji - załączysz tryb
            "roboczy", ustawisz okres końcowy dla kalkulacji i wiele innych
          </p>
        </Box>
        <Box
          pt={3.5}
          pb={3.5}
          sx={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color={globalSettings?.isMaintenanceMode ? "secondary" : "primary"}
            onClick={() =>
              saveIsMaintenanceModeMutation.mutate({
                isMaintenanceMode: !globalSettings?.isMaintenanceMode,
                endOfPeriodToCalc: globalSettings?.endOfPeriodToCalc,
              })
            }
          >
            {globalSettings?.isMaintenanceMode
              ? "Wyłącz tryb roboczy"
              : "Włącz tryb roboczy"}
          </Button>
        </Box>
        <Box pt={3.5} pb={3.5}>
          <DesktopDatePicker
            className="datePicker"
            disableFuture
            label="Koniec okresu do kalkulacji"
            value={globalSettings?.endOfPeriodToCalc}
            onChange={(e) =>
              saveEndOfPeriodToCalcMutation.mutate({
                isMaintenanceMode: globalSettings?.isMaintenanceMode,
                endOfPeriodToCalc: e || undefined,
              })
            }
            renderInput={(params) => <TextField {...params} />}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              saveEndOfPeriodToCalcMutation.mutate({
                isMaintenanceMode: globalSettings?.isMaintenanceMode,
                endOfPeriodToCalc: undefined,
              })
            }
          >
            Wyczyść datę
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default GlobalSettings;
