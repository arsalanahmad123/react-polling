import { useEffect, useState, useCallback } from 'react';
import {
    Search,
    FilterIcon,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Vote,
    Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import type { Poll } from '@/types';
import { isPollActive } from '@/lib/helper-functions';
import { supabase } from '@/lib/supbase';
import { PollSkeleton } from '@/components/PollSkeleton';
import { EmptyState } from '@/components/EmptyPolls';
import { type PollFilter } from '@/types';
import { Link } from 'react-router-dom';


interface PollWithVoteCount extends Poll {
    vote_count: number;
}
  

export const PollList = () => {
    const { user } = useAuth();
    const [polls, setPolls] = useState<PollWithVoteCount[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<PollFilter>('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const POLLS_PER_PAGE = 10;

    const fetchPolls = useCallback(async () => {
        setLoading(true);

        let query = supabase
            .from('polls_with_vote_count')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (filter === 'active') {
            query = query.gte('ends_at', new Date().toISOString());
        } else if (filter === 'ended') {
            query = query.lt('ends_at', new Date().toISOString());
        } else if (filter === 'mine' && user) {
            query = query.eq('created_by', user.id);
        }

        if (debouncedSearch) {
            query = query.ilike('question', `%${debouncedSearch}%`);
        }

        query = query.range(
            (page - 1) * POLLS_PER_PAGE,
            page * POLLS_PER_PAGE - 1
        );

        const { data, error, count } = await query;

        if (!error && data) {
            setPolls(data as PollWithVoteCount[]);
            setTotalCount(count || 0);
        }
        setLoading(false);
    }, [filter, page, debouncedSearch, user]);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    console.log(polls)

    useEffect(() => {
        const channel = supabase
            .channel('realtime-polls')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'polls',
                },
                (payload) => {
                    const { eventType, new: newPoll, old: oldPoll } = payload;

                    setPolls((prev) => {
                        let updated = [...prev];

                        if (eventType === 'INSERT') {
                            updated = [
                                newPoll as PollWithVoteCount,
                                ...updated,
                            ];
                        }

                        if (eventType === 'UPDATE') {
                            updated = updated.map((p) =>
                                p.id === newPoll.id ? { ...p, ...newPoll } : p
                            );
                        }

                        if (eventType === 'DELETE') {
                            updated = updated.filter(
                                (p) => p.id !== oldPoll.id
                            );
                        }

                        return updated;
                    });

                    fetchPolls();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPolls]);

    const filterOptions = [
        { key: 'all' as PollFilter, label: 'All Polls', icon: Sparkles },
        { key: 'active' as PollFilter, label: 'Active', icon: CheckCircle },
        { key: 'ended' as PollFilter, label: 'Ended', icon: XCircle },
        { key: 'mine' as PollFilter, label: 'My Polls', icon: Users },
    ];

    const totalPages = Math.ceil(totalCount / POLLS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                        <Vote className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                        Discover Polls
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore what the community is voting on and make your
                        voice heard
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search polls by question..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <FilterIcon className="w-5 h-5 text-gray-500 mr-2" />
                            {filterOptions.map(({ key, label, icon: Icon }) => (
                                <Button
                                    key={key}
                                    variant={
                                        filter === key ? 'default' : 'outline'
                                    }
                                    onClick={() => {
                                        setFilter(key);
                                        setPage(1);
                                    }}
                                    className={`h-10 px-4 transition-all duration-200 ${
                                        filter === key
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'hover:bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 mr-1" />
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mb-6">
                        <p className="text-gray-600">
                            {totalCount === 0
                                ? ''
                                : totalCount === 1
                                ? '1 poll found'
                                : `${totalCount} polls found`}
                        </p>
                    </div>
                )}

                {/* Polls Grid */}
                <div className="space-y-4 mb-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <PollSkeleton key={i} />
                        ))
                    ) : polls.length === 0 ? (
                        <EmptyState filter={filter} />
                    ) : (
                        polls.map((poll) => {
                            const isActive = isPollActive(poll);
                            return (
                                <Card
                                    key={poll.id}
                                    className="group border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {poll.question}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    isActive
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className={`ml-4 flex-shrink-0 ${
                                                    isActive
                                                        ? 'bg-green-100 text-green-800 border-green-200'
                                                        : 'bg-red-100 text-red-800 border-red-200'
                                                }`}
                                            >
                                                {isActive ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Ended
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-4 text-gray-500">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    <span className="font-medium">
                                                        {poll.vote_count ?? 0}
                                                    </span>
                                                    <span className="ml-1">
                                                        votes
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {new Date(
                                                            poll.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/poll/${poll.id}`}
                                                className="text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                View Poll →
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {!loading && polls.length > 0 && totalPages > 1 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={page === 1}
                                className="flex items-center space-x-2 h-10 px-4 border-gray-200 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </Button>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <div className="hidden sm:flex items-center space-x-1">
                                    {Array.from(
                                        { length: Math.min(5, totalPages) },
                                        (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={
                                                        page === pageNum
                                                            ? 'default'
                                                            : 'ghost'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setPage(pageNum)
                                                    }
                                                    className={`w-8 h-8 p-0 ${
                                                        page === pageNum
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= totalPages}
                                className="flex items-center space-x-2 h-10 px-4 border-gray-200 hover:bg-gray-50"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
