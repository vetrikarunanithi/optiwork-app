import { User, Skill, Task } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { SkillBadge } from '../shared/SkillBadge';
import { ArrowLeft, Award, Calendar, TrendingUp, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface EmployeeSkillProfileProps {
  user: User;
  skills: Skill[];
  tasks: Task[];
  onBack: () => void;
}

export function EmployeeSkillProfile({ user, skills, tasks, onBack }: EmployeeSkillProfileProps) {
  const getSkillMatchForTasks = () => {
    const currentTasks = tasks.filter(t => t.status !== 'completed');
    if (currentTasks.length === 0) return 100;

    const userSkillIds = user.skills?.map(s => s.skillId) || [];
    const requiredSkillIds = currentTasks.flatMap(t => t.requiredSkills || []);
    const uniqueRequired = [...new Set(requiredSkillIds)];
    
    if (uniqueRequired.length === 0) return 100;

    const matchedSkills = uniqueRequired.filter(skillId => userSkillIds.includes(skillId));
    return Math.round((matchedSkills.length / uniqueRequired.length) * 100);
  };

  const skillMatchPercentage = getSkillMatchForTasks();

  const getCertificationStatus = () => {
    const allCerts = user.skills?.flatMap(s => s.certifications || []) || [];
    const active = allCerts.filter(c => c.status === 'active').length;
    const expired = allCerts.filter(c => c.status === 'expired').length;
    const pending = allCerts.filter(c => c.status === 'pending').length;
    return { active, expired, pending, total: allCerts.length };
  };

  const certStatus = getCertificationStatus();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-amber-600';
      case 'advanced': return 'text-purple-600';
      case 'intermediate': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelProgress = (level: string) => {
    switch (level) {
      case 'expert': return 100;
      case 'advanced': return 75;
      case 'intermediate': return 50;
      default: return 25;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>My Skills & Certifications</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Skill Match Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-blue-100 mb-1">Current Task Skill Match</p>
                <p className="text-3xl">{skillMatchPercentage}%</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                {skillMatchPercentage >= 80 ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <TrendingUp className="w-8 h-8" />
                )}
              </div>
            </div>
            <p className="text-sm text-blue-100">
              {skillMatchPercentage >= 80 
                ? 'Excellent! You have all the skills for your assigned tasks'
                : 'Some tasks may require additional training or support'}
            </p>
          </CardContent>
        </Card>

        {/* Certifications Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-2xl text-green-600">{certStatus.active}</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div>
                <p className="text-2xl text-red-600">{certStatus.expired}</p>
                <p className="text-xs text-gray-600">Expired</p>
              </div>
              <div>
                <p className="text-2xl text-yellow-600">{certStatus.pending}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>

            {certStatus.expired > 0 && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">
                    You have {certStatus.expired} expired certification{certStatus.expired > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Please contact your supervisor for recertification
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills List */}
        <Card>
          <CardHeader>
            <CardTitle>My Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => {
                const skillInfo = skills.find(s => s.id === skill.skillId);
                const hasCertification = skill.certifications && skill.certifications.length > 0;
                const activeCert = skill.certifications?.find(c => c.status === 'active');
                const expiredCert = skill.certifications?.find(c => c.status === 'expired');

                return (
                  <div key={skill.skillId} className="p-4 rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3>{skill.skillName}</h3>
                          {hasCertification && (
                            <Award className={`w-4 h-4 ${activeCert ? 'text-green-600' : 'text-red-600'}`} />
                          )}
                        </div>
                        {skillInfo && (
                          <p className="text-sm text-gray-600 mb-2">{skillInfo.category}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={`${getLevelColor(skill.level)}`}>
                            {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)} Level
                          </Badge>
                          <Badge variant="outline">
                            {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Proficiency</span>
                        <span className={getLevelColor(skill.level)}>
                          {skill.level.toUpperCase()}
                        </span>
                      </div>
                      <Progress value={getLevelProgress(skill.level)} className="h-2" />
                    </div>

                    {skill.certifications && skill.certifications.length > 0 && (
                      <div className="pt-3 border-t space-y-2">
                        <p className="text-sm text-gray-600 mb-2">Certifications:</p>
                        {skill.certifications.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                cert.status === 'active' ? 'bg-green-500' :
                                cert.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
                              }`} />
                              <span>{cert.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {cert.status === 'expired' ? 'Expired' : 'Valid'} until{' '}
                              {new Date(cert.expiryDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {skill.lastUsed && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last used: {new Date(skill.lastUsed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No skills added yet</p>
                <p className="text-sm mt-1">Contact your supervisor to update your skill profile</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
