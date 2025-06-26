import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pollSchema, type PollSchemaType } from '@/schemas/poll.schema';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';

export const CreatePoll = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();


    const form = useForm<PollSchemaType>({
        resolver: zodResolver(pollSchema),
        defaultValues: {
            question: '',
            options: ['', ''],
            allowMultiple: false,
            allowVoteChange: false,
            showResultsBeforeVoting: true,
            endsAt: null,
        },
    });

    const onSubmit = async (values: PollSchemaType) => {
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('polls')
                .insert({
                    question: values.question,
                    options: values.options,
                    settings: {
                        allowMultiple: values.allowMultiple,
                        showResultsBeforeVoting: values.showResultsBeforeVoting,
                        allowVoteChange: values.allowVoteChange
                    },
                    created_by: user?.id,
                    ends_at: values.endsAt?.toISOString() || null,
                })
                .select()
                .single();
          

            if (error) throw new Error(error.message);
            navigate(`/poll/${data.id}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to create poll'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                        <Vote className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        Create New Poll
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Ask a question and get instant feedback from your
                        audience
                    </p>
                </div>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">
                            Poll Details
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
                                        ? 'Creating Poll...'
                                        : 'Create Poll'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
