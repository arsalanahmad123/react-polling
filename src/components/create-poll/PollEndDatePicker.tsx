import { Calendar } from 'lucide-react';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const PollEndDatePicker = () => (
    <FormField
        name="endsAt"
        render={({ field }) => (
            <FormItem>
                <FormLabel className="flex gap-2 items-center">
                    <Calendar className="w-4 h-4" />
                    End Date (Optional)
                </FormLabel>
                <FormControl>
                    <Input
                        type="datetime-local"
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val ? new Date(val) : undefined);
                        }}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default PollEndDatePicker;
