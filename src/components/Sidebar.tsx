import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Plus, MessageSquare, Pin } from 'lucide-react'
import { getChats, createChat } from '@/lib/chat-actions'
import { cn } from '@/lib/utils'
import { s } from 'node_modules/vite/dist/node/chunks/moduleRunnerTransport'

interface ChatItem {
    id: string
    title: string
    isPinned: boolean
    createdAt: Date
}

export function Sidebar({ activeChatId }: { activeChatId?: string }) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: chatList = [], isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: () => getChats(),
    })

    const createChatMutation = useMutation({
        mutationFn: () => createChat({ data: { title: 'New Chat' } as any }),
        onSuccess: (newChat) => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            navigate({ to: '/chat/$chatId', params: { chatId: newChat.id } })
        },
    })

    const pinnedChats = chatList.filter((c: ChatItem) => c.isPinned)
    const recentChats = chatList.filter((c: ChatItem) => !c.isPinned)

    return (
        <div className="w-72 border-r border-border/40 h-full flex flex-col bg-sidebar">
            <div className="p-4 border-b border-border/40">
                <Button
                    onClick={() => createChatMutation.mutate()}
                    className="w-full justify-start gap-2"
                    variant="default"
                    disabled={createChatMutation.isPending}
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {pinnedChats.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                                Pinned
                            </p>
                            <div className="space-y-1">
                                {pinnedChats.map((chat: ChatItem) => (
                                    <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                            Recent
                        </p>
                        <div className="space-y-1">
                            {isLoading ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
                            ) : recentChats.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">No chats yet</div>
                            ) : (
                                recentChats.map((chat: ChatItem) => (
                                    <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function ChatListItem({ chat, isActive }: { chat: ChatItem; isActive: boolean }) {
    return (
        <Link
            to="/chat/$chatId"
            params={{ chatId: chat.id }}
            className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors group',
                isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
        >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate flex-1">{chat.title}</span>
            {chat.isPinned && <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />}
        </Link>
    )
}
