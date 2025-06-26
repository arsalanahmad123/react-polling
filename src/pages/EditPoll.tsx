import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pollSchema, type PollSchemaType } from '@/schemas/poll.schema';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supbase';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Vote } from 'lucide-react';

import PollQuestionInput from '@/components/create-poll/PollQuestionInput';
import PollOptionsInput from '@/components/create-poll/PollOptionsInput';
import PollSettings from '@/components/create-poll/PollSettings';
import PollEndDatePicker from '@/components/create-poll/PollEndDatePicker';

export const EditPoll = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const form = useForm<PollSchemaType>({
        resolver: zodResolver(pollSchema),
        defaultValues: {
            question: '',
            options: [],
            allowMultiple: false,
            allowVoteChange: false,
            showResultsBeforeVoting: true,
            endsAt: null,
        },
    });

    const { reset } = form;

    useEffect(() => {
        const fetchPoll = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('polls')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('Failed to fetch poll');
            } else if (data) {
                reset({
                    question: data.question,
                    options: data.options,
                    allowMultiple: data.settings?.allowMultiple ?? false,
                    showResultsBeforeVoting:
                        data.settings?.showResultsBeforeVoting ?? true,
                    allowVoteChange: data.settings?.allowVoteChange ?? false,
                    endsAt: data.ends_at ? new Date(data.ends_at) : null,
                });
            }

            setInitialLoading(false);
        };

        fetchPoll();
    }, [id, reset]);

    const onSubmit = async (values: PollSchemaType) => {
        setError(null);
        setLoading(true);

        const { error } = await supabase
            .from('polls')
            .update({
                question: values.question,
                options: values.options,
                settings: {
                    allowMultiple: values.allowMultiple,
                    showResultsBeforeVoting: values.showResultsBeforeVoting,
                    allowVoteChange: values.allowVoteChange,
                },
                ends_at: values.endsAt?.toISOString() || null,
            })
            .eq('id', id);

        if (error) {
            setError('Failed to update poll');
        } else {
            navigate(`/poll/${id}`);
        }

        setLoading(false);
    };

    if (initialLoading) {
        return (
            <div className="text-center py-12 text-gray-500">
                Loading poll...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                        <Vote className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        Edit Poll
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Update your poll and reflect changes instantly
                    </p>
                </div>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">
                            Edit Poll Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <PollQuestionInput />
                                <PollOptionsInput form={form} />
                                <PollSettings />
                                <PollEndDatePicker />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg"
                                >
                                    {loading
                                        ? 'Updating Poll...'
                                        : 'Update Poll'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
