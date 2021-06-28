from flask import Flask, render_template, jsonify
from flask import request, redirect, url_for
from .models import *
import hashlib
import threading
from time import sleep
from werkzeug.utils import secure_filename
import os

DATABASE = SQL()

# retorna a instancia de Flask


def create_app():
    app = Flask(
        __name__, static_folder="static", 
        template_folder="templates"
    )
    return app


# // pagina inicial


def home_():
    cur = DATABASE.personal()
    cur.execute("SELECT * FROM noticias ORDER BY id DESC LIMIT 50;")
    return render_template("ultimas.html", var=cur.fetchall())



def open_page_category(category):
    cur = DATABASE.personal()
    cur.execute("SELECT * FROM noticias WHERE categoria = ?;", [category,])
    return render_template("ultimas.html", var=sorted(cur.fetchall(), reverse=True))


# // expira a sessão...


def expire(args):
    timer = 3600
    for t in range(timer): 
        timer -= 1; sleep(1)
    DATABASE.delete_table("sessions", "sessions_hash", args)


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
                        name, 
                        user_session_finnaly, 
                        expires
                    ]
            )
            if expires == "true": 
                threading.Thread(
                    target=expire, 
                    daemon=True, args=[
                                    user_session_finnaly
                                ]).start()
            return jsonify(message="success", session=user_session_finnaly)
    try:
        if user_session_finnaly == is_logon[1]:
            return redirect("/admin/" + user_session_finnaly)
    except Exception as e:
        return render_template("login.html")


# renderiza a apagina de posts


def login_on(session):
    yes = DATABASE.get_table_data("sessions", "sessions_hash", session)
    if request.method == "POST":
        exit_ = request.form.get("logoff")
        date = request.form.get("date")
        author = request.form.get("author")
        category = request.form.get("category")
        title = request.form.get("title")
        text = request.form.get("text")
        photos = request.files.get("image")
        link_image = request.form.get("link-image")
        save_base = os.path.dirname(__file__)
        save_file = os.path.join(save_base, "static/img/upload")
        try:
            photo = photos.filename
            photos.save(f"{save_file}/{secure_filename(photo)}")
        except : 
            photo = link_image


        if exit_ == "exit": # se sair for clicado...
            DATABASE.delete_table("sessions", "sessions_hash", yes[1])
            return redirect("/admin")
        elif exit_ == "exit-all": # deslogar todos os administradores
            DATABASE.delete_all("sessions")
            return redirect("/admin") 

        if title: # se o formulario de postagem estiver preenchido 
            DATABASE.insert_in_table(
                "noticias", (
                    "data", "autor", "categoria", "titulo", "materia", "foto"), 
                    (date, author, category, title, text, photo)
            )
            return redirect(f"/{category}/{title}")
    try:
        active = DATABASE.get_table_data(
            "sessions", "sessions_name", 
            yes[0], True
        )
        if yes[1] == session:
            return render_template(
                "post.html", 
                var={
                    "session_name": yes[0], 
                    "session_hash": yes[1], 
                    "session_expire":yes[2],
                    "session_actives": len(active)
                }
            )
    except Exception as e:
        return "Sessão expirada ou token invalido"


# // buscando noticias no banco de dados....


def query_news(category: str=None, title: str=None):
    data = DATABASE.get_table_data("noticias", "titulo", title)
    outer = DATABASE.get_table_data("noticias", "categoria", category)
    return render_template(
        "page.html", var={
            "id": data[0], 
            "date": data[1],
            "author": data[2], 
            "category": data[3], 
            "title": data[4], 
            "text": data[5],
            "photos": data[6],
            "outer": outer
        }
    )
