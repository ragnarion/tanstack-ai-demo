import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, MessageSquare, FileText, X } from 'lucide-react'
import { Dialog, DialogContent } from '../ui/dialog'
import { searchChats } from '@/lib/chat-actions'

export function ChatSearchDialog() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    // Debounced search
    useEffect(() => {
        if (search.length === 0) {
            setResults([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        const timeoutId = setTimeout(() => {
            searchChats({ data: { query: search } } as any)
                .then((data) => {
                    setResults(data || [])
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error('Search error:', error)
                    setResults([])
                    setIsLoading(false)
                })
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [search])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const handleSelect = (chatId: string) => {
        setOpen(false)
        setSearch('')
        setResults([])
        navigate({ to: '/chat/$chatId', params: { chatId } })
    }

    const handleClose = () => {
        setOpen(false)
        setSearch('')
        setResults([])
    }

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted/50 rounded-lg border border-border/40 transition-colors"
            >
                <Search className="h-4 w-4" />
                <span>Search chats...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {/* Custom Search Dialog - showCloseButton={false} */}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
                    {/* Search Input with custom X */}
                    <div className="flex items-center border-b px-4 py-3">
                        <Search className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                            type="text"
                            placeholder="Search in chats and messages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-0 focus:outline-none text-sm"
                            autoFocus
                        />
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-muted rounded ml-2"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {isLoading && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}

                        {!isLoading && search.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                Start typing to search...
                            </div>
                        )}

                        {!isLoading && search.length > 0 && results.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                No results found for "{search}"
                            </div>
                        )}

                        {!isLoading && results.length > 0 && (
                            <div className="space-y-1">
                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                    {results.length} Result{results.length > 1 ? 's' : ''}
                                </div>
                                {results.map((result: any) => (
                                    <button
                                        key={result.chatId}
                                        onClick={() => handleSelect(result.chatId)}
                                        className="w-full text-left px-3 py-3 rounded-lg hover:bg-muted transition-colors flex flex-col gap-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="font-medium text-sm truncate">
                                                {result.chatTitle}
                                            </span>
                                        </div>
                                        {result.matchedContent && (
                                            <div className="flex items-start gap-2 pl-6">
                                                <FileText className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground line-clamp-2">
                                                    {result.matchedContent}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
