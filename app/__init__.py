from .views import *

app = create_app()

@app.route('/')
def home():
    return home_()


@app.route('/<categorias>')
def esporte(categorias):
    return open_page_category(categorias)


@app.route("/admin", methods=["GET", "POST"])
def admin():
    return login()


@app.route("/admin/<session>", methods=["GET", "POST"])
def logon(session):
    return login_on(session)

@app.route("/<category>/<title>", methods=["GET", "POST"])
def open_page(category, title):
    return query_news(category=category, title=title)