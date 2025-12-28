import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from jinja2 import Template
from pathlib import Path


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_email = os.getenv("SMTP_EMAIL")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_name = os.getenv("SMTP_FROM_NAME", "Espacio Impro")
        
        # Rutas
        self.templates_dir = Path(__file__).parent / "email_templates"
        self.logo_path = Path(__file__).parent.parent / "images" / "logo.png"

    async def send_contact_form_email(self, nombre: str, email_remitente: str, mensaje: str):
        """Envía dos correos: uno al usuario y otro al admin"""
        try:
            # Email HTML para el usuario
            html_usuario = self._render_template("contacto_usuario.html", nombre=nombre, mensaje=mensaje)
            # Email HTML para el admin
            html_admin = self._render_template("contacto_admin.html", nombre=nombre, email=email_remitente, mensaje=mensaje)

            # Enviar email al usuario
            await self._send_email(
                to_email=email_remitente,
                subject="Hemos recibido tu mensaje - Espacio Impro Cusco",
                html_content=html_usuario
            )

            # Enviar email al admin CON reply_to al email del usuario
            await self._send_email(
                to_email=self.smtp_email,
                subject=f"Nuevo mensaje de contacto de {nombre}",
                html_content=html_admin,
                reply_to=email_remitente
            )

            return {"ok": True, "mensaje": "Correos enviados correctamente"}

        except Exception as e:
            raise Exception(f"Error al enviar correos: {str(e)}")

    async def _send_email(self, to_email: str, subject: str, html_content: str, reply_to: str = None):
        """Envía un correo SMTP con logo adjunto"""
        async with aiosmtplib.SMTP(hostname=self.smtp_host, port=self.smtp_port) as smtp:
            await smtp.login(self.smtp_email, self.smtp_password)

            # Crear mensaje multipart
            msg = MIMEMultipart("related")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.smtp_email}>"
            msg["To"] = to_email
            
            # Agregar Reply-To si se proporciona
            if reply_to:
                msg["Reply-To"] = reply_to

            # Agregar contenido HTML
            msg_alternative = MIMEMultipart("alternative")
            msg.attach(msg_alternative)
            msg_alternative.attach(MIMEText(html_content, "html"))

            # Agregar logo si existe
            if self.logo_path.exists():
                with open(self.logo_path, 'rb') as attachment:
                    img = MIMEImage(attachment.read(), name="logo.png")
                    img.add_header("Content-ID", "<logo>")
                    img.add_header("Content-Disposition", "inline", filename="logo.png")
                    msg.attach(img)

            await smtp.send_message(msg)

    def _render_template(self, template_name: str, **kwargs) -> str:
        """Carga y renderiza un template HTML"""
        template_path = self.templates_dir / template_name
        
        if not template_path.exists():
            raise FileNotFoundError(f"Template no encontrado: {template_path}")
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        return Template(template_content).render(**kwargs)


# Instancia global
email_service = EmailService()

