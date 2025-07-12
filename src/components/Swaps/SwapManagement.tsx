import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, Star, Send, Trash2, MessageSquare } from 'lucide-react';

interface SwapManagementProps {
  onNavigate: (page: string) => void;
}

interface SwapRequest {
  id: string;
  fromUser: string;
  toUser: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: string;
  message?: string;
  rating?: number;
  feedback?: string;
}

export const SwapManagement: React.FC<SwapManagementProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Mock swap requests data
  const mockSwapRequests: SwapRequest[] = [
    {
      id: '1',
      fromUser: 'Sarah Johnson',
      toUser: user?.name || '',
      skillOffered: 'Python',
      skillWanted: 'JavaScript',
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
      message: 'Hi! I\'d love to help you learn Python in exchange for JavaScript lessons. I\'m available weekends!'
    },
    {
      id: '2',
      fromUser: user?.name || '',
      toUser: 'Mike Chen',
      skillOffered: 'JavaScript',
      skillWanted: 'Graphic Design',
      status: 'accepted',
      createdAt: '2024-01-14T15:30:00Z',
      message: 'Looking forward to learning design principles from you!'
    },
    {
      id: '3',
      fromUser: 'Emily Rodriguez',
      toUser: user?.name || '',
      skillOffered: 'Digital Marketing',
      skillWanted: 'React',
      status: 'completed',
      createdAt: '2024-01-10T09:15:00Z',
      rating: 5,
      feedback: 'Excellent teacher! Very patient and knowledgeable.'
    },
    {
      id: '4',
      fromUser: user?.name || '',
      toUser: 'David Kim',
      skillOffered: 'Node.js',
      skillWanted: 'Photography',
      status: 'rejected',
      createdAt: '2024-01-12T14:20:00Z',
      message: 'Thanks for the interest, but I\'m not available for swaps right now.'
    }
  ];

  const incomingRequests = mockSwapRequests.filter(req => 
    req.toUser === user?.name && req.status === 'pending'
  );

  const outgoingRequests = mockSwapRequests.filter(req => 
    req.fromUser === user?.name
  );

  const activeSwaps = mockSwapRequests.filter(req => 
    (req.fromUser === user?.name || req.toUser === user?.name) && 
    req.status === 'accepted'
  );

  const completedSwaps = mockSwapRequests.filter(req => 
    (req.fromUser === user?.name || req.toUser === user?.name) && 
    req.status === 'completed'
  );

  const handleAcceptRequest = (requestId: string) => {
    toast({
      title: "Request accepted!",
      description: "The swap request has been accepted. You can now coordinate with your swap partner.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    toast({
      title: "Request rejected",
      description: "The swap request has been declined.",
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    toast({
      title: "Request deleted",
      description: "Your swap request has been deleted.",
    });
  };

  const handleCompleteSwap = (requestId: string) => {
    toast({
      title: "Swap completed!",
      description: "The skill swap has been marked as completed. Please leave a rating.",
    });
  };

  const handleSubmitFeedback = () => {
    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback. It helps improve the community.",
    });
    setSelectedRequest(null);
    setRating(5);
    setFeedback('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20">Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="text-blue-600 bg-blue-100 dark:bg-blue-900/20">Active</Badge>;
      case 'completed':
        return <Badge variant="default" className="text-green-600 bg-green-100 dark:bg-green-900/20">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Swaps</h1>
          <p className="text-muted-foreground mt-1">
            Manage your skill swap requests and activities
          </p>
        </div>
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="incoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="incoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent ({outgoingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Active ({activeSwaps.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Completed ({completedSwaps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No incoming requests</h3>
                <p className="text-sm text-muted-foreground">
                  When others request to swap skills with you, they'll appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            incomingRequests.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {request.fromUser.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{request.fromUser}</h4>
                        <p className="text-sm text-muted-foreground">
                          Wants to learn <Badge variant="outline" className="mx-1">{request.skillWanted}</Badge>
                          and offers <Badge variant="default" className="mx-1">{request.skillOffered}</Badge>
                        </p>
                        {request.message && (
                          <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{request.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-success hover:bg-success/90"
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No sent requests</h3>
                <p className="text-sm text-muted-foreground">
                  <Button onClick={() => onNavigate('browse')} variant="link" className="p-0 h-auto">
                    Browse skills
                  </Button> to find people to swap with.
                </p>
              </CardContent>
            </Card>
          ) : (
            outgoingRequests.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {request.toUser.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{request.toUser}</h4>
                        <p className="text-sm text-muted-foreground">
                          You offered <Badge variant="default" className="mx-1">{request.skillOffered}</Badge>
                          for <Badge variant="outline" className="mx-1">{request.skillWanted}</Badge>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      {request.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeSwaps.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No active swaps</h3>
                <p className="text-sm text-muted-foreground">
                  Accepted swap requests will appear here for you to coordinate.
                </p>
              </CardContent>
            </Card>
          ) : (
            activeSwaps.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {(request.fromUser === user.name ? request.toUser : request.fromUser)
                            .split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {request.fromUser === user.name ? request.toUser : request.fromUser}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Swapping <Badge variant="default" className="mx-1">{request.skillOffered}</Badge>
                          ↔ <Badge variant="outline" className="mx-1">{request.skillWanted}</Badge>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Started {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteSwap(request.id)}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSwaps.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No completed swaps</h3>
                <p className="text-sm text-muted-foreground">
                  Your completed skill swaps and feedback will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            completedSwaps.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {(request.fromUser === user.name ? request.toUser : request.fromUser)
                            .split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {request.fromUser === user.name ? request.toUser : request.fromUser}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Swapped <Badge variant="default" className="mx-1">{request.skillOffered}</Badge>
                          ↔ <Badge variant="outline" className="mx-1">{request.skillWanted}</Badge>
                        </p>
                        {request.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{request.rating}</span>
                          </div>
                        )}
                        {request.feedback && (
                          <p className="text-sm mt-2 p-2 bg-muted/50 rounded italic">
                            "{request.feedback}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Completed {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!request.rating && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedRequest(request)}>
                              Rate & Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rate Your Experience</DialogTitle>
                              <DialogDescription>
                                How was your skill swap with {request.fromUser === user.name ? request.toUser : request.fromUser}?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Rating</Label>
                                <div className="flex items-center space-x-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-6 w-6 cursor-pointer ${
                                        star <= rating 
                                          ? 'text-yellow-500 fill-yellow-500' 
                                          : 'text-gray-300'
                                      }`}
                                      onClick={() => setRating(star)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="feedback">Feedback (Optional)</Label>
                                <Textarea
                                  id="feedback"
                                  placeholder="Share your experience..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <Button onClick={handleSubmitFeedback} className="w-full">
                                Submit Review
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};