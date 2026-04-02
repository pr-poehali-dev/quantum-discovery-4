"""
Авторизация и регистрация пользователей системы ЭкоМонитор.
POST /register — регистрация
POST /login — вход
POST /logout — выход
GET /me — текущий пользователь
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    path = event.get("path", "/").rstrip("/").split("?")[0]
    method = event.get("httpMethod", "GET")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # action из body переопределяет path (для тестов и фронта через единый endpoint)
    action = body.get("action") or (event.get("queryStringParameters") or {}).get("action") or ""
    if action:
        path = f"/{action}"

    session_id = event.get("headers", {}).get("X-Session-Id", "")

    # --- GET /me ---
    if method == "GET" and path.endswith("/me"):
        if not session_id:
            return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Не авторизован"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT u.id, u.email, u.name, u.role FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON s.user_id = u.id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Сессия истекла"})}
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"id": row[0], "email": row[1], "name": row[2], "role": row[3]})}

    # --- POST /register ---
    if method == "POST" and path.endswith("/register"):
        email = (body.get("email") or "").strip().lower()
        name = (body.get("name") or "").strip()
        password = body.get("password") or ""
        if not email or not name or not password:
            return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"error": "Пароль минимум 6 символов"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": cors_headers(), "body": json.dumps({"error": "Email уже зарегистрирован"})}
        # Первый пользователь платформы становится администратором
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
        user_count = cur.fetchone()[0]
        role = "admin" if user_count == 0 else "user"
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, name, password_hash, role) VALUES (%s, %s, %s, %s) RETURNING id",
            (email, name, hash_password(password), role)
        )
        user_id = cur.fetchone()[0]
        sid = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)", (sid, user_id))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"sessionId": sid, "name": name, "email": email, "role": role})}

    # --- POST /login ---
    if method == "POST" and path.endswith("/login"):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        if not email or not password:
            return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"error": "Введите email и пароль"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, role FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s", (email, hash_password(password)))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Неверный email или пароль"})}
        user_id, name, role = row
        sid = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)", (sid, user_id))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"sessionId": sid, "name": name, "email": email, "role": role})}

    # --- POST /logout ---
    if method == "POST" and path.endswith("/logout"):
        if session_id:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}