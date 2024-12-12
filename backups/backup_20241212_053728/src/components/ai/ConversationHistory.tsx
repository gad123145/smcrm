import { MessageSquare } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Conversation {
  id: string
  prompt: string
  response: string
  created_at: string
}

interface ConversationHistoryProps {
  conversations: Conversation[]
  onSelect: (prompt: string, response: string) => void
}

export function ConversationHistory({ conversations, onSelect }: ConversationHistoryProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>المحادثات السابقة</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] mt-4">
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="p-4 border rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => onSelect(conv.prompt, conv.response)}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium line-clamp-1">{conv.prompt}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {conv.response}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}