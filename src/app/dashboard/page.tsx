"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Clock, 
  Users, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Camera,
  MessageSquare
} from 'lucide-react';
import { AIInsightPanel } from '@/components/dashboard/AIInsightPanel';
import { TimelineChart } from '@/components/ui/TimelineChart';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import Link from 'next/link';

type Tables = Database['public']['Tables']
type Project = Tables['projects']['Row']
type Task = Tables['tasks']['Row']
type Analysis = Tables['project_analysis']['Row']
type Timeline = Tables['project_timelines']['Row']

interface TimelinePhase {
  name: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
}

interface DashboardData {
  projects: Project[];
  tasks: Task[];
  teamCount: number;
  issuesCount: number;
  recentActivity: Analysis[];
  timeline: Timeline | null;
}

interface ActivityDescription {
  description: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    projects: [],
    tasks: [],
    teamCount: 0,
    issuesCount: 0,
    recentActivity: [],
    timeline: null,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        { data: projects, error: projectsError },
        { data: tasks, error: tasksError },
        { count: teamCount, error: teamError },
        { data: activity, error: activityError }
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('status', 'active'),
        supabase
          .from('tasks')
          .select('*')
          .eq('status', 'todo'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact' }),
        supabase
          .from('project_analysis')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Handle errors
      if (projectsError) throw projectsError;
      if (tasksError) throw tasksError;
      if (teamError) throw teamError;
      if (activityError) throw activityError;

      const timelineData = await fetchTimelineData();

      setDashboardData({
        projects: projects || [],
        tasks: tasks || [],
        teamCount: teamCount || 0,
        issuesCount: calculateIssues(projects || []),
        recentActivity: activity || [],
        timeline: timelineData,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchTimelineData = async () => {
    const { data, error } = await supabase
      .from('project_timelines')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching timeline data:', error);
      return null;
    }

    return data;
  };

  const calculateIssues = (projects: Project[]) => {
    return projects.reduce((acc, project) => {
      if (project.status === 'on_hold') acc++;
      return acc;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/projects">
          <Card className="animate-fade-scale hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.projects.length > 0 
                  ? `${((dashboardData.projects.length / 10) * 100).toFixed(0)}% workload` 
                  : 'No active projects'}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tasks">
          <Card className="animate-fade-scale hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.tasks.length}</div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/team">
          <Card className="animate-fade-scale hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground ml-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.teamCount}</div>
              <p className="text-xs text-muted-foreground">Active now</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="animate-fade-scale hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.issuesCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline Overview */}
        <Card className="animate-fade-scale">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Project Timeline</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/schedule">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboardData.timeline?.phases && (
              <TimelineChart 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={formatTimelineData(dashboardData.timeline.phases as any)} 
              />
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <AIInsightPanel 
          projectId={dashboardData.projects[0]?.id} 
          analysisType="overview" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Recent Activity */}
        <Card className="animate-fade-scale">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => {
                const analysisResult = activity.analysis_result as ActivityDescription | null;
                return (
                  <div key={index} className="flex items-center gap-4 text-sm">
                    {getActivityIcon(activity.type || 'default')}
                    <div>
                      <p className="font-medium">
                        {analysisResult?.description || 'Activity update'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'analysis':
      return <Camera className="h-4 w-4 text-blue-500" />;
    case 'progress':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'communication':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTimelineData = (phases: any): TimelinePhase[] => {
  if (!Array.isArray(phases)) return [];
  
  return phases.map(phase => ({
    name: String(phase.name || ''),
    start_date: String(phase.start_date || new Date().toISOString()),
    end_date: String(phase.end_date || new Date().toISOString()),
    completion_percentage: Number(phase.completion_percentage || 0)
  }));
};