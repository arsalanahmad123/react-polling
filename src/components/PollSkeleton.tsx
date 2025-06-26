import { Card, CardContent, CardHeader } from "./ui/card";

// Loading skeleton component
export const PollSkeleton = () => (
    <Card className="border border-gray-200 animate-pulse">
        <CardHeader className="pb-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </CardContent>
    </Card>
);
