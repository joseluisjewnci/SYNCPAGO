from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario_schema import UsuarioRegistro

from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

@router.post("/register")
def register(usuario: UsuarioRegistro):

    db: Session = SessionLocal()

    usuario_existente = db.query(Usuario).filter(
        Usuario.correo == usuario.correo
    ).first()

    if usuario_existente:

        return {
            "mensaje": "El correo ya existe"
        }

    password_hash = pwd_context.hash(
        usuario.password
    )

    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        password_hash=password_hash
    )

    db.add(nuevo_usuario)

    db.commit()

    db.refresh(nuevo_usuario)

    return {
        "mensaje": "Usuario registrado correctamente"
    }