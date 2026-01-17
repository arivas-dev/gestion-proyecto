<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e9ecef;
        }
        
        .email-header {
            background-color: #568EA3;
            padding: 32px 40px;
            text-align: center;
            color: #ffffff;
            border-bottom: 3px solid #4a7a8d;
        }
        
        .email-header h1 {
            font-size: 24px;
            font-weight: 500;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        
        .lock-icon {
            width: 56px;
            height: 56px;
            background-color: #ffffff;
            border-radius: 50%;
            display: inline-block;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            line-height: 56px;
            text-align: center;
            margin-bottom: 16px;
        }
        
        .email-body {
            padding: 48px 40px;
            color: #333333;
        }
        
        .greeting {
            font-size: 16px;
            color: #568EA3;
            margin-bottom: 24px;
            font-weight: 500;
        }
        
        .message {
            font-size: 15px;
            color: #555555;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .reset-button {
            display: inline-block;
            padding: 16px 48px;
            background-color: #568EA3;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 500;
            transition: background-color 0.2s;
            letter-spacing: 0.3px;
        }
        
        .reset-button:hover {
            background-color: #4a7a8d;
        }
        
        .divider {
            height: 1px;
            background-color: #e9ecef;
            margin: 32px 0;
        }
        
        .expiry-notice {
            background-color: #f0f7f9;
            border-left: 3px solid #568EA3;
            padding: 16px 20px;
            margin: 32px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #495057;
        }
        
        .alternative-link {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid #e9ecef;
        }
        
        .alternative-link p {
            font-size: 13px;
            color: #6c757d;
            margin-bottom: 12px;
        }
        
        .link-text {
            font-size: 12px;
            color: #495057;
            word-break: break-all;
            background-color: #f8f9fa;
            padding: 14px 16px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
            font-family: 'Courier New', monospace;
        }
        
        .email-footer {
            background-color: #f8f9fa;
            padding: 32px 40px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        
        .email-footer p {
            margin: 6px 0;
        }
        
        .security-notice {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid #e9ecef;
            font-size: 13px;
            color: #6c757d;
            line-height: 1.6;
        }
        
        @media only screen and (max-width: 600px) {
            body {
                padding: 20px 10px;
            }
            
            .email-header {
                padding: 36px 24px;
            }
            
            .email-body {
                padding: 36px 24px;
            }
            
            .email-footer {
                padding: 24px;
            }
            
            .email-header h1 {
                font-size: 20px;
            }
            
            .reset-button {
                padding: 14px 36px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <center>
                <div class="lock-icon">🔒</div>
            </center>
            <h1>Restablecer Contraseña</h1>
        </div>
        
        <div class="email-body">
            <p class="greeting">Hola,</p>
            
            <p class="message">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
                Si fuiste tú quien realizó esta solicitud, haz clic en el siguiente botón para continuar.
            </p>
            
            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">Restablecer Contraseña</a>
            </div>
            
            <div class="expiry-notice">
                Este enlace de seguridad expirará en <strong>60 minutos</strong>.
            </div>
            
            <div class="divider"></div>
            
            <div class="security-notice">
                <strong>Nota de seguridad:</strong> Si no solicitaste restablecer tu contraseña, 
                ignora este correo. Tu cuenta permanece segura y no se realizará ningún cambio.
            </div>
        </div>
        
        <div class="email-footer">
            <p style="font-weight: 500; color: #495057; margin-bottom: 8px;">{{ config('app.name') }}</p>
            <p>Este es un mensaje automático, por favor no responder.</p>
            <p style="margin-top: 16px; font-size: 12px;">© {{ date('Y') }} Todos los derechos reservados</p>
        </div>
    </div>
</body>
</html>
