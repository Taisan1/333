import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Calendar,
  User,
  Camera,
  Palette,
  Clock,
  CheckCircle,
  Upload,
  Image,
  FileText,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { Project } from '../../types/user';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const { user, users, projects, updateProject } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Project>>({});

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Проект не найден</h3>
            <p className="text-gray-600 mb-4">Возможно, проект был удален или у вас нет доступа к нему</p>
            <Button onClick={onBack}>Вернуться к списку проектов</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'planning': { label: 'Планирование', color: 'bg-gray-100 text-gray-800', icon: Clock },
      'in-progress': { label: 'В работе', color: 'bg-blue-100 text-blue-800', icon: Camera },
      'review': { label: 'На проверке', color: 'bg-yellow-100 text-yellow-800', icon: Palette },
      'completed': { label: 'Завершен', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.planning;
  };

  const albumTypes = [
    'Свадебный альбом',
    'Выпускной альбом',
    'Детский альбом',
    'Корпоративный альбом',
    'Семейный альбом',
    'Портретная съемка'
  ];

  const photographers = users.filter(u => u.role === 'photographer');
  const designers = users.filter(u => u.role === 'designer');
  const managers = users.filter(u => u.role === 'admin');

  const handleEdit = () => {
    setEditData({
      title: project.title,
      albumType: project.albumType,
      description: project.description,
      status: project.status,
      deadline: project.deadline.toISOString().split('T')[0],
      manager: project.manager,
      photographer: project.photographer,
      designer: project.designer
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updateData: Partial<Project> = {
      ...editData,
      deadline: editData.deadline ? new Date(editData.deadline) : project.deadline,
      manager: editData.manager ? users.find(u => u.id === (editData.manager as any)?.id || editData.manager) : undefined,
      photographer: editData.photographer ? users.find(u => u.id === (editData.photographer as any)?.id || editData.photographer) : undefined,
      designer: editData.designer ? users.find(u => u.id === (editData.designer as any)?.id || editData.designer) : undefined
    };

    updateProject(projectId, updateData);
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;

  // Mock files for demonstration
  const mockFiles = [
    { id: '1', name: 'wedding_photo_001.jpg', type: 'image', size: '2.4 MB', uploadedAt: new Date(), uploadedBy: 'John Doe' },
    { id: '2', name: 'wedding_photo_002.jpg', type: 'image', size: '2.1 MB', uploadedAt: new Date(), uploadedBy: 'John Doe' },
    { id: '3', name: 'album_design_v1.pdf', type: 'document', size: '5.2 MB', uploadedAt: new Date(), uploadedBy: 'Jane Smith' },
    { id: '4', name: 'client_requirements.docx', type: 'document', size: '156 KB', uploadedAt: new Date(), uploadedBy: 'Admin' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к проектам
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                project.title
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? (
                <select
                  value={editData.albumType || ''}
                  onChange={(e) => handleChange('albumType', e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                >
                  {albumTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              ) : (
                project.albumType
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о проекте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                {isEditing ? (
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{project.description || 'Описание не указано'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                  {isEditing ? (
                    <select
                      value={editData.status || ''}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="planning">Планирование</option>
                      <option value="in-progress">В работе</option>
                      <option value="review">На проверке</option>
                      <option value="completed">Завершен</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {statusInfo.label}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дедлайн</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.deadline || ''}
                      onChange={(e) => handleChange('deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {project.deadline.toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Менеджер</label>
                  {isEditing ? (
                    <select
                      value={(editData.manager as any)?.id || ''}
                      onChange={(e) => handleChange('manager', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Не назначен</option>
                      {managers.map(manager => (
                        <option key={manager.id} value={manager.id}>{manager.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {project.manager?.name || 'Не назначен'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Фотограф</label>
                  {isEditing ? (
                    <select
                      value={(editData.photographer as any)?.id || ''}
                      onChange={(e) => handleChange('photographer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Не назначен</option>
                      {photographers.map(photographer => (
                        <option key={photographer.id} value={photographer.id}>{photographer.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Camera className="h-4 w-4 mr-2" />
                      {project.photographer?.name || 'Не назначен'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дизайнер</label>
                  {isEditing ? (
                    <select
                      value={(editData.designer as any)?.id || ''}
                      onChange={(e) => handleChange('designer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Не назначен</option>
                      {designers.map(designer => (
                        <option key={designer.id} value={designer.id}>{designer.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Palette className="h-4 w-4 mr-2" />
                      {project.designer?.name || 'Не назначен'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Файлы проекта</CardTitle>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить файлы
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {file.type === 'image' ? (
                          <Image className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {file.size} • Загружен {file.uploadedBy} • {file.uploadedAt.toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">Скачать</Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {mockFiles.length === 0 && (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Файлы еще не загружены</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Фотографий</span>
                <span className="font-semibold">{project.photosCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Макетов</span>
                <span className="font-semibold">{project.designsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Файлов</span>
                <span className="font-semibold">{mockFiles.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Временная шкала</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Проект создан</p>
                  <p className="text-sm text-gray-500">{project.createdAt.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Последнее обновление</p>
                  <p className="text-sm text-gray-500">{project.updatedAt.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Дедлайн</p>
                  <p className="text-sm text-gray-500">{project.deadline.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}