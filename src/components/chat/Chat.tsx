import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import {
    addMessage,
    updateChatTitle,
    saveAssistantMessage,
    streamChatResponse,
} from '@/lib/chat-actions'
import { settingsStore } from '@/lib/store'
import { ChatInput } from './ChatInput'
import { EmptyChatState, MessageList } from './ChatMessages'
import type { Message } from '@/types'

interface ChatProps {
    chatId: string
    initialMessages?: Message[]
}

export function Chat({ chatId, initialMessages = [] }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingContent, setStreamingContent] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const { selectedProvider, selectedModel } = useStore(settingsStore, (s) => ({
        selectedProvider: s.selectedProvider,
        selectedModel: s.selectedModel,
    }))

    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages, chatId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingContent])

    const handleSubmit = async (userContent: string) => {
        if (!userContent.trim() || isStreaming) return

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: userContent,
            createdAt: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])

        await addMessage({ data: { chatId, role: 'user', content: userContent } } as any)

        if (messages.length === 0) {
            await updateChatTitle({
                data: { chatId, title: userContent.slice(0, 50) },
            } as any)
            queryClient.invalidateQueries({ queryKey: ['chats'] })
        }

        setIsStreaming(true)
        setStreamingContent('')

        try {
            const allMessages = [
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: 'user' as const, content: userContent },
            ]

            let fullContent = ''

            const stream = await streamChatResponse({
                data: {
                    chatId,
                    messages: allMessages,
                    provider: selectedProvider,
                    model: selectedModel,
                },
            } as any)

            for await (const chunk of stream) {
                if (chunk.type === 'content') {
                    fullContent = chunk.content
                    setStreamingContent(fullContent)
                }
            }

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: fullContent,
                createdAt: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])
            setStreamingContent('')

            await saveAssistantMessage({
                data: { chatId, content: fullContent },
            } as any)
        } catch (error) {
            console.error('Streaming error:', error)
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "Sorry, I couldn't process your request. Please try again.",
                createdAt: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsStreaming(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
                    {messages.length === 0 && !isStreaming ? (
                        <EmptyChatState />
                    ) : (
                        <>
                            <MessageList
                                messages={messages}
                                streamingContent={streamingContent}
                                isStreaming={isStreaming}
                            />
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

            {/* Floating input */}
            <div className="shrink-0">
                <ChatInput onSubmit={handleSubmit} isLoading={isStreaming} />
            </div>
        </div>
    )
}
