import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supbase';
import { toast } from 'react-hot-toast';

interface PollOwnerActionsProps {
    pollId: string;
    isOwner: boolean;
}

const PollOwnerActions: React.FC<PollOwnerActionsProps> = ({ pollId, isOwner }) => {
    const navigate = useNavigate();
    const handleDelete = async () => {

        const confirm = window.confirm(
            'Are you sure you want to delete this poll?'
        );
        if (!confirm) return;
        const { error: voteDeleteError } = await supabase
            .from('votes')
            .delete()
            .eq('poll_id', pollId);

        if (voteDeleteError) {
            console.error('Vote delete error:', voteDeleteError);
            toast.error('Failed to delete votes for poll');
            return;
        } 

        const { error: pollDeleteError, data: pollDeleteData } = await supabase
            .from('polls')
            .delete()
            .eq('id', pollId);

        if (pollDeleteError) {
            console.error('Poll delete error:', pollDeleteError);
            toast.error('Failed to delete poll');
        } else {
            console.log('Poll deleted:', pollDeleteData);
            toast.success('Poll and related votes deleted');
            navigate('/polls');
        }
    };
    
    if (!isOwner) return null;

    return (
        <div className="text-center space-x-4">
            <Button
                variant="outline"
                onClick={() => navigate(`/poll/edit/${pollId}`)}
            >
                Edit Poll
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
                Delete Poll
            </Button>
        </div>
    );
};

export default PollOwnerActions;
