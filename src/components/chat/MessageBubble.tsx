import type { Message } from '@/types'

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user'

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="rounded-2xl px-4 py-3 max-w-[80%] text-sm bg-primary text-primary-foreground">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
            </div>
        )
    }

    // Assistant message - plain text, no bubble
    return (
        <div className="max-w-[85%]">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
    )
}

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 py-2">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
        </div>
    )
}

export function StreamingMessage({ content }: { content: string }) {
    return (
        <div className="max-w-[85%]">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {content}
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/70 animate-pulse" />
            </p>
        </div>
    )
}
