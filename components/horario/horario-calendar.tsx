"use client"

import React, {useState} from "react";
import { getCurrentUser, getSemestreActual } from "@/lib/data";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const daysOfWeek = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const hours = Array.from({ length: 16 }, (_, i) => `${8 + i}:00`);

interface Schedule {
  id: string;
  course: string;
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
  startDate: string;
  endDate: string;
  type: string;
}

export function HorarioCalendar() {
  const user = getCurrentUser();
  const semestre = getSemestreActual();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Schedule, 'id'>>({
    course: '',
    day: '',
    startTime: '',
    endTime: '',
    classroom: '',
    startDate: '',
    endDate: '',
    type: ''
  });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(month, year);
  const today = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      startDate: date.toISOString().slice(0, 10),
      endDate: date.toISOString().slice(0, 10)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Schedule) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course || !formData.day || !formData.startTime || !formData.endTime || !formData.startDate || !formData.endDate) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      ...formData
    };

    setSchedules(prev => [...prev, newSchedule]);
    setFormData({
      course: '',
      day: '',
      startTime: '',
      endTime: '',
      classroom: '',
      startDate: '',
      endDate: '',
      type: ''
    });
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    setSelectedSchedule(null);
  };

  const renderMonthView = () => {
    const cells = [];
    const totalCells = 42;
    const todayDate = new Date();
    
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDay + 1;
      const isCurrentMonth = dayNum > 0 && dayNum <= totalDays;
      const date = new Date(year, month, dayNum);
      const dateString = date.toISOString().slice(0, 10);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = todayDate.toDateString() === date.toDateString();
      
      // Find schedules that start or end on this exact date
      const startDateSchedules = schedules.filter(s => s.startDate === dateString);
      const endDateSchedules = schedules.filter(s => s.endDate === dateString);
      
      // Combine and remove duplicates
      const allSchedules = [...startDateSchedules, ...endDateSchedules].filter(
        (schedule, index, self) => index === self.findIndex(s => s.id === schedule.id)
      );

      // Determine if this is a start or end date for each schedule
      const scheduleLabels = allSchedules.map(schedule => {
        const isStart = schedule.startDate === dateString;
        const isEnd = schedule.endDate === dateString;
        
        let label = schedule.course;
        if (isStart && isEnd) {
          label = `${schedule.course} (Inicio/Fin)`;
        } else if (isStart) {
          label = `${schedule.course} (Inicio)`;
        } else if (isEnd) {
          label = `${schedule.course} (Fin)`;
        }
        
        return {
          label,
          schedule
        };
      });

      cells.push(
        <div
          key={i}
          className={`border h-20 flex flex-col items-center justify-start cursor-pointer transition-all 
            ${isSelected ? "border-black" : "hover:bg-gray-100"}
            ${isToday ? "bg-blue-100 text-blue-800 font-semibold" : ""}
            `}
          onClick={() => isCurrentMonth && handleDateClick(dayNum)}
        >
          <span className="mt-1 text-sm">{isCurrentMonth ? dayNum : ""}</span>
          {isCurrentMonth && scheduleLabels.length > 0 && (
            <div className="w-full px-1 mt-1 overflow-y-auto max-h-12">
              {scheduleLabels.map(({label, schedule}, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs truncate rounded px-1 my-1 text-center ${
                    schedule.startDate === dateString ? 'bg-green-100' : 
                    schedule.endDate === dateString ? 'bg-purple-100' : 'bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSchedule(schedule.id);
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid border">
        <div className="grid grid-cols-7 text-center font-medium">
          {daysOfWeek.map(day => <div key={day} className="border border-gray-300 p-2 bg-gray-100">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date,
        label: `${daysOfWeek[date.getDay()]} ${date.getDate()}`,
        key: date.toISOString(),
        dayName: daysOfWeek[date.getDay()],
      };
    });

    const weekSchedules = schedules.filter(s => {
      const startDate = new Date(s.startDate);
      const endDate = new Date(s.endDate);
      return weekDays.some(day => day.date >= startDate && day.date <= endDate);
    });

    const timeSlotGroups: Record<string, Schedule[]> = {};

    weekSchedules.forEach(schedule => {
      const timeKey = `${schedule.day}-${schedule.startTime}-${schedule.endTime}`;
      if (!timeSlotGroups[timeKey]) {
        timeSlotGroups[timeKey] = [];
      }
      timeSlotGroups[timeKey].push(schedule);
    });

    return (
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border mt-2">
        <div className="bg-gray-100 p-1 text-sm text-center font-medium">Hora</div>
        {weekDays.map(day => {
          const isToday = new Date().toDateString() === day.date.toDateString();
          return (
            <div
              key={day.key}
              className={`p-1 text-sm text-center font-medium border-l 
                ${isToday ? "bg-blue-100 text-blue-800 font-semibold" : "bg-gray-100"}`}
            >
              {day.label}
            </div>
          );
        })}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="border-t text-xs text-center content-center p-1">{hour}</div>
            {weekDays.map((day, idx) => {
              const hourSchedules = weekSchedules.filter(s => {
                const startHour = parseInt(s.startTime.split(':')[0]);
                const endHour = parseInt(s.endTime.split(':')[0]);
                const currentHour = parseInt(hour.split(':')[0]);
                return (
                  s.day === day.dayName && 
                  currentHour >= startHour && 
                  currentHour < endHour
                );
              });

              const groupedSchedules: Record<string, Schedule[]> = {};
              hourSchedules.forEach(schedule => {
                const key = `${schedule.startTime}-${schedule.endTime}`;
                if (!groupedSchedules[key]) {
                  groupedSchedules[key] = [];
                }
                groupedSchedules[key].push(schedule);
              });

              return (
                <div 
                  key={`${hour}-${idx}`} 
                  className={`border-t border-l h-12 hover:bg-gray-50 relative ${
                    hourSchedules.length > 0 ? 'bg-green-100' : ''
                  }`}
                >
                  {Object.entries(groupedSchedules).map(([timeSlot, schedulesInSlot], i) => (
                    <div 
                      key={i}
                      className="absolute inset-0 p-1 text-xs overflow-hidden flex flex-col"
                      style={{
                        height: `${100 / Object.keys(groupedSchedules).length}%`,
                        top: `${(i * 100) / Object.keys(groupedSchedules).length}%`
                      }}
                    >
                      {schedulesInSlot.map((schedule, j) => (
                        <div 
                          key={j}
                          className="flex justify-between items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchedule(schedule.id);
                          }}
                        >
                          <span className="truncate">{schedule.course} - {schedule.classroom}</span>
                          {selectedSchedule === schedule.id && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSchedule(schedule.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const isToday = new Date().toDateString() === currentDate.toDateString();
    const day = `${daysOfWeek[currentDate.getDay()]} ${currentDate.getDate()}`;
    const dayName = daysOfWeek[currentDate.getDay()];
    
    const daySchedules = schedules.filter(s => {
      const startDate = new Date(s.startDate);
      const endDate = new Date(s.endDate);
      return (
        s.day === dayName && 
        currentDate >= startDate && 
        currentDate <= endDate
      );
    });

    const timeSlotGroups: Record<string, Schedule[]> = {};

    daySchedules.forEach(schedule => {
      const timeKey = `${schedule.startTime}-${schedule.endTime}`;
      if (!timeSlotGroups[timeKey]) {
        timeSlotGroups[timeKey] = [];
      }
      timeSlotGroups[timeKey].push(schedule);
    });

    return (
      <div className="grid grid-cols-[80px_1fr] border mt-2">
        <div className="bg-gray-100 p-1 text-sm text-center font-medium border-b">Hora</div>
        <div className={`p-1 text-sm text-center font-medium border-b 
          ${isToday ? "bg-blue-100 text-blue-800 font-semibold" : "bg-gray-100"}`}>
          {day}
        </div>
        {hours.map(hour => {
          const hourSchedules = daySchedules.filter(s => {
            const startHour = parseInt(s.startTime.split(':')[0]);
            const endHour = parseInt(s.endTime.split(':')[0]);
            const currentHour = parseInt(hour.split(':')[0]);
            return currentHour >= startHour && currentHour < endHour;
          });

          const groupedSchedules: Record<string, Schedule[]> = {};
          hourSchedules.forEach(schedule => {
            const key = `${schedule.startTime}-${schedule.endTime}`;
            if (!groupedSchedules[key]) {
              groupedSchedules[key] = [];
            }
            groupedSchedules[key].push(schedule);
          });

          return (
            <React.Fragment key={hour}>
              <div className="border-t text-xs text-center content-center p-1">{hour}</div>
              <div className={`border-t border-l h-12 hover:bg-gray-50 relative ${
                hourSchedules.length > 0 ? 'bg-green-100' : ''
              }`}>
                {Object.entries(groupedSchedules).map(([timeSlot, schedulesInSlot], i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 p-1 text-xs overflow-hidden flex flex-col"
                    style={{
                      height: `${100 / Object.keys(groupedSchedules).length}%`,
                      top: `${(i * 100) / Object.keys(groupedSchedules).length}%`
                    }}
                  >
                    {schedulesInSlot.map((schedule, j) => (
                      <div 
                        key={j}
                        className="flex justify-between items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchedule(schedule.id);
                        }}
                      >
                        <span className="truncate">{schedule.course} - {schedule.classroom}</span>
                        {selectedSchedule === schedule.id && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSchedule(schedule.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Horario</h1>
          <p className="text-muted-foreground">
            Ciclo {semestre} - {user.role === "alumno" ? "Horario Académico" : "Horario de Clases"}
          </p>
        </div>
      </div>
      <div className="flex p-6 gap-4">
        <Card className="p-4 w-3/4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
            <div className="flex gap-2">
              <Button size="sm" variant={view === 'month' ? "default" : "outline"} onClick={() => setView('month')}>Mes</Button>
              <Button size="sm" variant={view === 'week' ? "default" : "outline"} onClick={() => setView('week')}>Semana</Button>
              <Button size="sm" variant={view === 'day' ? "default" : "outline"} onClick={() => setView('day')}>Día</Button>
              <Button size="sm" variant="ghost" onClick={goToPrevious}><ChevronLeft size={16} /></Button>
              <Button size="sm" variant="ghost" onClick={goToNext}><ChevronRight size={16} /></Button>
              <Button size="icon" className="rounded-full w-10 h-10" onClick={today}>Hoy</Button>
            </div>
          </div>

          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </Card>
      
        <Card className="p-4 w-1/4 space-y-4">
          <h3 className="text-lg font-semibold">Crear Nuevo Horario</h3>

          <Select onValueChange={handleSelectChange('course')} value={formData.course}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curso1">Curso 1</SelectItem>
              <SelectItem value="curso2">Curso 2</SelectItem>
              <SelectItem value="curso3">Curso 3</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={handleSelectChange('day')} value={formData.day}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.slice(1).map((day, idx) => (
                <SelectItem key={idx} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select onValueChange={handleSelectChange('startTime')} value={formData.startTime}>
              <SelectTrigger>
                <SelectValue placeholder="Inicio" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour, idx) => (
                  <SelectItem key={idx} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleSelectChange('endTime')} value={formData.endTime}>
              <SelectTrigger>
                <SelectValue placeholder="Fin" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour, idx) => (
                  <SelectItem key={idx} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input 
            placeholder="¿Cual es el aula?" 
            name="classroom"
            value={formData.classroom}
            onChange={handleInputChange}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Fecha de inicio</label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Fecha de cierre</label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <Select onValueChange={handleSelectChange('type')} value={formData.type}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teoria">Teoría</SelectItem>
              <SelectItem value="laboratorio">Laboratorio</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setFormData({
                course: '',
                day: '',
                startTime: '',
                endTime: '',
                classroom: '',
                startDate: '',
                endDate: '',
                type: ''
              })}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSubmit}
            >
              Crear
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}