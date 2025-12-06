import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
    onSubmit: (message: string) => void
    isLoading: boolean
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <div className="px-4 text-sm text-destructive">
                    {field.state.meta.errors.map((error, i) => (
                        <p key={i}>{error}</p>
                    ))}
                </div>
            ) : null}
        </>
    )
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
    const form = useForm({
        defaultValues: {
            message: '',
        },
        onSubmit: async ({ value }) => {
            onSubmit(value.message)
            form.reset()
        },
    })

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            form.handleSubmit()
        }
    }

    return (
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-8">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="max-w-3xl mx-auto px-4"
            >
                <div className="relative flex flex-col gap-2">
                    <div className="flex items-end gap-3 bg-muted/60 backdrop-blur-xl rounded-3xl p-3 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                        <form.Field
                            name="message"
                            validators={{
                                onChange: ({ value }) =>
                                    !value || value.trim().length === 0
                                        ? 'Message cannot be empty'
                                        : value.length > 4000
                                            ? 'Message is too long (max 4000 characters)'
                                            : undefined,
                            }}
                        >
                            {(field) => (
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message ChatApp..."
                                    className="flex-1 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none min-h-[48px] max-h-[200px] py-3 px-4 text-sm placeholder:text-muted-foreground/60"
                                    rows={1}
                                    disabled={isLoading}
                                />
                            )}
                        </form.Field>
                        <form.Subscribe
                            selector={(state) => ({
                                canSubmit: state.canSubmit,
                                isSubmitting: state.isSubmitting,
                            })}
                        >
                            {(state) => (
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !state.canSubmit || state.isSubmitting}
                                    className="shrink-0 rounded-2xl h-12 w-12 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                    <form.Field name="message">
                        {(field) => <FieldInfo field={field} />}
                    </form.Field>
                </div>
            </form>
        </div>
    )
}
