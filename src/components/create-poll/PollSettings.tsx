import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const PollSettings = () => (
    <div className="grid grid-cols-2 gap-4">
        <FormField
            name="allowMultiple"
            render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                        <FormLabel>Multiple Selections</FormLabel>
                        <p className="text-sm text-gray-500">
                            Allow users to select multiple answers
                        </p>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        <FormField
            name="allowVoteChange"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Allow Changing Vote</FormLabel>
                        <FormDescription>
                            Voters can modify their response after submitting
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        <FormField
            name="showResultsBeforeVoting"
            render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                        <FormLabel>Show Results Early</FormLabel>
                        <p className="text-sm text-gray-500">
                            Let users see results before voting
                        </p>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    </div>
);

export default PollSettings;
