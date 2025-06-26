import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supbase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PollCard from '@/components/PollCard';
import { type Poll } from '@/types';
import { Sparkles,Vote } from 'lucide-react';

export const Profile = () =>  {
    const { user } = useAuth();
    const [createdPolls, setCreatedPolls] = useState<Poll[]>([]);
    const [votedPolls, setVotedPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;

            const pollsQuery = supabase
                .from('polls')
                .select('*')
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });

            const votesQuery = supabase
                .from('votes')
                .select('poll_id')
                .eq('user_id', user.id);

            const [{ data: polls }, { data: votes }] = await Promise.all([
                pollsQuery,
                votesQuery,
            ]);

            const pollIds = votes?.map((v) => v.poll_id) || [];

            let votedPollsData = [];
            if (pollIds.length) {
                const { data } = await supabase
                    .from('polls')
                    .select('*')
                    .in('id', pollIds);
                votedPollsData = data || [];
            }

            setCreatedPolls(polls || []);
            setVotedPolls(votedPollsData);
            setLoading(false);
        };

        fetchProfileData();
    }, [user]);

    if (!user) return <p>Please log in to view your profile.</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <Card className="mb-6 bg-white/80 shadow-lg backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        👤 {user.user_metadata?.name || user.email}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-1">
                    <p>📧 {user.email}</p>
                    <p>
                        📅 Joined:{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p>🗳️ Polls Created: {createdPolls.length}</p>
                    <p>✅ Polls Voted: {votedPolls.length}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="created" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                        value="created"
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Created Polls
                    </TabsTrigger>
                    <TabsTrigger
                        value="voted"
                        className="flex items-center gap-2"
                    >
                        <Vote className="w-4 h-4" />
                        Voted Polls
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="created" className="space-y-4">
                    {loading ? (
                        <Skeleton className="h-32 w-full rounded-lg" />
                    ) : createdPolls.length === 0 ? (
                        <p className="text-gray-500">
                            You haven’t created any polls yet.
                        </p>
                    ) : (
                        createdPolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="voted" className="space-y-4">
                    {loading ? (
                        <Skeleton className="h-32 w-full rounded-lg" />
                    ) : votedPolls.length === 0 ? (
                        <p className="text-gray-500">
                            You haven’t voted on any polls yet.
                        </p>
                    ) : (
                        votedPolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
