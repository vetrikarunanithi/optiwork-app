// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Textarea } from '../ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
// import { Badge } from '../ui/badge';
// import { ArrowLeft, Plus, Trophy, Target, Award, Star, Edit, Trash2, Users } from 'lucide-react';
// import { toast } from 'sonner@2.0.3';

// interface BadgeConfig {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   rarity: 'common' | 'rare' | 'epic' | 'legendary';
//   criteria: string;
//   points: number;
// }

// interface Challenge {
//   id: string;
//   title: string;
//   description: string;
//   type: 'individual' | 'team';
//   startDate: string;
//   endDate: string;
//   goal: number;
//   currentProgress: number;
//   participants: number;
//   prize: string;
// }

// interface GamificationHubProps {
//   onBack: () => void;
// }

// export function GamificationHub({ onBack }: GamificationHubProps) {
//   const [badges, setBadges] = useState<BadgeConfig[]>([
//     {
//       id: '1',
//       name: 'Speed Demon',
//       description: 'Complete 10 tasks 20% faster than average',
//       icon: '⚡',
//       rarity: 'rare',
//       criteria: 'speed',
//       points: 150
//     },
//     {
//       id: '2',
//       name: 'Quality Champion',
//       description: 'Maintain 100% quality score for 30 days',
//       icon: '🏆',
//       rarity: 'legendary',
//       criteria: 'quality',
//       points: 500
//     }
//   ]);

//   const [challenges, setChallenges] = useState<Challenge[]>([
//     {
//       id: '1',
//       title: 'October Sprint',
//       description: 'Complete 500 tasks as a team this month',
//       type: 'team',
//       startDate: '2025-10-01',
//       endDate: '2025-10-31',
//       goal: 500,
//       currentProgress: 342,
//       participants: 15,
//       prize: '$500 team lunch'
//     }
//   ]);

//   const [isAddBadgeOpen, setIsAddBadgeOpen] = useState(false);
//   const [isAddChallengeOpen, setIsAddChallengeOpen] = useState(false);

//   const handleAddBadge = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     toast.success('Badge created successfully!');
//     setIsAddBadgeOpen(false);
//   };

//   const handleAddChallenge = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     toast.success('Challenge created successfully!');
//     setIsAddChallengeOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
//       <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center h-16 gap-4">
//             <Button variant="ghost" size="icon" onClick={onBack}>
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             <div className="flex items-center gap-2">
//               <Trophy className="w-5 h-5 text-amber-600" />
//               <h1>Optiwork Gamification</h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Tabs defaultValue="badges" className="space-y-6">
//           <TabsList className="grid w-full max-w-md grid-cols-3">
//             <TabsTrigger value="badges">Badges</TabsTrigger>
//             <TabsTrigger value="challenges">Challenges</TabsTrigger>
//             <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
//           </TabsList>

//           {/* Badges Tab */}
//           <TabsContent value="badges" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl">Achievement Badges</h2>
//                 <p className="text-sm text-muted-foreground">Create and manage employee achievement badges</p>
//               </div>
//               <Dialog open={isAddBadgeOpen} onOpenChange={setIsAddBadgeOpen}>
//                 <DialogTrigger asChild>
//                   <Button>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Create Badge
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <DialogHeader>
//                     <DialogTitle>Create New Badge</DialogTitle>
//                     <DialogDescription>
//                       Define a new achievement badge for employees to earn.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <form onSubmit={handleAddBadge} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="badge-name">Badge Name *</Label>
//                         <Input id="badge-name" placeholder="e.g., Speed Demon" required />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="badge-icon">Icon (Emoji) *</Label>
//                         <Input id="badge-icon" placeholder="⚡" maxLength={2} required />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="badge-description">Description *</Label>
//                       <Textarea
//                         id="badge-description"
//                         placeholder="Describe how to earn this badge"
//                         rows={3}
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="badge-rarity">Rarity *</Label>
//                         <Select required>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select rarity" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="common">Common</SelectItem>
//                             <SelectItem value="rare">Rare</SelectItem>
//                             <SelectItem value="epic">Epic</SelectItem>
//                             <SelectItem value="legendary">Legendary</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="badge-points">Points Value *</Label>
//                         <Input id="badge-points" type="number" placeholder="100" required />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="badge-criteria">Achievement Criteria *</Label>
//                       <Select required>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select criteria type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="tasks">Task Completion</SelectItem>
//                           <SelectItem value="speed">Speed/Efficiency</SelectItem>
//                           <SelectItem value="quality">Quality Score</SelectItem>
//                           <SelectItem value="streak">Consecutive Days</SelectItem>
//                           <SelectItem value="skill">Skill Mastery</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                       <Button type="button" variant="outline" onClick={() => setIsAddBadgeOpen(false)} className="flex-1">
//                         Cancel
//                       </Button>
//                       <Button type="submit" className="flex-1">Create Badge</Button>
//                     </div>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {/* Badge List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {badges.map((badge) => {
//                 const rarityColors = {
//                   common: 'from-gray-400 to-gray-500',
//                   rare: 'from-blue-500 to-cyan-500',
//                   epic: 'from-purple-500 to-pink-500',
//                   legendary: 'from-amber-500 to-orange-500'
//                 };

