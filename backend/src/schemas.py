from pydantic import BaseModel, EmailStr
from typing import List, Optional

# Schema for Contact Form
class ContactoFormulario(BaseModel):
    nombre: str
    email: EmailStr
    mensaje: str

# Schema for Input Data
class EquipoBase(BaseModel):
    nombre: str
    color: str


class EventoCrear(BaseModel):
    nombre: str
    equipos: List[EquipoBase]


# Schema for Output Data 
class EquipoSalida(EquipoBase):
    id: int
    votos: int

    class Config:
        from_attributes = True


class EventoSalida(BaseModel):
    id: int
    nombre: str
    en_vivo: bool
    ronda_actual: int
    equipos: List[EquipoSalida]

    class Config:
        from_attributes = True
