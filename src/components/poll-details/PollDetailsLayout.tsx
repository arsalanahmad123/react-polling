import type { ReactNode } from 'react';

interface PollDetailsLayoutProps {
    children: ReactNode;
}

export default function PollDetailsLayout({
    children,
}: PollDetailsLayoutProps) {
    return (
        <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-5xl mx-auto">{children}</div>
        </div>
    );
}
