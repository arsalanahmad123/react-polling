import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { PollSchemaType } from '@/schemas/poll.schema';

type Props = {
    form: ReturnType<typeof useFormContext<PollSchemaType>>;
};

const PollOptionsInput = ({ form }: Props) => {
    const [options, setOptions] = useState(['', '']);

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        form.setValue('options', newOptions);
    };

    const addOption = () => {
        if (options.length < 10) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        form.setValue('options', newOptions);
    };

    return (
        <div className="space-y-3">
            <label className="font-medium text-gray-700">Answer Options</label>
            {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    )}
                </div>
            ))}
            {options.length < 10 && (
                <Button
                    type="button"
                    onClick={addOption}
                    className="w-full"
                    variant="outline"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                </Button>
            )}
        </div>
    );
};

export default PollOptionsInput;
