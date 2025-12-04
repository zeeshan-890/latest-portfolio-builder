'use client';

import { useRef } from 'react';
import { Plus, Trash2, FolderOpen, Star, ExternalLink, Github, Upload } from 'lucide-react';
import { usePortfolioStore, Project } from '@/app/store/portfolioStore';

const ProjectsForm = () => {
    const { portfolioData, addProject, updateProject, removeProject } = usePortfolioStore();
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const handleAdd = () => {
        const newProject: Project = {
            id: Date.now(),
            title: '',
            description: '',
            technologies: [],
            demoUrl: '',
            githubUrl: '',
            image: null,
            featured: false,
            status: 'completed',
        };
        addProject(newProject);
    };

    const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateProject(id, { image: e.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTechChange = (id: number, value: string) => {
        const technologies = value.split(',').map((s) => s.trim()).filter((s) => s);
        updateProject(id, { technologies });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Projects</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                </button>
            </div>

            {portfolioData.projects.map((project, index) => (
                <div key={project.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-blue-400">Project #{index + 1}</h4>
                            {project.featured && (
                                <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded-full text-xs flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => removeProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        placeholder="My Awesome Project"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                    <select
                                        value={project.status}
                                        onChange={(e) =>
                                            updateProject(project.id, {
                                                status: e.target.value as 'completed' | 'in-progress' | 'planned',
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="planned">Planned</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={project.description}
                                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                                    placeholder="Describe your project, its purpose, and key features..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                            <div
                                className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => fileInputRefs.current[project.id]?.click()}
                            >
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt="Project"
                                        className="w-full h-24 object-cover rounded"
                                    />
                                ) : (
                                    <div className="py-4">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-400">Click to upload</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={(el) => {
                                    fileInputRefs.current[project.id] = el;
                                }}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(project.id, e)}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <ExternalLink className="w-4 h-4 inline mr-1" />
                                Demo URL
                            </label>
                            <input
                                type="url"
                                value={project.demoUrl}
                                onChange={(e) => updateProject(project.id, { demoUrl: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="https://myproject.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Github className="w-4 h-4 inline mr-1" />
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={project.githubUrl}
                                onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="https://github.com/user/project"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Technologies Used</label>
                        <input
                            type="text"
                            value={project.technologies.join(', ')}
                            onChange={(e) => handleTechChange(project.id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="React, Node.js, MongoDB, Docker"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                    </div>

                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={project.featured}
                                onChange={(e) => updateProject(project.id, { featured: e.target.checked })}
                                className="rounded border-gray-500 bg-gray-600 text-yellow-600 focus:ring-yellow-500"
                            />
                            <span className="text-sm text-gray-300">
                                <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                                Feature this project (show prominently)
                            </span>
                        </label>
                    </div>
                </div>
            ))}

            {portfolioData.projects.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Click &quot;Add Project&quot; to showcase your work.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectsForm;
