import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Star, ArrowRight, Plus, Eye, EyeOff } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();

  if (!user) return null;

  const toggleProfileVisibility = () => {
    updateProfile({ isPublic: !user.isPublic });
  };

  const recentActivity = [
    { type: 'swap_request', user: 'Alice Cooper', skill: 'Python', time: '2 hours ago' },
    { type: 'swap_completed', user: 'Bob Smith', skill: 'Design', time: '1 day ago' },
    { type: 'new_message', user: 'Carol Johnson', skill: 'Marketing', time: '3 days ago' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to swap some skills today?
          </p>
        </div>
        <Button
          variant="outline"
          onClick={toggleProfileVisibility}
          className="flex items-center gap-2"
        >
          {user.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Profile {user.isPublic ? 'Public' : 'Private'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Offered</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {user.skillsOffered.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Skills you can teach
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Wanted</CardTitle>
            <Plus className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {user.skillsWanted.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Skills you want to learn
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {user.rating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swaps Completed</CardTitle>
            <ArrowRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {user.swapsCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful exchanges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Your Skills</CardTitle>
            <CardDescription>
              Manage the skills you offer and want to learn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Skills You Offer:</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.length > 0 ? (
                  user.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Skills You Want:</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.length > 0 ? (
                  user.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('profile')} 
              className="w-full"
            >
              Manage Skills
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'swap_request' && 'Requested skill: '}
                    {activity.type === 'swap_completed' && 'Completed swap: '}
                    {activity.type === 'new_message' && 'Message about: '}
                    {activity.skill}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              onClick={() => onNavigate('swaps')} 
              className="w-full"
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Actions */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Get Started</CardTitle>
          <CardDescription>
            Take these steps to make the most of SkillSwap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => onNavigate('profile')} 
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 border-primary/30 hover:bg-primary/10"
            >
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Complete Profile</span>
              <span className="text-xs text-muted-foreground text-center">
                Add your skills and preferences
              </span>
            </Button>
            <Button 
              onClick={() => onNavigate('browse')} 
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 border-primary/30 hover:bg-primary/10"
            >
              <Star className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Browse Skills</span>
              <span className="text-xs text-muted-foreground text-center">
                Find people to swap skills with
              </span>
            </Button>
            <Button 
              onClick={() => onNavigate('swaps')} 
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 border-primary/30 hover:bg-primary/10"
            >
              <ArrowRight className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Start Swapping</span>
              <span className="text-xs text-muted-foreground text-center">
                Make your first skill exchange
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};