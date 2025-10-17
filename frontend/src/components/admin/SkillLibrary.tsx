import { useState } from 'react';
import { Skill } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Award, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SkillLibraryProps {
  skills: Skill[];
  onBack: () => void;
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  onUpdateSkill: (skillId: string, skill: Partial<Skill>) => void;
  onDeleteSkill: (skillId: string) => void;
}

export function SkillLibrary({ skills, onBack, onAddSkill, onUpdateSkill, onDeleteSkill }: SkillLibraryProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    requiresCertification: false,
    department: ''
  });

  const categories = [...new Set(skills.map(s => s.category))];
  const departments = ['Production', 'Quality Control', 'Assembly', 'All'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      onUpdateSkill(editingSkill.id, formData);
      toast.success('Skill updated successfully');
      setEditingSkill(null);
    } else {
      onAddSkill(formData);
      toast.success('Skill added to library');
    }
    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      requiresCertification: false,
      department: ''
    });
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      description: skill.description,
      requiresCertification: skill.requiresCertification,
      department: skill.department || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      onDeleteSkill(skillId);
      toast.success('Skill removed from library');
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h1>Skill Library</h1>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                  <DialogDescription>
                    {editingSkill ? 'Update skill information and requirements.' : 'Add a new skill to the organization\'s skill library.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Skill Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., CNC Machining"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Machining, Welding"
                      required
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what this skill involves"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-gray-600" />
                      <Label htmlFor="certification" className="cursor-pointer">
                        Requires Certification
                      </Label>
                    </div>
                    <Switch
                      id="certification"
                      checked={formData.requiresCertification}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, requiresCertification: checked })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingSkill(null);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingSkill ? 'Update Skill' : 'Add Skill'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Total Skills: {skills.length} • Categories: {Object.keys(groupedSkills).length}
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="mb-4 text-gray-700">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySkills.map((skill) => (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {skill.requiresCertification && (
                              <Badge className="bg-green-100 text-green-800">
                                <Award className="w-3 h-3 mr-1" />
                                Certification Required
                              </Badge>
                            )}
                            {skill.department && (
                              <Badge variant="outline">{skill.department}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(skill)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
