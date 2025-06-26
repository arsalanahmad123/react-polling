import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supbase';
import { useAuth } from '@/contexts/AuthContext';

import PollHeader from '@/components/poll-details/PollHeader';
import PollVoteForm from '@/components/poll-details/PollVoteForm';
import PollResults from '@/components/poll-details/PollResults';
import PollOwnerActions from '@/components/poll-details/PollOwnerActions';
import LiveCharts from '@/components/poll-details/LiveCharts';
import { type Poll } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { getAnonId } from '@/lib/helper-functions';

interface Vote {
    selected_options: number[];
    user_id?: string;
    ip_hash?: string;
}

interface VoteResults {
    [key: number]: number;
}

export const PollDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [poll, setPoll] = useState<Poll | null>(null);
     
     
    const [, setVotes] = useState<Vote[]>([]);
    const [voteResults, setVoteResults] = useState<VoteResults>({});
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [activeViewers, setActiveViewers] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [totalVotes, setTotalVotes] = useState(0);

    const calculateResults = (voteList: Vote[]) => {
        const result: VoteResults = {};
        let total = 0;
        voteList.forEach((vote) =>
            vote.selected_options.forEach((i) => {
                result[i] = (result[i] || 0) + 1;
                total += 1;
            })
        );
        setVoteResults(result);
        setTotalVotes(total);
    };

    const isPollEnded = poll?.ends_at
        ? new Date(poll.ends_at) < new Date()
        : false;
    const isOwner = poll?.created_by === user?.id;

    // Fetch poll and vote data
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                if (!id) return;
                const { data: pollData, error: pollError } = await supabase
                    .from('polls')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (pollError) throw pollError;
                setPoll(pollData);

                const anonId = getAnonId();

                const { data: existingAnonVote } = await supabase
                    .from('votes')
                    .select('selected_options')
                    .eq('poll_id', id)
                    .eq('ip_hash', anonId)
                    .maybeSingle();


                if (user) {
                    const { data: existingVote } = await supabase
                        .from('votes')
                        .select('selected_options')
                        .eq('poll_id', id)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (existingVote) {
                        setHasVoted(true);
                        setSelectedOptions(existingVote.selected_options);
                        setShowResults(true);
                    }
                } else if (existingAnonVote) {
                    setHasVoted(true);
                    setSelectedOptions(existingAnonVote.selected_options);
                    setShowResults(true);
                }

                if (isPollEnded || pollData.settings.showResultsBeforeVoting) {
                    setShowResults(true);
                }

                const { data: votesData } = await supabase
                    .from('votes')
                    .select('*')
                    .eq('poll_id', id);

                if (votesData) {
                    setVotes(votesData);
                    calculateResults(votesData);
                }
            } catch {
                setError('Failed to load poll');
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [id, isPollEnded, user]);

    useEffect(() => {
        if (!id) return;


        const channel = supabase
            .channel(`poll-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'votes',
                    filter: `poll_id=eq.${id}`,
                },
                (payload) => {
                    const newVote = payload.new as Vote & { user_id: string };

                    setVotes((prevVotes) => {
                        const updated = prevVotes.filter(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (v: any) => {
                                if (user) {
                                    return v.user_id !== newVote.user_id;
                                } else {
                                    return v.ip_hash !== newVote.ip_hash;
                                }
                            }
                        );
                        updated.push(newVote);
                        calculateResults(updated);
                        return updated;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'votes',
                    filter: `poll_id=eq.${id}`,
                },
                async () => {
                    const { data: updatedVotes } = await supabase
                        .from('votes')
                        .select('*')
                        .eq('poll_id', id);

                    if (updatedVotes) {
                        setVotes(updatedVotes);
                        calculateResults(updatedVotes);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'votes',
                    filter: `poll_id=eq.${id}`,
                },
                (payload) => {
                    const deletedVote = payload.old as Vote;

                    setVotes((prevVotes) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const updated = prevVotes.filter((v: any) => {
                            if (user) {
                                return v.user_id !== deletedVote.user_id;
                            } else {
                                return v.ip_hash !== deletedVote.ip_hash;
                            }
                        });

                        calculateResults(updated);
                        return updated;
                    });
                }
            )
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                setActiveViewers(Object.keys(state).length);
            })
            .subscribe();

        channel.track({ user_id: user?.id || 'anon' });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, user]);

    const handleOptionSelect = (index: number) => {
        if (isPollEnded) return;

        const canEdit =
            poll?.settings.allowVoteChange && hasVoted && (user || !user); 

        const canVote = !hasVoted || canEdit;

        if (!canVote) return;
        if (poll?.settings.allowMultiple) {
            setSelectedOptions((prev) =>
                prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
        );
    } else {
        setSelectedOptions([index]);
        }
    };
      

    const handleVote = async () => {
        if (!poll || selectedOptions.length === 0 || voting) return;
        setVoting(true);

        try {
            let voteError;

            if (hasVoted && poll.settings.allowVoteChange && user) {
                const { error } = await supabase
                    .from('votes')
                    .update({ selected_options: selectedOptions })
                    .eq('poll_id', id)
                    .eq('user_id', user.id);
                voteError = error;
            } else {
                const anonId = getAnonId();

                if (hasVoted && poll.settings.allowVoteChange) {
                    const { error } = await supabase
                        .from('votes')
                        .update({ selected_options: selectedOptions })
                        .eq('poll_id', id)
                        .eq(user ? 'user_id' : 'ip_hash', user?.id || anonId);
                    voteError = error;
                } else {
                    const { error } = await supabase.from('votes').insert({
                        poll_id: id,
                        user_id: user?.id || null,
                        ip_hash: user ? null : anonId,
                        selected_options: selectedOptions,
                    });

                    voteError = error;

                    if (!user) {
                        localStorage.setItem(
                            `poll_${id}_voted`,
                            JSON.stringify(selectedOptions)
                        );
                    }
                }
            }

            if (voteError) throw voteError;

            setHasVoted(true);
            setShowResults(true);
            toast.success('Vote submitted!');
        } catch {
            toast.error('Failed to vote');
        } finally {
            setVoting(false);
        }
    };


    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied!');
        } catch {
            toast.error('Could not copy link');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
                <div className="max-w-3xl mx-auto">
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <Card>
                        <CardContent className="space-y-4 p-6">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !poll) {
        return (
            <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-white/80 shadow-lg backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">
                                    {error || 'Poll not found'}
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={() => navigate('/polls')}
                                className="mt-4"
                            >
                                Back to Polls
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-7xl mx-auto gap-6">
                <div className="text-left mb-2 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/polls')}
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                    <PollOwnerActions pollId={poll.id} isOwner={isOwner} />
                </div>
                <PollHeader
                    question={poll.question}
                    totalVotes={Object.values(voteResults).reduce(
                        (a, b) => a + b,
                        0
                    )}
                    activeViewers={activeViewers}
                    endsAt={poll.ends_at}
                    isPollEnded={isPollEnded}
                    onShare={handleShare}
                />

                <div className="grid lg:grid-cols-2 gap-5">
                    <Card className="bg-white/80 shadow-lg backdrop-blur-sm mb-6">
                        <CardContent className="space-y-6 p-6">
                            {!isOwner &&
                                (!hasVoted || poll.settings.allowVoteChange) &&
                                !isPollEnded && (
                                    <PollVoteForm
                                        options={poll.options}
                                        selectedOptions={selectedOptions}
                                        allowMultiple={
                                            poll.settings.allowMultiple
                                        }
                                        voting={voting}
                                        onVote={handleVote}
                                        onSelect={handleOptionSelect}
                                    />
                                )}

                            {showResults || isOwner && (
                                <PollResults
                                    options={poll.options}
                                    selectedOptions={selectedOptions}
                                    voteResults={voteResults}
                                    totalVotes={totalVotes}
                                />
                            )}
                        </CardContent>
                    </Card>
                    <div>
                        <LiveCharts
                            options={poll.options}
                            voteResults={voteResults}
                            selectedOptions={selectedOptions}
                            totalVotes={totalVotes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
