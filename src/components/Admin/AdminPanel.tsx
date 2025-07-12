import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Download,
  Send,
  UserX,
  FileText,
  BarChart3
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface PendingSkill {
  id: string;
  userId: string;
  userName: string;
  skill: string;
  description: string;
  type: 'offered' | 'wanted';
  flaggedReason?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UserReport {
  id: string;
  userName: string;
  email: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
}

interface SwapActivity {
  id: string;
  fromUser: string;
  toUser: string;
  skill: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [platformMessage, setPlatformMessage] = useState('');

  // Mock data for admin functionalities
  const pendingSkills: PendingSkill[] = [
    {
      id: '1',
      userId: '123',
      userName: 'John Doe',
      skill: 'Advanced Hacking',
      description: 'Teaching advanced penetration testing techniques',
      type: 'offered',
      flaggedReason: 'Potentially inappropriate content',
      status: 'pending'
    },
    {
      id: '2',
      userId: '124',
      userName: 'Jane Smith',
      skill: 'Social Media Marketing',
      description: 'Expert in Instagram, TikTok, and LinkedIn marketing strategies',
      type: 'offered',
      status: 'pending'
    }
  ];

  const userReports: UserReport[] = [
    {
      id: '1',
      userName: 'Mike Johnson',
      email: 'mike@example.com',
      reportedBy: 'Sarah Wilson',
      reason: 'Inappropriate behavior',
      description: 'User was rude during our video call and used inappropriate language.',
      status: 'pending',
      reportedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      userName: 'Alex Brown',
      email: 'alex@example.com',
      reportedBy: 'Emily Davis',
      reason: 'No-show',
      description: 'User agreed to a skill swap session but never showed up without notice.',
      status: 'pending',
      reportedAt: '2024-01-14T15:30:00Z'
    }
  ];

  const swapActivities: SwapActivity[] = [
    {
      id: '1',
      fromUser: 'Alice Cooper',
      toUser: 'Bob Smith',
      skill: 'JavaScript',
      status: 'completed',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      fromUser: 'Carol Johnson',
      toUser: 'David Kim',
      skill: 'Photography',
      status: 'active',
      createdAt: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      fromUser: 'Emily Rodriguez',
      toUser: 'Frank Wilson',
      skill: 'Digital Marketing',
      status: 'pending',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ];

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-sm text-muted-foreground">
              You don't have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApproveSkill = (skillId: string) => {
    toast({
      title: "Skill approved",
      description: "The skill has been approved and added to the user's profile.",
    });
  };

  const handleRejectSkill = (skillId: string) => {
    toast({
      title: "Skill rejected",
      description: "The skill has been rejected and removed from review.",
    });
  };

  const handleBanUser = (userName: string) => {
    toast({
      title: "User banned",
      description: `${userName} has been banned from the platform.`,
      variant: "destructive",
    });
  };

  const handleResolveReport = (reportId: string) => {
    toast({
      title: "Report resolved",
      description: "The user report has been marked as resolved.",
    });
  };

  const handleSendPlatformMessage = () => {
    if (!platformMessage.trim()) return;
    
    toast({
      title: "Platform message sent",
      description: "Your message has been sent to all active users.",
    });
    setPlatformMessage('');
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report generated",
      description: `${reportType} report is being downloaded.`,
    });
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
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20">Pending</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20">Active</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="secondary">Dismissed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage platform content, users, and activities
          </p>
        </div>
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingSkills.length}</div>
            <p className="text-xs text-muted-foreground">Skills awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Swaps</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {swapActivities.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{userReports.length}</div>
            <p className="text-xs text-muted-foreground">Unresolved reports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="skills">Skill Reviews</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="swaps">Swap Activity</TabsTrigger>
          <TabsTrigger value="messages">Platform Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Pending Skill Reviews</CardTitle>
              <CardDescription>
                Review and approve/reject skills submitted by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSkills.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No skills pending review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSkills.map((skill) => (
                    <div key={skill.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {skill.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{skill.userName}</h4>
                              <Badge variant={skill.type === 'offered' ? 'default' : 'outline'}>
                                {skill.type === 'offered' ? 'Offers' : 'Wants'}: {skill.skill}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                          {skill.flaggedReason && (
                            <div className="flex items-center gap-2 text-warning">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm">Flagged: {skill.flaggedReason}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveSkill(skill.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectSkill(skill.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>
                Review and resolve user reports and complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userReports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No pending reports</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userReports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-destructive text-destructive-foreground text-xs">
                                {report.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{report.userName}</h4>
                              <p className="text-sm text-muted-foreground">{report.email}</p>
                            </div>
                          </div>
                          <div className="mb-2">
                            <Badge variant="destructive">{report.reason}</Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                              by {report.reportedBy}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{report.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(report.reportedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleResolveReport(report.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            Resolve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleBanUser(report.userName)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban User
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swaps" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Swap Activity Monitor</CardTitle>
              <CardDescription>
                Monitor all skill swap activities on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swapActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.fromUser}</TableCell>
                      <TableCell>{activity.toUser}</TableCell>
                      <TableCell>{activity.skill}</TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell>{formatDate(activity.createdAt)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Platform Messages</CardTitle>
              <CardDescription>
                Send announcements and updates to all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform-message">Message</Label>
                <Textarea
                  id="platform-message"
                  placeholder="Type your platform-wide message here..."
                  value={platformMessage}
                  onChange={(e) => setPlatformMessage(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSendPlatformMessage}
                disabled={!platformMessage.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to All Users
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Download reports and view platform statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport('User Activity')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Download className="h-6 w-6 text-primary" />
                  <span>User Activity Report</span>
                  <span className="text-xs text-muted-foreground">
                    Download user engagement data
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport('Swap Statistics')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Swap Statistics</span>
                  <span className="text-xs text-muted-foreground">
                    Download swap completion rates
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport('Feedback Logs')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <FileText className="h-6 w-6 text-primary" />
                  <span>Feedback Logs</span>
                  <span className="text-xs text-muted-foreground">
                    Download user feedback data
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport('Platform Overview')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Users className="h-6 w-6 text-primary" />
                  <span>Platform Overview</span>
                  <span className="text-xs text-muted-foreground">
                    Download comprehensive report
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};