"use client"

import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";
import { AuthUserProvider, useAuth } from "./AuthUserProvider/AuthUserProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactElement, ReactNode, useEffect } from "react";
import store from "store/store";
import * as actions from 'store/actions/index';
import SnackbarProvider from "./SnackbarProvider/SnackbarProvider";
import TeamsProvider from "./TeamsProvider/TeamsProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ReactQueryDevtools } from 'react-query/devtools';
import { CircularProgress } from "@mui/material";
import { PermissionsProvider } from 'providers/PermissionsProvider/PermissionsProvider';
import NavigationContainer from "containers/NavigationContainer/NavigationContainer";

// global.window.Buffer = Buffer as unknown as Buffer;

export function ApplicationsProviders({ children }: { children: ReactElement | ReactElement[] }) {

    const loadingStatus = useSelector((state: RootState) => state.ui.loading);
    const user = useSelector((state: RootState) => state.user);
    const { authUser } = useAuth();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 30000,
            },
        },
    });

    useEffect(() => {
        // if (authUser) {
        //   downloadData();
        // }
        store.dispatch(actions.reduxLoadingEnd());

    }, [authUser?.uid]);

    return (
        <SnackbarProvider>
            <QueryClientProvider client={queryClient}>
                <AuthUserProvider>
                    <TeamsProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div className="app">
                                <PermissionsProvider>
                                    <NavigationContainer isAdmin={user?.roles?.includes('admin')}>
                                        {children}
                                    </NavigationContainer>
                                </PermissionsProvider>
                            </div>
                        </LocalizationProvider>
                    </TeamsProvider>
                </AuthUserProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </SnackbarProvider>
    );

}