import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Plus, MessageSquare, Pin } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { getChats, createChat } from '@/lib/chat-actions'
import { ChatSearchDialog } from './ChatSearchDialog'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '../ui/sidebar'

interface ChatSidebarProps {
    activeChatId?: string
}

export function ChatSidebar({ activeChatId }: ChatSidebarProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: allChats = [] } = useQuery({
        queryKey: ['chats'],
        queryFn: () => getChats(),
    })

    const createChatMutation = useMutation({
        mutationFn: () => createChat({ data: { title: 'New Chat' } } as any),
        onSuccess: (newChat) => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            navigate({ to: '/chat/$chatId', params: { chatId: newChat.id } })
        },
    })

    const pinnedChats = allChats.filter((chat) => chat.isPinned)
    const recentChats = allChats.filter((chat) => !chat.isPinned).slice(0, 10)

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="space-y-3 p-4">
                    <Button
                        onClick={() => createChatMutation.mutate()}
                        className="w-full gap-2"
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>
                    <ChatSearchDialog />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="flex-1">
                    {pinnedChats.length > 0 && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Pinned</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {pinnedChats.map((chat) => (
                                        <SidebarMenuItem key={chat.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeChatId === chat.id}
                                            >
                                                <Link to="/chat/$chatId" params={{ chatId: chat.id }}>
                                                    <Pin className="h-4 w-4" />
                                                    <span className="truncate">{chat.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                    <SidebarGroup>
                        <SidebarGroupLabel>Recent</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {recentChats.map((chat) => (
                                    <SidebarMenuItem key={chat.id}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={activeChatId === chat.id}
                                        >
                                            <Link to="/chat/$chatId" params={{ chatId: chat.id }}>
                                                <MessageSquare className="h-4 w-4" />
                                                <span className="truncate">{chat.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    )
}
