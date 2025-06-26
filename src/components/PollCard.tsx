import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { isPollActive } from '@/lib/helper-functions';

export default function PollCard({ poll }) {
    const active = isPollActive(poll);

    return (
        <Card className="bg-white/90 shadow border border-gray-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-800">
                    {poll.question}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center text-sm text-gray-600">
                <p>Status: {active ? 'Active' : 'Ended'}</p>
                <Link
                    to={`/poll/${poll.id}`}
                    className="text-blue-600 hover:underline"
                >
                    View Poll →
                </Link>
            </CardContent>
        </Card>
    );
}
