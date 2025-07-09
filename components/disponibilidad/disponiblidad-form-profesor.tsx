"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';

interface CourseAssigned {
  id: string;
  code: string;
  name: string;
  section: number;
  curriculum: string;
  capacity: number;
  credits: number;
  hours_per_week: number;
  cycle: number;
  teacher_id: string;
  facility_id: string;
  enrolled: number;
  semester: string;
  academic_year: number;
  active: boolean;
}

interface ScheduleSuggestion {
  id: string;
  course_id: string;
  day: string; 
  start_time: string; // "08:00:00"
  end_time: string; // "10:00:00"
  session_type: string;
  location_detail: string | null;
  created_at: string | null;
  facility_id: string;
}

interface ScheduledCourse extends CourseAssigned {
  scheduleId: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  facility_id: string;
  session_type: string;
  isConfirmed?: boolean;
}

const ItemTypes = {
  COURSE: 'course',
  SCHEDULED_COURSE: 'scheduled_course'
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 AM a 10:00 PM

const DAY_MAPPING: { [key: string]: number } = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5
};

const INDEX_TO_DAY: { [key: number]: string } = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday'
};

const timeToHour = (time: string): number => {
  const [hours] = time.split(':').map(Number);
  return hours;
};

const hourToTime = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00:00`;
};

// curso disponible (draggable)
const DraggableCourse: React.FC<{ course: CourseAssigned }> = ({ course }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: { ...course },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getColorClass = (index: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg border-2 border-dashed cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${getColorClass(parseInt(course.id.slice(-1)))} text-white hover:shadow-lg`}
    >
      <div className="font-semibold text-sm">{course.code}</div>
      <div className="text-xs opacity-90 truncate">{course.name}</div>
      <div className="text-xs opacity-75 mt-1">
        {course.hours_per_week}h/sem • Sec. {course.section}
      </div>
      <div className="text-xs opacity-75">
        {course.credits} créditos
      </div>
    </div>
  );
};

// curso ya programado (draggable)
const ScheduledCourse: React.FC<{ 
  course: ScheduledCourse; 
  onRemove: (scheduleId: string) => void;
}> = ({ course, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SCHEDULED_COURSE,
    item: { ...course },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getColorClass = (index: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={drag}
      className={`absolute inset-0 p-1 rounded cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${getColorClass(parseInt(course.id.slice(-1)))} text-white text-xs hover:shadow-lg ${
        course.isConfirmed ? 'ring-2 ring-green-300' : 'ring-2 ring-yellow-300'
      }`}
      style={{ zIndex: 10 }}
    >
      <div className="font-semibold">{course.code}</div>
      <div className="opacity-90 truncate">{course.name}</div>
      <div className="opacity-75 text-xs">Sec. {course.section}</div>
      <div className="opacity-75 text-xs">
        {course.isConfirmed ? '✓ Confirmado' : '⏳ Pendiente'}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(course.scheduleId);
        }}
        className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-700"
      >
        ×
      </button>
    </div>
  );
};

