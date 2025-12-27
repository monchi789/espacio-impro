import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic() 

# Credenciales 
ADMIN_USER = "admin"
ADMIN_PASSWORD = "password123"

def get_current_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """
    Verifica usuario y contraseña de forma segura.
    Se usa como dependencia en rutas que quieras proteger.
    """
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USER)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