//                 return (
//                   <Card key={badge.id} className="relative overflow-hidden">
//                     <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[badge.rarity]}`} />
//                     <CardHeader>
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-2xl`}>
//                             {badge.icon}
//                           </div>
//                           <div>
//                             <CardTitle className="text-base">{badge.name}</CardTitle>
//                             <Badge variant="outline" className="mt-1 text-xs capitalize">
//                               {badge.rarity}
//                             </Badge>
//                           </div>
//                         </div>
//                         <div className="flex gap-1">
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <Trash2 className="w-4 h-4 text-red-600" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Points:</span>
//                         <span className="font-semibold text-amber-600">{badge.points}</span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </TabsContent>

//           {/* Challenges Tab */}
//           <TabsContent value="challenges" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl">Active Challenges</h2>
//                 <p className="text-sm text-muted-foreground">Create competitions to motivate your team</p>
//               </div>
//               <Dialog open={isAddChallengeOpen} onOpenChange={setIsAddChallengeOpen}>
//                 <DialogTrigger asChild>
//                   <Button>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Create Challenge
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <DialogHeader>
//                     <DialogTitle>Create New Challenge</DialogTitle>
//                     <DialogDescription>
//                       Set up a new challenge to motivate your team.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <form onSubmit={handleAddChallenge} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="challenge-title">Challenge Title *</Label>
//                       <Input id="challenge-title" placeholder="e.g., October Sprint" required />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="challenge-description">Description *</Label>
//                       <Textarea
//                         id="challenge-description"
//                         placeholder="Describe the challenge goals and rules"
//                         rows={3}
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="challenge-type">Type *</Label>
//                         <Select required>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="individual">Individual</SelectItem>
//                             <SelectItem value="team">Team</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="challenge-goal">Goal (Number) *</Label>
//                         <Input id="challenge-goal" type="number" placeholder="500" required />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="challenge-start">Start Date *</Label>
//                         <Input id="challenge-start" type="date" required />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="challenge-end">End Date *</Label>
//                         <Input id="challenge-end" type="date" required />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="challenge-prize">Prize/Reward *</Label>
//                       <Input id="challenge-prize" placeholder="e.g., $500 team lunch" required />
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                       <Button type="button" variant="outline" onClick={() => setIsAddChallengeOpen(false)} className="flex-1">
//                         Cancel
//                       </Button>
//                       <Button type="submit" className="flex-1">Create Challenge</Button>
//                     </div>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {/* Challenge List */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {challenges.map((challenge) => {
//                 const progressPercent = (challenge.currentProgress / challenge.goal) * 100;
                
//                 return (
//                   <Card key={challenge.id} className="border-2 border-primary/20">
//                     <CardHeader>
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
//                             <Target className="w-6 h-6 text-white" />
//                           </div>
//                           <div>
//                             <CardTitle>{challenge.title}</CardTitle>
//                             <Badge className={challenge.type === 'team' ? 'bg-purple-600' : 'bg-blue-600'}>
//                               {challenge.type === 'team' ? <Users className="w-3 h-3 mr-1" /> : <Star className="w-3 h-3 mr-1" />}
//                               {challenge.type}
//                             </Badge>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="icon">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-muted-foreground">Progress</span>
//                           <span className="font-semibold">
//                             {challenge.currentProgress} / {challenge.goal}
//                           </span>
//                         </div>
//                         <div className="relative h-3 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
//                             style={{ width: `${progressPercent}%` }}
//                           />
//                         </div>
//                         <div className="text-xs text-center text-muted-foreground">
//                           {progressPercent.toFixed(0)}% Complete
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Participants</p>
//                           <p className="text-lg font-semibold">{challenge.participants}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground">Prize</p>
//                           <p className="text-sm font-semibold text-amber-600">{challenge.prize}</p>
//                         </div>
//                       </div>

//                       <div className="text-xs text-muted-foreground">
//                         {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </TabsContent>

//           {/* Leaderboards Tab */}
//           <TabsContent value="leaderboards" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Leaderboard Configuration</CardTitle>
//                 <p className="text-sm text-muted-foreground">Configure leaderboard settings and rankings</p>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Leaderboard Type</Label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="tasks">Task Completion</SelectItem>
//                       <SelectItem value="quality">Quality Score</SelectItem>
//                       <SelectItem value="speed">Speed/Efficiency</SelectItem>
//                       <SelectItem value="points">Total Points</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Time Period</Label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select period" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="daily">Daily</SelectItem>
//                       <SelectItem value="weekly">Weekly</SelectItem>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="alltime">All Time</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button className="w-full">Save Leaderboard Settings</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
