from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Usuario(Base):

    __tablename__ = "usuarios"

    id_usuario = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre = Column(String)

    correo = Column(
        String,
        unique=True
    )

    password_hash = Column(String)

    activo = Column(
        Boolean,
        default=True
    )