"use client"

import React, { useState, useMemo } from 'react';
import { Check, Clock, User, BookOpen, Calendar, X } from 'lucide-react';
import { cursosDisponibles as rawCursosDisponibles } from '@/lib/data'; 

const cursosDisponibles: Curso[] = rawCursosDisponibles.map((curso: any) => ({
  ...curso,
  secciones: curso.secciones.map((seccion: any) => ({
    ...seccion,
    horario: seccion.horario.map((h: any) => ({
      ...h,
      dia: h.dia as DiaSemana,
    })),
  })),
}));

type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado";

interface HorarioClase {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  aula: string;
  tipo: 'teoria' | 'laboratorio';
}

interface Seccion {
  id: string;
  cursoId: string;
  numero: number;
  profesorId: string;
  profesorNombre: string;
  horario: HorarioClase[];
  capacidad: number;
  matriculados: number;
}

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  ciclo: number;
  prerequisitos?: string[];
  secciones: Seccion[];
}

const MatriculaContent = () => {

  const [cursosSeleccionados, setCursosSeleccionados] = useState<{[cursoId: string]: string}>({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);
  const [seccionPendiente, setSeccionPendiente] = useState<{cursoId: string, seccionId: string} | null>(null);

  // ordenar cursos: seleccionados primero
  const cursosOrdenados = useMemo(() => {
    return [...cursosDisponibles].sort((a, b) => {
      const aSeleccionado = cursosSeleccionados[a.id] ? 1 : 0;
      const bSeleccionado = cursosSeleccionados[b.id] ? 1 : 0;
      return bSeleccionado - aSeleccionado;
    });
  }, [cursosSeleccionados]);

  const formatearHorario = (horario: HorarioClase[]) => {
    const dias = horario.map(h => h.dia.charAt(0).toUpperCase()).join(',');
    const horas = horario.length > 0 ? `${horario[0].horaInicio}-${horario[horario.length-1].horaFin}` : '';
    return `${dias} ${horas}`;
  };

  const calcularHorasTotal = (horario: HorarioClase[]) => {
    return horario.reduce((total, h) => {
      const inicio = parseInt(h.horaInicio.split(':')[0]);
      const fin = parseInt(h.horaFin.split(':')[0]);
      return total + (fin - inicio);
    }, 0);
  };

  const handleCursoClick = (cursoId: string) => {
    setCursoSeleccionado(cursoId);
  };

  const handleSeccionSelect = (cursoId: string, seccionId: string) => {
    setSeccionPendiente({cursoId, seccionId});
  };

  const confirmarSeccion = () => {
    if (seccionPendiente) {
      setCursosSeleccionados(prev => ({
        ...prev,
        [seccionPendiente.cursoId]: seccionPendiente.seccionId
      }));
      setSeccionPendiente(null);
    }
  };

  const cancelarSeccion = () => {
    setSeccionPendiente(null);
  };

  const deseleccionarCurso = (cursoId: string) => {
    setCursosSeleccionados(prev => {
      const nuevo = {...prev};
      delete nuevo[cursoId];
      return nuevo;
    });
  };

  const generarHorarioAutomatico = async () => {
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch('/api/generar-horario', { method: 'POST' });
      // const { seccionesSeleccionadas } = await response.json();
      
      // simulación de respuesta del backend con IDs de secciones aaaaa
      const seccionesDelBackend = ['1', '4', '6', '11']; // IDs: 1, 2, 3, 4
      
      // aplica las selecciones del algoritmo
      aplicarSeleccionesAutomaticas(seccionesDelBackend);
      
    } catch (error) {
      console.error('Error generando horario automático:', error);
    }
  };

  const aplicarSeleccionesAutomaticas = (seccionesIds: string[]) => {
    const nuevasSelecciones: {[cursoId: string]: string} = {};
    
    // mapea cada sección ID a su curso correspondiente
    seccionesIds.forEach(seccionId => {
      const cursoConSeccion = cursosDisponibles.find(curso => 
        curso.secciones.some(seccion => seccion.id === seccionId)
      );
      
      if (cursoConSeccion) {
        nuevasSelecciones[cursoConSeccion.id] = seccionId;
      }
    });
    
    setCursosSeleccionados(nuevasSelecciones); // actualiza el estado con las nuevas selecciones
    
    console.log('Horario automático generado:', nuevasSelecciones);
  };

  const ejecutarMatricula = () => {
    // todo: logica y pequeño modal de confirmacion + f5
    console.log('Ejecutando matrícula con cursos:', cursosSeleccionados);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel Izquierdo - Lista de Cursos */}
      <div className="w-1/2 p-6 border-r bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cursos Disponibles</h2>
          <p className="text-gray-600">Selecciona los cursos para tu matrícula</p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {cursosOrdenados.map((curso) => {
            const isSelected = cursosSeleccionados[curso.id];
            const seccionSeleccionada = isSelected ? curso.secciones.find(s => s.id === isSelected) : null;
            
            return (
              <div
                key={curso.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleCursoClick(curso.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div className="text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          Ciclo {curso.ciclo}
                        </span>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-800">{curso.codigo}</div>
                        <div className="text-sm text-gray-600">{curso.nombre}</div>
                      </div>
                      
                      <div className="text-center">
                        {seccionSeleccionada ? (
                          <span className="text-sm font-medium">Sección {seccionSeleccionada.numero}</span>
                        ) : (
                          <span className="text-sm text-gray-500">{curso.secciones.length} secciones</span>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        {seccionSeleccionada ? (
                          <div>
                            <User className="w-4 h-4 inline mr-1" />
                            {seccionSeleccionada.profesorNombre}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                      
                      <div className="text-center">
                        {seccionSeleccionada ? (
                          <div className="text-sm">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {calcularHorasTotal(seccionSeleccionada.horario)}h/sem
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">{curso.creditos} créd.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <button
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        deseleccionarCurso(curso.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          {Object.keys(cursosSeleccionados).length > 0 && (
            <button
              onClick={() => setCursosSeleccionados({})}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <X className="w-4 h-4 inline mr-2" />
              Limpiar Selecciones
            </button>
          )}
          
          <button
            onClick={generarHorarioAutomatico}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={Object.keys(cursosSeleccionados).length > 0}
            title={Object.keys(cursosSeleccionados).length > 0 ? "Limpia las selecciones actuales primero" : "Generar horario óptimo automáticamente"}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Generar Horario Automático
          </button>
          
          <button
            onClick={ejecutarMatricula}
            disabled={Object.keys(cursosSeleccionados).length === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Ejecutar Matrícula ({Object.keys(cursosSeleccionados).length} cursos)
          </button>
        </div>
      </div>

      {/* Panel Derecho - Detalles del Curso */}
      <div className="w-1/2 p-6 bg-gray-50">
        {cursoSeleccionado ? (
          <div>
            {(() => {
              const curso = cursosDisponibles.find(c => c.id === cursoSeleccionado);
              if (!curso) return null;

              return (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800">{curso.codigo} - {curso.nombre}</h3>
                    <p className="text-gray-600">Ciclo {curso.ciclo} • {curso.creditos} créditos</p>
                  </div>

                  <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-semibold text-gray-800">Secciones Disponibles</h4>
                    </div>
                    
                    <div className="divide-y">
                      {curso.secciones.map((seccion) => (
                        <div
                          key={seccion.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            seccionPendiente?.seccionId === seccion.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => handleSeccionSelect(curso.id, seccion.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium">
                                Sección {seccion.numero}
                              </span>
                              <span className="text-sm text-gray-600">
                                {seccion.matriculados}/{seccion.capacidad} estudiantes
                              </span>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              seccion.matriculados >= seccion.capacidad 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {seccion.matriculados >= seccion.capacidad ? 'Lleno' : 'Disponible'}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            {seccion.profesorNombre}
                          </div>
                          
                          <div className="space-y-1">
                            {seccion.horario.map((horario, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex justify-between">
                                <span className="capitalize">
                                  {horario.dia} ({horario.tipo})
                                </span>
                                <span>{horario.horaInicio} - {horario.horaFin}</span>
                                <span className="text-blue-600">{horario.aula}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal de Confirmacion */}
                  {seccionPendiente && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmar Selección</h3>
                        <p className="text-gray-600 mb-6">
                          ¿Deseas matricularte en la Sección {
                            curso.secciones.find(s => s.id === seccionPendiente.seccionId)?.numero
                          } del curso {curso.codigo}?
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={confirmarSeccion}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={cancelarSeccion}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Selecciona un curso para ver sus secciones</p>
              <p className="text-sm">Haz clic en cualquier curso de la lista</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatriculaContent;