import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

const inter = Poppins({
	subsets: ['latin'],
	weight: [
		'100', '200', '300',
		'400', '500', '600',
		'700', '800', '900',
	],
});

export const metadata: Metadata = {
    title: 'Hierarchy UI',
    description: 'A hierarchical UI for your company that shows all the employees.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <Providers>
				    {children}
                </Providers>
			</body>
        </html>
    );
}
