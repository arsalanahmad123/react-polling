import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Vote } from 'lucide-react';

interface VoteFormProps {
    options: string[];
    selectedOptions: number[];
    allowMultiple: boolean;
    voting: boolean;
    onVote: () => void;
    onSelect: (index: number) => void;
}

function PollVoteForm({
    options,
    selectedOptions,
    allowMultiple,
    voting,
    onVote,
    onSelect,
}: VoteFormProps) {
    return (
        <Card className="bg-white/90 shadow-lg backdrop-blur-sm border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Vote className="w-5 h-5 text-blue-600" />
                    Cast Your Vote
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {allowMultiple ? (
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Checkbox
                                        id={`option-${index}`}
                                        checked={selectedOptions.includes(
                                            index
                                        )}
                                        onCheckedChange={() => onSelect(index)}
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                    <Label
                                        htmlFor={`option-${index}`}
                                        className="flex-1 text-base cursor-pointer"
                                    >
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <RadioGroup
                            value={selectedOptions[0]?.toString() || ''}
                            onValueChange={(value) =>
                                onSelect(Number.parseInt(value))
                            }
                            className="space-y-3"
                        >
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <RadioGroupItem
                                        value={index.toString()}
                                        id={`option-${index}`}
                                        className="border-slate-300 text-blue-600"
                                    />
                                    <Label
                                        htmlFor={`option-${index}`}
                                        className="flex-1 text-base cursor-pointer"
                                    >
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>

                <Button
                    onClick={onVote}
                    disabled={selectedOptions.length === 0 || voting}
                    variant={'gradient'}
                    size={'lg'}
                    className='w-full'
                >
                    {voting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting Vote...
                        </>
                    ) : (
                        <>
                            <Vote className="w-5 h-5 mr-2" />
                            Submit Vote
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}


export default PollVoteForm