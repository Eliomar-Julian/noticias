from flask import Flask, render_template, jsonify
from flask import request, redirect, url_for
from .models import *
import hashlib

DATABASE = SQL()

# retorna a instancia de Flask


def create_app():
    app = Flask(
        __name__, static_folder="static", 
        template_folder="templates"
    )
    return app


# gerador de hashs md5


def generate_hash(element):
    return hashlib.md5(bytes(element, "utf-8")).hexdigest()


# manipula login


def login():
    user_agent = request.headers.get("User-Agent")
    user_ip = request.remote_addr
    user_session_prepare = user_agent + user_ip
    user_session_finnaly = generate_hash(user_session_prepare)
    is_logon = DATABASE.get_table_data(
        "sessions", 
        "sessions_hash", 
        user_session_finnaly
    )
    if request.method == 'POST':
        name = request.form.get("user")
        password = request.form.get("password")
        expires = request.form.get("expired")
        user = DATABASE.get_table_data("admin", "adm", name)
        try: pass_ = user[2]
        except: pass_ = None

        if not user:
            return jsonify(message="errorName")
        elif pass_ != password:
            return jsonify(message="errorPassword")
        elif user[1] == name and pass_ == password:
            DATABASE.insert_in_table(
                "sessions", 
                [
                    "sessions_name", 
                    "sessions_hash", 
                    "sessions_permanent"
                ], 
                    [
                        name, user_session_finnaly, expires
                    ]
            )
            return jsonify(message="success", session=user_session_finnaly)
    try:
        if user_session_finnaly == is_logon[1]:
            return redirect("/admin/" + user_session_finnaly)
    except Exception as e:
        return render_template("login.html")


# renderiza a apagina de posts


def login_on(session):
    yes = DATABASE.get_table_data("sessions", "sessions_hash", session)
    try:
        if yes[1] == session:
            return render_template(
                "post.html", 
                var={
                    "session_name": yes[0], 
                    "session_hash": yes[1], 
                    "session_expire":yes[2]
                }
            )
    except Exception as e:
        return "Postagem não autorizada"
