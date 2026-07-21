'use client';

import { Card, CardHeader, CardContent } from '@schoolos/ui';
import { Clock, MoreHorizontal } from 'lucide-react';

interface ChatMessage {
  text: string;
  time: string;
}

interface ChatConversation {
  id: number;
  user: string;
  school: string;
  avatar: string;
  status: 'Active' | 'Waiting' | 'Resolved';
  lastMessage: ChatMessage;
  messages: ChatMessage[];
  department: string;
}

const mockChats: ChatConversation[] = [
  {
    id: 1,
    user: 'Sarah Johnson',
    school: 'Springfield Elementary',
    avatar: 'SJ',
    status: 'Active',
    department: 'Technical Support',
    lastMessage: { text: 'I still cannot access the grade portal after trying the steps you suggested.', time: 'Just now' },
    messages: [
      { text: 'Hi, I am having trouble logging into the grade portal.', time: '2 min ago' },
      { text: 'Have you tried clearing your browser cache?', time: '1 min ago' },
      { text: 'I still cannot access the grade portal after trying the steps you suggested.', time: 'Just now' },
    ],
  },
  {
    id: 2,
    user: 'Michael Torres',
    school: 'Lincoln High School',
    avatar: 'MT',
    status: 'Active',
    department: 'Billing',
    lastMessage: { text: 'Yes, the invoice amount seems incorrect. It should be $150 less.', time: '3 min ago' },
    messages: [
      { text: 'I have a question about my recent invoice.', time: '5 min ago' },
      { text: 'Sure, can you provide the invoice number?', time: '4 min ago' },
      { text: 'Yes, the invoice amount seems incorrect. It should be $150 less.', time: '3 min ago' },
    ],
  },
  {
    id: 3,
    user: 'Emily Davis',
    school: 'Riverside Academy',
    avatar: 'ED',
    status: 'Active',
    department: 'General',
    lastMessage: { text: 'When will the new feature for attendance tracking be available?', time: '5 min ago' },
    messages: [
      { text: 'When will the new feature for attendance tracking be available?', time: '5 min ago' },
    ],
  },
  {
    id: 4,
    user: 'David Kim',
    school: 'Oakwood Preparatory',
    avatar: 'DK',
    status: 'Waiting',
    department: 'Technical Support',
    lastMessage: { text: 'I am waiting for the system to process the bulk import.', time: '12 min ago' },
    messages: [
      { text: 'I uploaded a CSV but the import seems stuck.', time: '15 min ago' },
      { text: 'I am waiting for the system to process the bulk import.', time: '12 min ago' },
    ],
  },
  {
    id: 5,
    user: 'Jessica Lee',
    school: 'Mountain View Middle',
    avatar: 'JL',
    status: 'Resolved',
    department: 'Technical Support',
    lastMessage: { text: 'Thank you for your help! The issue is resolved.', time: '25 min ago' },
    messages: [
      { text: 'My account was locked after multiple failed attempts.', time: '30 min ago' },
      { text: 'I have reset your account. Please try logging in again.', time: '27 min ago' },
      { text: 'Thank you for your help! The issue is resolved.', time: '25 min ago' },
    ],
  },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Resolved: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export default function LiveChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Live Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and manage live chat conversations</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mockChats.map((chat) => (
          <Card key={chat.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {chat.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{chat.user}</p>
                    <p className="text-xs text-muted-foreground">{chat.school}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[chat.status]}`}>
                  {chat.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">{chat.department}</p>
              <div className="flex-1 space-y-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900 min-h-[100px]">
                {chat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${idx === chat.messages.length - 1 ? 'flex-row' : 'flex-row'}`}>
                    <div className={`rounded-lg px-3 py-1.5 text-xs ${
                      idx % 2 === 0
                        ? 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {chat.lastMessage.time}
                </div>
                <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="More">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
