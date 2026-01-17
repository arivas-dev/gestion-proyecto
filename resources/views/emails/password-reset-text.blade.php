Restablecer Contraseña
======================

Hola {{ $userName }},

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Para restablecer tu contraseña, visita el siguiente enlace:

{{ $resetUrl }}

Este enlace expirará en 60 minutos por razones de seguridad.

Si no solicitaste restablecer tu contraseña, ignora este correo. 
Tu contraseña permanecerá sin cambios.

---
{{ config('app.name') }}
Este es un correo automático, por favor no respondas.
© {{ date('Y') }} Todos los derechos reservados.
