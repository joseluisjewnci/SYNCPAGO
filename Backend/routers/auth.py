from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import SessionLocal
from models.usuario import Usuario

from schemas.usuario_schema import (
    UsuarioRegistro,
    UsuarioLogin
)

from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ==========================
# REGISTRO DE USUARIO
# ==========================

@router.post("/register")
def register(usuario: UsuarioRegistro):

    db: Session = SessionLocal()

    usuario_existente = db.query(Usuario).filter(
        Usuario.correo == usuario.correo
    ).first()

    if usuario_existente:

        db.close()

        return {
            "success": False,
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

    db.close()

    return {
        "success": True,
        "mensaje": "Usuario registrado correctamente"
    }


# ==========================
# LOGIN
# ==========================

@router.post("/login")
def login(usuario: UsuarioLogin):

    db: Session = SessionLocal()

    usuario_db = db.query(Usuario).filter(
        Usuario.correo == usuario.correo
    ).first()

    if not usuario_db:

        db.close()

        return {
            "success": False,
            "mensaje": "Correo o contraseña incorrectos"
        }

    password_correcta = pwd_context.verify(
        usuario.password,
        usuario_db.password_hash
    )

    if not password_correcta:

        db.close()

        return {
            "success": False,
            "mensaje": "Correo o contraseña incorrectos"
        }

    db.close()

    return {
        "success": True,
        "mensaje": "Login correcto",
        "usuario": {
            "nombre": usuario_db.nombre,
            "correo": usuario_db.correo
        }
    }