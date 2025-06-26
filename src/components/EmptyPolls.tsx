import { type PollFilter } from '@/types';

import { Vote } from 'lucide-react';

export const EmptyState = ({ filter }: { filter: PollFilter }) => (
    <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <Vote className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'mine' ? 'No polls created yet' : 'No polls found'}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
            {filter === 'mine'
                ? 'Start creating your first poll to engage with your audience.'
                : 'Try adjusting your search or filter criteria to find more polls.'}
        </p>
    </div>
);
