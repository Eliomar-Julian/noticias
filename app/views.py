from flask import Flask, render_template, jsonify
from flask import request, redirect, make_response
from .models import os, SQL, typing
import hashlib
import threading
from time import sleep
from werkzeug.utils import secure_filename
import os
from datetime import datetime


# // instancia de acesso ao banco

DATABASE = SQL()


# retorna a instancia de Flask

def create_app():
    app = Flask(__name__, static_folder="static", template_folder="templates")
    return app


# // pagina inicial

def home_():
    search = request.args.get("search")
    if search:
        cur = DATABASE.query_like(search)
        return render_template("search.html", var=cur.fetchall())
    cur = DATABASE.personal()
    cur.execute("SELECT * FROM noticias ORDER BY id DESC LIMIT 24;")
    return render_template("ultimas.html", var=cur.fetchall())


# // abre as paginas de categoria

def open_page_category(category):
    search = request.args.get("search")
    if search:
        cur = DATABASE.query_like(search)
        return render_template("search.html", var=cur.fetchall())
    cur = DATABASE.personal()
    cur.execute("SELECT * FROM noticias WHERE categoria = ? ORDER BY DATE(data) DESC;", [category,])
    return render_template("ultimas.html", var=cur.fetchall())


# // função em thread que expira a sessão **precisa ser trabalhada**...

def expire(args):
    timer = 360
    for _ in range(timer): timer -= 1; sleep(1)
    DATABASE.delete_table("sessions", "sessions_hash", args)


# // recebe uma variavel string e gera uma hash gerador de hashs md5

def generate_hash(element: str) -> typing.Hashable:
    return hashlib.sha256(bytes(element, "utf-8")).hexdigest()


# // abre a tela de login e suas interações ** manipula login**

def login():
    user_agent = request.headers.get("User-Agent")
    user_ip = request.remote_addr
    user_session_prepare = user_agent + user_ip
    user_cookie = request.cookies.get("FNAdmin")
    
    if user_cookie:
        user_session_finnaly = generate_hash(user_session_prepare + user_cookie)
    else: 
        user_session_finnaly = generate_hash(user_session_prepare)
    is_logon = DATABASE.get_table_data("sessions", "sessions_hash", user_session_finnaly, order="sessions_hash")
    
    if request.method == 'POST':
        name = request.form.get("user")
        password = request.form.get("password")
        expires = request.form.get("expired")
        user = DATABASE.get_table_data("admin", "adm", name, order="adm")
        try: pass_ = user[2]
        except: pass_ = None

        if not user:
            return jsonify(message="errorName")
        elif pass_ != password:
            return jsonify(message="errorPassword")
        elif user[1] == name and pass_ == password: # comparando user e senha...
            DATABASE.insert_in_table("sessions", 
                ["sessions_name", 
                    "sessions_hash", 
                    "sessions_permanent"], [
                                            name, 
                                            user_session_finnaly, 
                                            expires
                                        ]
            )
            
            if expires == "true":             # verifica se a sessão expirará...
                threading.Thread(target=expire, daemon=True, args=[user_session_finnaly]).start()
            return jsonify(message="success", session=user_session_finnaly)

    try:
        if user_session_finnaly == is_logon[1]: # verifica se ainda há uma sessão aberta
            return redirect("/admin/" + user_session_finnaly)
    except TypeError:
        return render_template("login.html")


# // se logado renderiza a apagina de posts

def login_on(session):
    yes = DATABASE.get_table_data("sessions", "sessions_hash", session, order="sessions_hash")
    cur = DATABASE.personal()
    data = cur.execute("SELECT * FROM noticias ORDER BY id DESC;")
    d = data.fetchall()
    if request.method == "POST": # variaveis de inserção ao banco
        exit_ = request.form.get("logoff")
        date = request.form.get("date")
        author = request.form.get("author")
        category = request.form.get("category")
        title = request.form.get("title")
        sub_title = request.form.get("sub-title")
        text = request.form.get("text")
        photos = request.files.get("image")
        link_image = request.form.get("link-image")
        id_ = request.form.get("id")
        id_info = request.form.get("id-info")
        credits_ = request.form.get("credits")
        code = request.form.get("code")
        
        if code: 
            tmp = code; code = ""
            for char in tmp.split(" "):
                code += char.replace("\n", "") + " "
        save_base = os.path.dirname(__file__)
        save_file = os.path.join(save_base, "static/img/upload")
        
        if id_info: DATABASE.personal("DELETE FROM noticias WHERE id = ?;", [id_info,])
        
        try: # verificando se a imagem foi enviada e o nome do arquivo.
            photo = photos.filename
            photos.save(f"{save_file}/{secure_filename(photo)}")
        except : photo = link_image
        
        if exit_ == "exit": # se sair for clicado, se sim volta ao /admin
            DATABASE.delete_table("sessions", "sessions_hash", yes[1])
            return redirect("/admin")
        elif exit_ == "exit-all": # deslogar todos os administradores
            DATABASE.delete_all("sessions")
            return redirect("/admin") 

        if title: # se o formulario de postagem estiver preenchido
            if not id_: 
                DATABASE.insert_in_table("noticias", 
                    ("data", 
                    "autor", 
                    "categoria", 
                    "titulo", 
                    "materia", 
                    "foto", 
                    "creditos", 
                    "codigo", 
                    "sub_titulo"), (
                        date, 
                        author, 
                        category, 
                        title, 
                        text, 
                        photo, 
                        credits_, 
                        code, 
                        sub_title
                        )
                    )
            else:
                cur = DATABASE.personal(
                    """UPDATE noticias SET data = ?, 
                    autor = ?, 
                    categoria = ?, 
                    titulo = ?,
                    materia = ?, 
                    foto = ?, 
                    creditos = ?, 
                    codigo = ?, 
                    sub_titulo = ? WHERE id = ?;""", [
                        date, 
                        author, 
                        category, 
                        title, 
                        text, 
                        photo, 
                        credits_, 
                        code, 
                        sub_title, 
                        id_
                    ]
                )
            return redirect(f"/{category}/{title}")
    try:
        active = DATABASE.get_table_data("sessions", "sessions_name", yes[0], all=True, order="sessions_name")
        if yes[1] == session:
            resp = make_response(render_template("post.html", 
                    var={
                        "session_name": yes[0], 
                        "session_hash": yes[1], 
                        "session_expire":yes[2],
                        "session_actives": len(active),
                        "session_data": d
                    }
                )
            )
            resp.set_cookie("FNAdmin", yes[0])
            return resp
    except Exception:
        return '<h3 style="color: red;">Sessão expirada ou token invalido...</h3>'


# // buscando noticias no banco de dados....

def query_news(category: str=None, title: str=None):
    data = DATABASE.get_table_data("noticias", "titulo", title, order="data")
    outer = DATABASE.get_table_data("noticias", "categoria", category, all=True, order="data")
    search = request.args.get("search")
    if search:
        cur = DATABASE.query_like(search)
        return render_template("search.html", var=cur.fetchall())
    try:
        return render_template(
            "page.html", var={
                "id": data[0], 
                "date": data[1],
                "author": data[2], 
                "category": data[3], 
                "title": data[4], 
                "text": data[5],
                "photos": data[6],
                "credits": data[7],
                "code": data[8],
                "sub": data[9],
                "outer": outer
            }
        )
    except:
        return render_template("nada.html")

