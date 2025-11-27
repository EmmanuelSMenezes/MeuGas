interface Reply {
  title: string;
  value: string;
  messageId?: any;
}

interface QuickReplies {
  type: "radio" | "checkbox";
  values: Reply[];
  keepIt?: boolean;
}

interface User {
  _id: string | number;
  name: string;
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

export interface Member {
  user_id: string;
  avatar: string;
  name: string;
}

export interface Message {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  chat_id?: string;
  message_id?: string;
  messageType: string;
}

export interface LastMessage {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  message_id: string;
  messageType: string;
}

export interface IChat {
  chat_id: string;
  description: string;
  created_at: Date;
  updated_at?: Date;
  created_by: string;
  members: string[];
  membersProfile: Member[];
  lastMessage: LastMessage;
  messages: Message[];
  unReadCountMessages: number;
  closed_by: string;
  closed?: Date;
  order_id?: string;
}


