from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# Modelo para la tabla de eventos
class EventoDB(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    en_vivo = Column(Boolean, default=False)
    ronda_actual = Column(Integer, default=1)
    fecha_creacion = Column(DateTime, default=datetime.now)

    equipos = relationship("EquipoDB", back_populates="evento", cascade="all, delete-orphan")
    historial = relationship("HistorialDB", back_populates="evento")


# Modelo para la tabla de equipos
class EquipoDB(Base):
    __tablename__ = "equipos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    color = Column(String)
    votos = Column(Integer, default=0)
    evento_id = Column(Integer, ForeignKey("eventos.id"))

    evento = relationship("EventoDB", back_populates="equipos")


# Modelo para guardar el historial de votaciones
class HistorialDB(Base):
    __tablename__ = "historial"

    id = Column(Integer, primary_key=True, index=True)
    evento_id = Column(Integer, ForeignKey("eventos.id"))
    ronda = Column(Integer)
    resultados_json = Column(Text)
    fecha_registro = Column(DateTime, default=datetime.now)

    evento = relationship("EventoDB", back_populates="historial")
