# Backend - Espacio Impro Cusco

## Descripción
Backend para el sistema de votación y contacto de Espacio Impro Cusco.

## Configuración Inicial

### Variables de Entorno (.env)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=ee.improcusco@gmail.com
SMTP_PASSWORD=rbno stxh sdje rsob
SMTP_FROM_NAME=Espacio Impro Cusco

FRONTEND_URL=https://espacioimprocusco.com
FRONTEND_URL_DEV=http://localhost:3000

ENVIRONMENT=production
```

### Para Gmail con 2FA
Si tienes autenticación de dos factores en Gmail:
1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Busca "Contraseñas de aplicación"
3. Genera una contraseña de aplicación para SMTP
4. Usa esa contraseña en `SMTP_PASSWORD`

## Estructura del Proyecto

```
src/
├── __init__.py
├── main.py              # Aplicación FastAPI principal
├── database.py          # Configuración de SQLAlchemy
├── models.py            # Modelos de BD
├── schemas.py           # Esquemas Pydantic
├── security.py          # Funciones de seguridad
├── managers.py          # Managers de WebSocket
├── email_service.py     # Servicio de SMTP
├── email_templates/     # Templates HTML para correos
│   ├── contacto_usuario.html
│   └── contacto_admin.html
└── routers/
    ├── admin.py         # Rutas administrativas
    ├── public.py        # Rutas públicas
    └── ws.py            # WebSocket
```

## Endpoints Públicos

### Votación Activa
**GET** `/api/votacion-activa`

Obtiene los datos de la votación en curso.

**Response:**
```json
{
  "estado": "activa",
  "socket_room_id": 1,
  "nombre": "Nombre del evento",
  "ronda": 1,
  "equipos": [
    {
      "id": 1,
      "nombre": "Equipo A",
      "color": "#FF5733",
      "votos": 0
    }
  ]
}
```

### Registrar Voto
**POST** `/api/votar/{equipo_id}`

Registra un voto para un equipo.

**Response:**
```json
{
  "ok": true
}
```

---

## Endpoint de Contacto

### POST `/api/contacto`

**Descripción:** Envía un formulario de contacto que genera dos correos:
1. Un correo de confirmación para el usuario que envía el mensaje
2. Un correo de notificación para el administrador

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "mensaje": "Tengo una pregunta sobre los eventos..."
}
```

**Response (Success):**
```json
{
  "ok": true,
  "mensaje": "Correos enviados correctamente"
}
```

**Response (Error):**
```json
{
  "detail": "Error al enviar el correo: [error message]"
}
```

### Emails Enviados

#### Correo para el Usuario
- Asunto: "Hemos recibido tu mensaje - Espacio Impro Cusco"
- Diseño limpio y profesional con gradiente
- Muestra confirmación de recepción del mensaje
- Incluye el mensaje enviado para referencia

#### Correo para el Administrador
- Asunto: "Nuevo mensaje de contacto de [Nombre Usuario]"
- Alertas visuales destacando nuevo mensaje
- Información completa del remitente
- Mensaje con formato preservado

### Ejemplo de Uso con Fetch

```javascript
const enviarContacto = async (nombre, email, mensaje) => {
  try {
    const response = await fetch('https://espacioimprocusco.com/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        email,
        mensaje
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Correo enviado:', data);
      alert('Tu mensaje ha sido enviado correctamente');
    } else {
      console.error('Error:', response.statusText);
      alert('Hubo un error al enviar tu mensaje');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};
```

---

## CORS Configuration

El servidor está configurado para aceptar solicitudes desde:

**Producción:**
- https://espacioimprocusco.com

**Desarrollo:**
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:5173 (Vite)
- http://127.0.0.1:5173

Puedes modificar estos valores en `src/main.py` o usando variables de entorno.

---

## Seguridad

✅ Validación de emails con `email-validator`
✅ Variables de entorno para credenciales sensibles
✅ CORS configurado por dominio
✅ Contraseñas de aplicación Gmail (más seguro que contraseña de cuenta)

---

## Instalación y Ejecución

### Crear entorno virtual
```bash
python -m venv .venv
source .venv/bin/activate
```

### Instalar dependencias
```bash
pip install -r requirements.txt
```

O si usas Poetry:
```bash
poetry install
```

### Ejecutar servidor
```bash
python -m src.main
```

O con Poetry:
```bash
poetry run start
```

El servidor estará disponible en `http://localhost:8000`
Documentación interactiva en `http://localhost:8000/docs`

---

## Mejoras Futuras

- [ ] Rate limiting para prevenir spam
- [ ] Verificación CAPTCHA
- [ ] Guardado de mensajes en base de datos
- [ ] Sistema de tickets
- [ ] Confirmación de email (verificación de cuenta)
- [ ] Soporte para archivos adjuntos
