"use client";

import React, { useState, useEffect } from 'react';
import { Clock, User, GraduationCap, Save, AlertCircle } from 'lucide-react';
import type { User as UserType, UserRole, DiaSemana } from '@/lib/types';
import { getCurrentUser } from '@/lib/data';

interface DisponibilidadDia {
  start: string;
  end: string;
  enabled: boolean;
}

interface DisponibilidadSemanal {
  lunes: DisponibilidadDia;
  martes: DisponibilidadDia;
  miercoles: DisponibilidadDia;
  jueves: DisponibilidadDia;
  viernes: DisponibilidadDia;
  sabado: DisponibilidadDia;
  domingo: DisponibilidadDia;
}

const DisponibilidadForm: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [availability, setAvailability] = useState<DisponibilidadSemanal>({
    lunes: { start: '08:00', end: '10:00', enabled: false },
    martes: { start: '08:00', end: '10:00', enabled: false },
    miercoles: { start: '08:00', end: '10:00', enabled: false },
    jueves: { start: '08:00', end: '10:00', enabled: false },
    viernes: { start: '08:00', end: '10:00', enabled: false },
    sabado: { start: '08:00', end: '10:00', enabled: false },
    domingo: { start: '08:00', end: '10:00', enabled: false }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const daysLabels: Record<DiaSemana | 'domingo', string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  const dayOrder: (DiaSemana | 'domingo')[] = [
    'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
  ];

  // Generar opciones de horas (8:00 AM - 10:00 PM)
  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    for (let hour = 8; hour <= 22; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      options.push(time24);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Cargar usuario actual y sus datos de disponibilidad
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const user = getCurrentUser();
        setCurrentUser(user);

        if (user) {
          // Cargar disponibilidad existente del usuario
          await loadAvailabilityFromServer(user.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Función para cargar disponibilidad del servidor (placeholder)
  const loadAvailabilityFromServer = async (id: string): Promise<void> => {
    // TODO: Implementar llamada al API
    /*
    try {
      const response = await fetch(`/api/availability/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
    */
  };

  // Función para guardar en el servidor
  const saveAvailabilityToServer = async (data: DisponibilidadSemanal): Promise<void> => {
    if (!currentUser) return;

    // TODO: Implementar llamada al API
    /*
    try {
      const response = await fetch(`/api/availability/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          availability: data,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error saving availability');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      throw error;
    }
    */
  };

  const handleTimeChange = (day: DiaSemana | 'domingo', type: 'start' | 'end', value: string): void => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
    setHasChanges(true);
  };

  const handleDayToggle = (day: DiaSemana | 'domingo'): void => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // Guardar disponibilidad en servidor
      await saveAvailabilityToServer(availability);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving availability:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime12 = (time24: string): string => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${hour12}:${minute} ${ampm}`;
  };

  const getCalendarHours = (): number[] => {
    const hours: number[] = [];
    for (let i = 8; i <= 22; i++) {
      hours.push(i);
    }
    return hours;
  };

  const isTimeInRange = (day: DiaSemana | 'domingo', hour: number): boolean => {
    if (!availability[day].enabled) return false;
    const startHour = parseInt(availability[day].start.split(':')[0]);
    const endHour = parseInt(availability[day].end.split(':')[0]);
    return hour >= startHour && hour < endHour;
  };

  // Determinar configuración basada en el rol
  const getRoleConfig = (role: UserRole) => {
    const configs = {
      alumno: {
        title: 'Disponibilidad de Estudiante',
        subtitle: 'Define tus horas libres para evaluaciones y recuperaciones',
        icon: <GraduationCap className="w-5 h-5" />,
        saveText: 'Guardar Disponibilidad',
        editable: true,
        showSemesterNote: false
      },
      docente: {
        title: 'Disponibilidad de Profesor',
        subtitle: 'Define tus horas laborales para asignación de secciones',
        icon: <User className="w-5 h-5" />,
        saveText: 'Confirmar Horario Laboral',
        editable: true, // Aquí puedes agregar lógica para determinar si es editable según el ciclo
        showSemesterNote: true
      }
    };
    return configs[role];
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando disponibilidad...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Usuario no encontrado
          </div>
        </div>
      </div>
    );
  }

  const config = getRoleConfig(currentUser.role);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {config.icon}
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        </div>
        <p className="text-gray-600">{config.subtitle}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <span>Usuario: {currentUser.nombre} {currentUser.apellido}</span>
          <span>•</span>
          <span>Código: {currentUser.codigo}</span>
          {currentUser.role === 'alumno' && currentUser.semestre && (
            <>
              <span>•</span>
              <span>Ciclo: {currentUser.semestre}</span>
            </>
          )}
        </div>
        
        {config.showSemesterNote && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> La disponibilidad solo puede editarse al inicio del ciclo.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Panel de Configuración de Horarios */}
        <div className="w-1/2">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Configurar Horarios
            </h2>
            
            <div className="space-y-4">
              {dayOrder.map(day => (
                <div key={day} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={availability[day].enabled}
                        onChange={() => handleDayToggle(day)}
                        disabled={!config.editable}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="font-medium text-gray-900">{daysLabels[day]}</span>
                    </label>
                  </div>
                  
                  {availability[day].enabled && (
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Desde
                        </label>
                        <select
                          value={availability[day].start}
                          onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                          disabled={!config.editable}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>
                              {formatTime12(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hasta
                        </label>
                        <select
                          value={availability[day].end}
                          onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                          disabled={!config.editable}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                        >
                          {timeOptions.filter(time => time > availability[day].start).map(time => (
                            <option key={time} value={time}>
                              {formatTime12(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {config.editable && (
              <button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : config.saveText}
              </button>
            )}
          </div>
        </div>

        {/* Vista del Calendario Semanal */}
        <div className="w-2/3">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Vista Previa - Semana</h2>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header de días */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-2 text-xs font-medium text-gray-500 bg-gray-50">Hora</div>
                {dayOrder.map(day => (
                  <div key={day} className="p-2 text-xs font-medium text-center text-gray-700 bg-gray-50 border-l border-gray-200">
                    {daysLabels[day].substring(0, 3)}
                  </div>
                ))}
              </div>

              {/* Grid de horas */}
              <div className="max-h-96 overflow-y-auto">
                {getCalendarHours().map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200">
                      {formatTime12(`${hour}:00`)}
                    </div>
                    {dayOrder.map(day => (
                      <div key={`${day}-${hour}`} className="border-l border-gray-200 h-8 relative">
                        {isTimeInRange(day, hour) && (
                          <div className="absolute inset-0 bg-blue-200 border border-blue-300 m-0.5 rounded-sm">
                            <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-80 rounded-sm"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm"></div>
                <span className="text-gray-600">Horas disponibles</span>
              </div>
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Cambios sin guardar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisponibilidadForm;