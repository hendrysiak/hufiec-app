import { ReduxProvider } from 'providers/ReduxProvider/provider';
import './global.css';
import { ApplicationsProviders } from 'providers/providers';

export default function RootLayout({
    children,
}: {
    children: React.ReactElement | React.ReactElement[];
}) {
    return (
        <html lang="pl">
            <body>
                <ReduxProvider>
                    <ApplicationsProviders>{children}</ApplicationsProviders>
                </ReduxProvider>
            </body>
        </html>
    )
}