import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const PollQuestionInput = () => (
    <FormField
        name="question"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Poll Question</FormLabel>
                <FormControl>
                    <Input
                        placeholder="e.g. What’s your favorite JS framework?"
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default PollQuestionInput;
