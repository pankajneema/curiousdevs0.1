import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from decouple import config
from typing import Optional

SMTP_SERVER = config("SMTP_SERVER", default="smtp.gmail.com")
SMTP_PORT = int(config("SMTP_PORT", default=587))
SMTP_EMAIL = config("SMTP_EMAIL", default="")
SMTP_PASSWORD = config("SMTP_PASSWORD", default="")
ADMIN_EMAIL = config("ADMIN_EMAIL", default=SMTP_EMAIL)

async def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    """Send email notification"""
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"[EMAIL] Would send to {to_email}: {subject}")
        return False
    
    try:
        print(SMTP_EMAIL, SMTP_PASSWORD, SMTP_SERVER, SMTP_PORT)
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        text = msg.as_string()
        print(text)
        server.sendmail(SMTP_EMAIL, to_email, text)
        print("Email sent successfully")
        server.quit()
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {str(e)}")
        return False

async def send_lead_notification(lead_data: dict):
    """Send email notification when a new lead is created"""
    subject = f"New Lead: {lead_data.get('name', 'Unknown')}"
    
    body = f"""
    <html>
    <body>
        <h2>New Lead Received</h2>
        <p><strong>Name:</strong> {lead_data.get('name', 'N/A')}</p>
        <p><strong>Email:</strong> {lead_data.get('email', 'N/A')}</p>
        <p><strong>Mobile:</strong> {lead_data.get('mobile', 'N/A')}</p>
        <p><strong>Project:</strong> {lead_data.get('project', 'N/A')}</p>
        <p><strong>Project Type:</strong> {lead_data.get('project_type', 'N/A')}</p>
        <p><strong>Project Details:</strong> {lead_data.get('project_details', 'N/A')}</p>
        <hr>
        <p><em>Please contact this lead as soon as possible.</em></p>
    </body>
    </html>
    """
    
    await send_email(ADMIN_EMAIL, subject, body, is_html=True)