const CalendarCell: React.FC<{
  day: number;
  hour: number;
  scheduledCourses: ScheduledCourse[];
  onDrop: (item: any, day: number, hour: number) => void;
  onRemove: (scheduleId: string) => void;
}> = ({ day, hour, scheduledCourses, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.COURSE, ItemTypes.SCHEDULED_COURSE],
    drop: (item) => {
      onDrop(item, day, hour);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const coursesInCell = scheduledCourses.filter(
    (course) => course.dayIndex === day && course.startHour <= hour && course.endHour > hour
  );

  return (
    <div
      ref={drop}
      className={`relative border border-gray-200 min-h-[60px] transition-colors ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
      }`}
    >
      {coursesInCell.map((course) => (
        <ScheduledCourse
          key={course.scheduleId}
          course={course}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface DisponibilidadFormProps {
  teacherId: string;
}

const DisponibilidadForm: React.FC<DisponibilidadFormProps> = ({ teacherId }) => {
  const [availableCourses, setAvailableCourses] = useState<CourseAssigned[]>([]);
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAssignedSchedule, setHasAssignedSchedule] = useState<boolean | null>(null); // NUEVO
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

  // Verificar si ya tiene horario asignado
  useEffect(() => {
    const verifySchedule = async () => {
      try {
        const response = await fetch(`${apiUrl}/teacher/schedules/verify/${teacherId}`, {
          method: 'GET'
        });
        if (!response.ok) throw new Error('Error al verificar horario');
        const result = await response.json();
        setHasAssignedSchedule(result === true);
      } catch (err) {
        setError('No se pudo verificar el estado del horario');
        setHasAssignedSchedule(false);
      }
    };
    if (teacherId) verifySchedule();
  }, [teacherId]);
  

  // ursos asignados al docente
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/teacher/courses/of-user/${teacherId}`);
        if (!response.ok) {
          throw new Error('Error al cargar los cursos');
        }
        const courses: CourseAssigned[] = await response.json();
        setAvailableCourses(courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  const handleDrop = useCallback((item: any, day: number, hour: number) => {
    const duration = item.hours_per_week || 2; 
    const endHour = hour + duration;
    
    const hasConflict = scheduledCourses.some(
      (course) =>
        course.dayIndex === day &&
        course.scheduleId !== item.scheduleId &&
        ((course.startHour < endHour && course.endHour > hour) ||
         (hour < course.endHour && endHour > course.startHour))
    );

    if (hasConflict) {
      setError('Hay un conflicto de horario en este tiempo');
      return;
    }

    if (item.scheduleId) {
      setScheduledCourses(prev => 
        prev.filter(course => course.scheduleId !== item.scheduleId)
      );
    }

    const newScheduledCourse: ScheduledCourse = {
      ...item,
      scheduleId: item.scheduleId || `schedule_${Date.now()}_${Math.random()}`,
      dayIndex: day,
      startHour: hour,
      endHour: endHour,
      facility_id: item.facility_id || '',
      session_type: 'Theory',
      isConfirmed: false,
    };

    setScheduledCourses(prev => [...prev, newScheduledCourse]);
    setError(null);
  }, [scheduledCourses]);

  const handleRemove = useCallback((scheduleId: string) => {
    setScheduledCourses(prev => prev.filter(course => course.scheduleId !== scheduleId));
  }, []);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/teacher/schedules/suggest/${teacherId}`);
      if (!response.ok) {
        throw new Error('Error al generar horario sugerido');
      }
      
      const suggestions: ScheduleSuggestion[] = await response.json();
      
      const generatedSchedule: ScheduledCourse[] = suggestions.map(suggestion => {
        const course = availableCourses.find(c => c.id === suggestion.course_id);
        if (!course) return null;
        
        return {
          ...course,
          scheduleId: suggestion.id,
          dayIndex: DAY_MAPPING[suggestion.day],
          startHour: timeToHour(suggestion.start_time),
          endHour: timeToHour(suggestion.end_time),
          facility_id: suggestion.facility_id,
          session_type: suggestion.session_type,
          isConfirmed: false,
        };
      }).filter((course): course is ScheduledCourse => course !== null);
      
      setScheduledCourses(generatedSchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar horario');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const shortUuid = () => uuidv4().replace(/-/g, '').slice(0, 12);

      const savePromises = scheduledCourses.map(async (course) => {
        const scheduleData = {
          id: shortUuid(),
          course_id: course.id,
          day: INDEX_TO_DAY[course.dayIndex],
          start_time: hourToTime(course.startHour),
          end_time: hourToTime(course.endHour),
          session_type: course.session_type,
          location_detail: null,
          created_at: null,
          facility_id: course.facility_id,
        };

        const response = await fetch(`${apiUrl}/teacher/schedules`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(scheduleData),
        });

        if (!response.ok) {
          throw new Error(`Error al guardar el horario del curso ${course.code}`);
        }

        return response.json();
      });

      await Promise.all(savePromises);
      
      setScheduledCourses(prev => 
        prev.map(course => ({ ...course, isConfirmed: true }))
      );
      
      alert('Horario guardado exitosamente');
      window.location.href = "/horario";
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el horario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearSchedule = () => {
    setScheduledCourses([]);
    setError(null);
  };

  if (isLoading || hasAssignedSchedule === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando cursos...</span>
      </div>
    );
  }

  if (hasAssignedSchedule) {
    return (
      <div className="max-w-xl mx-auto mt-16 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            Ya tienes un horario asignado por el semestre.
          </AlertDescription>
        </Alert>
        <Button
          className="w-full"
          variant="default"
          onClick={() => window.location.href = "/horario"}
        >
          Ver horario asignado
        </Button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Horario de Disponibilidad</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateSchedule}
              disabled={isGenerating || availableCourses.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isGenerating ? 'Generando...' : 'Generar Horario'}
            </Button>
            <Button
              onClick={handleClearSchedule}
              variant="outline"
              className="text-red-600 hover:text-red-700"
              disabled={scheduledCourses.length === 0}
            >
              Limpiar
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={isSaving || scheduledCourses.length === 0}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Horario'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cursos Asignados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableCourses.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay cursos asignados</p>
                ) : (
                  availableCourses.map((course) => (
                    <DraggableCourse key={course.id} course={course} />
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cursos programados:</span>
                    <Badge variant="secondary">{scheduledCourses.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Horas totales:</span>
                    <Badge variant="secondary">
                      {scheduledCourses.reduce((total, course) => total + course.hours_per_week, 0)}h
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cursos pendientes:</span>
                    <Badge variant="outline">
                      {availableCourses.length - scheduledCourses.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confirmados:</span>
                    <Badge variant="default" className="bg-green-600">
                      {scheduledCourses.filter(c => c.isConfirmed).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendario Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-0 min-w-[800px]">
                    <div className="bg-gray-50 p-2 text-center font-semibold text-sm border">
                      Hora
                    </div>
                    {DAYS.map((day) => (
                      <div key={day} className="bg-gray-50 p-2 text-center font-semibold text-sm border">
                        {day}
                      </div>
                    ))}

                    {HOURS.map((hour) => (
                      <React.Fragment key={hour}>
                        <div className="bg-gray-50 p-2 text-center text-sm font-medium border">
                          {hour}:00 - {hour + 1}:00
                        </div>
                        {DAYS.map((day, dayIndex) => (
                          <CalendarCell
                            key={`${day}-${hour}`}
                            day={dayIndex}
                            hour={hour}
                            scheduledCourses={scheduledCourses}
                            onDrop={handleDrop}
                            onRemove={handleRemove}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default DisponibilidadForm;