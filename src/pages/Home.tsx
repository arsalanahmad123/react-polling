import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BarChart3, Users } from 'lucide-react';

export const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-4xl text-center space-y-8">
                {/* Hero Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg mx-auto mb-4">
                    <Sparkles className="w-10 h-10" />
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                    Create Real-Time Polls & Get Instant Insights
                </h1>

                {/* Subheading */}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Engage your audience with live polls. Get results as they
                    happen. No sign-up required for voters. Perfect for events,
                    meetings, and classrooms.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <Button
                        variant="gradient"
                        size="lg"
                        onClick={() =>
                            navigate(user ? '/polls' : '/register')
                        }
                    >
                        {user ? (
                            <>
                                Go to Polls{' '}
                                <BarChart3 className="ml-2 w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Get Started <Users className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>

                    {!user && (
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account?
                        </Button>
                    )}
                </div>

                {/* Footer Note */}
                <p className="text-sm text-gray-400 pt-8">
                    Built with ❤️ using Supabase + React + TailwindCSS
                </p>
            </div>
        </div>
    );
};
