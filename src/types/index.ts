export type Poll = {
    id: string;
    question: string;
    options: string[];
    settings: {
        allowMultiple: boolean;
        showResultsBeforeVoting: boolean;
        allowVoteChange: boolean; 
    };
    created_by: string;
    created_at: string;
    ends_at: string | null;
};

export type PollFilter = 'all' | 'active' | 'ended' | 'mine';



export interface Vote {
    id: string;
    poll_id: string;
    user_id: string | null;
    selected_options: number[];
    created_at: string;
}

export interface VoteResults {
    [key: number]: number;
}

export interface ChartDataPoint {
    name: string;
    value: number;
    percentage: number;
    color: string;
    isSelected: boolean;
    fullName: string
}
  