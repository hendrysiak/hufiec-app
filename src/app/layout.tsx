import { ReduxProvider } from 'providers/ReduxProvider/provider';
import './global.css';
import { ApplicationsProviders } from 'providers/providers';
import SessionProvider from 'providers/SessionProvider/SessionProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactElement | React.ReactElement[];
}) {
    return (
        <html lang="pl">
            <body>
                <SessionProvider>
                    <ReduxProvider>
                        <ApplicationsProviders>{children}</ApplicationsProviders>
                    </ReduxProvider>
                </SessionProvider>
            </body>
        </html>
    )
}