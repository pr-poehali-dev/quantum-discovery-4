"""
Административный бэкенд системы ЭкоМонитор.
Все методы требуют заголовок X-Session-Id пользователя с ролью admin.

GET  /?action=stats            — общая статистика платформы
GET  /?action=users            — список пользователей
POST / {action:set_role}       — изменить роль пользователя
POST / {action:set_blocked}    — заблокировать/разблокировать пользователя
GET  /?action=points           — список точек мониторинга из БД
POST / {action:create_point}   — создать точку
POST / {action:update_point}   — обновить точку
POST / {action:delete_point}   — удалить точку
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    }


def resp(code, data):
    return {"statusCode": code, "headers": cors(), "body": json.dumps(data, ensure_ascii=False, default=str)}


def get_admin_user(session_id, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.role FROM {SCHEMA}.sessions s "
        f"JOIN {SCHEMA}.users u ON s.user_id = u.id "
        f"WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row or row[1] != "admin":
        return None
    return {"id": row[0], "role": row[1]}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    action = body.get("action") or qs.get("action") or ""
    session_id = event.get("headers", {}).get("X-Session-Id", "")

    conn = get_conn()

    admin = get_admin_user(session_id, conn)
    if not admin:
        conn.close()
        return resp(403, {"error": "Доступ запрещён. Требуется роль администратора."})

    # --- Статистика ---
    if action == "stats":
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
        total_users = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE blocked = TRUE")
        blocked_users = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE role = 'admin'")
        admin_users = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.sessions WHERE expires_at > NOW()")
        active_sessions = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.monitoring_points")
        db_points = cur.fetchone()[0]
        cur.execute(
            f"SELECT role, COUNT(*) FROM {SCHEMA}.users GROUP BY role"
        )
        roles = {row[0]: row[1] for row in cur.fetchall()}
        cur.execute(
            f"SELECT DATE(created_at), COUNT(*) FROM {SCHEMA}.users "
            f"WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY 1"
        )
        reg_chart = [{"date": str(r[0]), "count": r[1]} for r in cur.fetchall()]
        conn.close()
        return resp(200, {
            "total_users": total_users,
            "blocked_users": blocked_users,
            "admin_users": admin_users,
            "active_sessions": active_sessions,
            "db_points": db_points,
            "roles": roles,
            "reg_chart": reg_chart,
        })

    # --- Пользователи ---
    if action == "users":
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, email, name, role, blocked, created_at FROM {SCHEMA}.users ORDER BY id DESC"
        )
        rows = cur.fetchall()
        conn.close()
        return resp(200, {"users": [
            {"id": r[0], "email": r[1], "name": r[2], "role": r[3], "blocked": r[4], "created_at": str(r[5])}
            for r in rows
        ]})

    if action == "set_role":
        user_id = body.get("user_id")
        role = body.get("role")
        if not user_id or role not in ("user", "admin", "analyst"):
            conn.close()
            return resp(400, {"error": "Неверные параметры"})
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.users SET role = %s WHERE id = %s", (role, user_id))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "set_blocked":
        user_id = body.get("user_id")
        blocked = bool(body.get("blocked"))
        if not user_id:
            conn.close()
            return resp(400, {"error": "user_id обязателен"})
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.users SET blocked = %s WHERE id = %s", (blocked, user_id))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # --- Точки мониторинга ---
    if action == "points":
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, region, lat, lng, type, value, unit, status, created_at "
            f"FROM {SCHEMA}.monitoring_points ORDER BY id DESC"
        )
        rows = cur.fetchall()
        conn.close()
        return resp(200, {"points": [
            {"id": r[0], "name": r[1], "region": r[2], "lat": float(r[3]), "lng": float(r[4]),
             "type": r[5], "value": float(r[6]), "unit": r[7], "status": r[8], "created_at": str(r[9])}
            for r in rows
        ]})

    if action == "create_point":
        p = body
        required = ["name", "region", "lat", "lng", "type", "value", "unit", "status"]
        if not all(p.get(k) is not None for k in required):
            conn.close()
            return resp(400, {"error": "Заполните все поля"})
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.monitoring_points (name, region, lat, lng, type, value, unit, status) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (p["name"], p["region"], p["lat"], p["lng"], p["type"], p["value"], p["unit"], p["status"])
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "id": new_id})

    if action == "update_point":
        p = body
        if not p.get("id"):
            conn.close()
            return resp(400, {"error": "id обязателен"})
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.monitoring_points SET name=%s, region=%s, lat=%s, lng=%s, "
            f"type=%s, value=%s, unit=%s, status=%s, updated_at=NOW() WHERE id=%s",
            (p["name"], p["region"], p["lat"], p["lng"], p["type"], p["value"], p["unit"], p["status"], p["id"])
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "delete_point":
        point_id = body.get("id")
        if not point_id:
            conn.close()
            return resp(400, {"error": "id обязателен"})
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.monitoring_points WHERE id = %s", (point_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    conn.close()
    return resp(404, {"error": "Неизвестное действие"})
