import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  Link as LinkIcon, 
  FileText,
  Slack,
  AtSign,
  Calendar
} from 'lucide-react';
import { cn } from '../ui/utils';

interface Comment {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: Date;
  source: 'internal' | 'slack' | 'teams';
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: Date;
  source: 'internal' | 'drive' | 'dropbox';
}

interface LinkedItem {
  id: string;
  title: string;
  type: 'task' | 'document' | 'jira' | 'meeting';
  status?: string;
  source: string;
  link: string;
}

interface CollaborationPanelProps {
  taskId: string;
  taskTitle: string;
}

export function CollaborationPanel({ taskId, taskTitle }: CollaborationPanelProps) {
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Emily Davis',
      authorRole: 'Supervisor',
      content: 'Please double-check the weld quality on joint J-12 before final inspection.',
      timestamp: new Date(Date.now() - 3600000),
      source: 'internal'
    },
    {
      id: '2',
      author: 'John Smith',
      authorRole: 'Employee',
      content: 'Completed initial inspection. Everything looks good except J-12 which needs minor rework.',
      timestamp: new Date(Date.now() - 1800000),
      source: 'internal'
    },
    {
      id: '3',
      author: 'Sarah Johnson (via Slack)',
      authorRole: 'QC',
      content: 'I can review the rework tomorrow morning. Will bring the updated specs.',
      timestamp: new Date(Date.now() - 900000),
      source: 'slack'
    }
  ]);

  const [attachments] = useState<Attachment[]>([
    {
      id: '1',
      name: 'weld-specifications-v2.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Emily Davis',
      uploadedAt: new Date(Date.now() - 86400000),
      source: 'internal'
    },
    {
      id: '2',
      name: 'joint-j12-photos.zip',
      type: 'ZIP',
      size: '8.1 MB',
      uploadedBy: 'John Smith',
      uploadedAt: new Date(Date.now() - 3600000),
      source: 'drive'
    }
  ]);

  const [linkedItems] = useState<LinkedItem[]>([
    {
      id: '1',
      title: 'Quality Inspection Checklist',
      type: 'document',
      source: 'Google Docs',
      link: '#'
    },
    {
      id: '2',
      title: 'WELD-452: Joint rework needed',
      type: 'jira',
      status: 'In Progress',
      source: 'Jira',
      link: '#'
    },
    {
      id: '3',
      title: 'Weekly Production Meeting',
      type: 'meeting',
      status: 'Tomorrow 10:00 AM',
      source: 'Google Calendar',
      link: '#'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'slack': return <Slack className="w-3 h-3" />;
      case 'teams': return <AtSign className="w-3 h-3" />;
      case 'drive': return <FileText className="w-3 h-3" />;
      case 'jira': return <LinkIcon className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    // Handle sending comment
    setNewComment('');
  };

  return (
    <Card className="industrial-card">
      <CardContent className="p-0">
        <Tabs defaultValue="comments" className="w-full">
          <div className="border-b px-4 pt-4">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Comments</span>
                <Badge variant="secondary" className="ml-1">
                  {comments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-1">
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline">Files</span>
                <Badge variant="secondary" className="ml-1">
                  {attachments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="linked" className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Linked</span>
                <Badge variant="secondary" className="ml-1">
                  {linkedItems.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Comments Tab */}
          <TabsContent value="comments" className="p-4 space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 animate-fade-in">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.authorRole}
                        </Badge>
                        {comment.source !== 'internal' && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getSourceIcon(comment.source)}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Comment Input */}
            <div className="space-y-2 pt-4 border-t">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach
                </Button>
                <Button size="sm" onClick={handleSendComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="p-4">
            <div className="space-y-3">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      {file.source !== 'internal' && (
                        <Badge variant="outline" className="text-xs">
                          {file.source}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.uploadedBy}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <Paperclip className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </TabsContent>

          {/* Linked Items Tab */}
          <TabsContent value="linked" className="p-4">
            <div className="space-y-3">
              {linkedItems.map((item) => {
                const getTypeIcon = () => {
                  switch (item.type) {
                    case 'document': return FileText;
                    case 'jira': return LinkIcon;
                    case 'meeting': return Calendar;
                    default: return FileText;
                  }
                };
                const Icon = getTypeIcon();

                return (
                  <a
                    key={item.id}
                    href={item.link}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.source}</span>
                        {item.status && (
                          <>
                            <span>•</span>
                            <span>{item.status}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </a>
                );
              })}

              <Button variant="outline" className="w-full">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link Item
              </Button>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <div>
                    <p className="font-medium">Task created</p>
                    <p className="text-xs text-muted-foreground">by Emily Davis • 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div>
                    <p className="font-medium">Status changed to In Progress</p>
                    <p className="text-xs text-muted-foreground">by John Smith • 1 day ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                  <div>
                    <p className="font-medium">File uploaded: joint-j12-photos.zip</p>
                    <p className="text-xs text-muted-foreground">by John Smith • 3 hours ago</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
