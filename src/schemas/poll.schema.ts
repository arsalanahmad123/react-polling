import { type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const pollSchema = z.object({
    question: z.string().min(5, 'Question is required'),
    options: z
        .array(z.string().min(1, 'Option cannot be empty'))
        .min(2, 'At least two options are required')
        .max(10, 'No more than 10 options are allowed'),
    allowMultiple: z.boolean(),
    allowVoteChange: z.boolean().default(false).optional(),
    showResultsBeforeVoting: z.boolean(),
    endsAt: z.date().optional().nullable(),
});

export type PollSchemaType = z.infer<typeof pollSchema>;


export interface StepProps {
    form: UseFormReturn<PollSchemaType>;
    onNext?: () => void;
    onPrevious?: () => void;
}
  
