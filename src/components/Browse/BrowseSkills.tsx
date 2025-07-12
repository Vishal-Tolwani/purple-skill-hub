import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Search, Star, MapPin, Clock, Send } from 'lucide-react';

interface BrowseSkillsProps {
  onNavigate: (page: string) => void;
}

interface UserProfile {
  id: string;
  name: string;
  location: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
  swapsCompleted: number;
  profilePhoto?: string;
}

export const BrowseSkills: React.FC<BrowseSkillsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Mock data for other users
  const mockUsers: UserProfile[] = [
    {
      id: '2',
      name: 'Krishna Patel',
      location: 'Bangalore, India',
      skillsOffered: ['Python', 'Machine Learning', 'Data Science'],
      skillsWanted: ['JavaScript', 'React', 'UI/UX Design'],
      availability: ['weekends', 'evenings'],
      rating: 4.9,
      swapsCompleted: 23,
      profilePhoto: undefined
    },
    {
      id: '3',
      name: 'Ragini Sharma',
      location: 'Delhi, India',
      skillsOffered: ['Graphic Design', 'Adobe Creative Suite', 'Branding'],
      skillsWanted: ['Web Development', 'SEO', 'Marketing'],
      availability: ['flexible'],
      rating: 4.7,
      swapsCompleted: 18
    },
    {
      id: '4',
      name: 'Arpita Singh',
      location: 'Pune, India',
      skillsOffered: ['Digital Marketing', 'Content Writing', 'Social Media'],
      skillsWanted: ['Photography', 'Video Editing'],
      availability: ['weekends'],
      rating: 4.8,
      swapsCompleted: 15
    },
    {
      id: '5',
      name: 'Vishwa Agarwal',
      location: 'Hyderabad, India',
      skillsOffered: ['Photography', 'Video Production', 'Drone Operation'],
      skillsWanted: ['Business Strategy', 'Financial Planning'],
      availability: ['evenings', 'weekends'],
      rating: 4.6,
      swapsCompleted: 12
    }
  ];

  const filteredUsers = mockUsers.filter(profile => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesName = profile.name.toLowerCase().includes(searchLower);
    const matchesSkillsOffered = profile.skillsOffered.some(skill => 
      skill.toLowerCase().includes(searchLower)
    );
    const matchesSkillsWanted = profile.skillsWanted.some(skill => 
      skill.toLowerCase().includes(searchLower)
    );
    const matchesLocation = profile.location.toLowerCase().includes(searchLower);

    if (filterBy === 'skills-offered') return matchesSkillsOffered;
    if (filterBy === 'skills-wanted') return matchesSkillsWanted;
    if (filterBy === 'location') return matchesLocation;
    
    return matchesName || matchesSkillsOffered || matchesSkillsWanted || matchesLocation;
  });

  const handleSendRequest = (targetUser: UserProfile, skill: string) => {
    toast({
      title: "Request sent!",
      description: `Your skill swap request has been sent to ${targetUser.name} for ${skill}.`,
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Skills</h1>
          <p className="text-muted-foreground mt-1">
            Find people to swap skills with
          </p>
        </div>
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48 bg-input border-border">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="skills-offered">Skills Offered</SelectItem>
                <SelectItem value="skills-wanted">Skills Wanted</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((profile) => (
          <Card key={profile.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{profile.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({profile.swapsCompleted} swaps)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 text-success">Offers:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.skillsOffered.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skillsOffered.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-warning">Wants:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.skillsWanted.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skillsWanted.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Available: {profile.availability.join(', ')}
              </div>

              {/* Check for skill matches */}
              <div className="space-y-2">
                {user.skillsOffered.some(skill => 
                  profile.skillsWanted.some(wanted => 
                    wanted.toLowerCase().includes(skill.toLowerCase())
                  )
                ) && (
                  <div className="p-2 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-xs text-success font-medium">
                      ✓ You can help with skills they want!
                    </p>
                  </div>
                )}
                
                {user.skillsWanted.some(skill => 
                  profile.skillsOffered.some(offered => 
                    offered.toLowerCase().includes(skill.toLowerCase())
                  )
                ) && (
                  <div className="p-2 bg-warning/10 rounded-lg border border-warning/20">
                    <p className="text-xs text-warning font-medium">
                      ⭐ They have skills you want!
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    const commonSkill = profile.skillsOffered.find(skill => 
                      user.skillsWanted.some(wanted => 
                        wanted.toLowerCase().includes(skill.toLowerCase())
                      )
                    ) || profile.skillsOffered[0];
                    handleSendRequest(profile, commonSkill);
                  }}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Request Swap
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-sm">
                Try adjusting your search terms or filters to find more people.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};