import React from "react";
import { Box, Button, Container, Modal, Step, StepLabel, Stepper, Typography } from "@mui/material";

import Step0 from "./Steps/Step0";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

import { IncomesBankModel } from "models/income.models";

interface BankValues {
    setBankData: (bankData: IncomesBankModel[]) => void;
    handleFinish: () => void;
    bankData: IncomesBankModel[] | null
}

const BankContextValues: BankValues = {
    setBankData: () => () => null,
    handleFinish: () => () => null,
    bankData: null
};

const BankValuesContext = React.createContext<BankValues>(BankContextValues);

export const useBankData = (): BankValues => React.useContext(BankValuesContext);

const steps = [
    'Przygotowanie',
    'Plik źródłowy',
    'Import',
    'Poprawki i wysyka',
];

const Import = () => {
    const [activeImport, setActiveImport] = React.useState(false);
    const [step, setStep] = React.useState(0);
    const [bankData, setBankData] = React.useState<IncomesBankModel[] | null>(null);

    const handleStartImport = () => setActiveImport(true);
    // const handleEndImport = () => setActiveImport(false);

    const handleNext = () => {
        setStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        setStep(0);
        setActiveImport(false);
    }

    return (
        <Container maxWidth="xl">
            <h1>
                Narzędzie do importowania przelewów
            </h1>
            <Box>
                <p>Narzędzie to przeprowadzi Cię przez proces importowania przelewów z pliku XML do aplikacji</p>
                <p>Kliknij START, żeby rozpocząć</p>
                <Button variant="contained" color="primary" onClick={() => handleStartImport()}>START</Button>
            </Box>
            <Modal
                open={activeImport}
                onClose={handleFinish}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box
                    height="92vh"
                    p={4}
                    style={{ backgroundColor: 'white' }}
                    display="flex"
                    flexDirection="column"
                    margin="50px"
                    justifyContent="space-between"
                >
                        <BankValuesContext.Provider value={{
                            setBankData,
                            bankData,
                            handleFinish
                        }}><Box>
                                {step === 0 && <Step0 />}
                                {step === 1 && <Step1 />}
                                {step === 2 && <Step2 />}
                                {step === 3 && <Step3 />}
                            </Box>
                        </BankValuesContext.Provider>
                    
                    <Box>
                    <Box pt={4} pb={4}>
                        <Stepper activeStep={step}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={step === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Wróć
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {step === steps.length - 1
                            ? <Button onClick={handleFinish}>
                                Zakończ
                            </Button>
                            : <Button onClick={handleNext}>
                                Następny
                            </Button>}
                    </Box>
                    <Box margin="0 auto" textAlign="center">
                        <Button variant="contained" color="secondary" onClick={() => handleFinish()}>Anuluj import</Button>
                    </Box>
                    </Box>
                </Box>
            </Modal>
        </Container>
    )
};

export default Import;