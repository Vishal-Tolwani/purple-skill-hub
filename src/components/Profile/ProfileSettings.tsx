import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Plus, X, Upload, Clock, MapPin } from 'lucide-react';

interface ProfileSettingsProps {
  onNavigate: (page: string) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    isPublic: user?.isPublic ?? true,
  });
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);
  const [availability, setAvailability] = useState(user?.availability || []);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  if (!user) return null;

  const availabilityOptions = [
    'Weekdays 9-5',
    'Weekdays evenings',
    'Weekends',
    'Weekend mornings',
    'Weekend evenings',
    'Flexible schedule'
  ];

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      location: formData.location,
      isPublic: formData.isPublic,
      skillsOffered,
      skillsWanted,
      availability
    });
    
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  const toggleAvailability = (option: string) => {
    setAvailability(prev => 
      prev.includes(option) 
        ? prev.filter(a => a !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile information and skills
          </p>
        </div>
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your personal details and profile visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePhoto} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-input border-border pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked as boolean }))}
              />
              <Label htmlFor="isPublic" className="text-sm">
                Make my profile public (allow others to find and contact me)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Profile Summary</CardTitle>
            <CardDescription>
              Your current profile status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Skills Offered</span>
              <Badge variant="default">{skillsOffered.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Skills Wanted</span>
              <Badge variant="outline">{skillsWanted.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Availability</span>
              <Badge variant="secondary">{availability.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Profile Status</span>
              <Badge variant={formData.isPublic ? "default" : "secondary"}>
                {formData.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Offered */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Skills You Offer</CardTitle>
          <CardDescription>
            Add skills that you can teach or help others with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., JavaScript, Photography, Cooking"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
              className="bg-input border-border"
            />
            <Button onClick={addSkillOffered} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsOffered.map((skill, index) => (
              <Badge key={index} variant="default" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeSkillOffered(skill)}
                />
              </Badge>
            ))}
            {skillsOffered.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills Wanted */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Skills You Want to Learn</CardTitle>
          <CardDescription>
            Add skills that you'd like to learn from others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Python, Graphic Design, Marketing"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
              className="bg-input border-border"
            />
            <Button onClick={addSkillWanted} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsWanted.map((skill, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeSkillWanted(skill)}
                />
              </Badge>
            ))}
            {skillsWanted.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Availability
          </CardTitle>
          <CardDescription>
            Select when you're available for skill swaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availabilityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={availability.includes(option)}
                  onCheckedChange={() => toggleAvailability(option)}
                />
                <Label htmlFor={option} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
};