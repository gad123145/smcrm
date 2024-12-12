export interface ChatMessage {
  id: string;
  content: string;
  image: string | null;
  video: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: {
    full_name: string | null;
    avatar: string | null;
  } | null;
  reactions: ChatReaction[];
  comments: ChatComment[];
}

export interface ChatReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface ChatComment {
  id: string;
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    full_name: string | null;
    avatar: string | null;
  } | null;
}