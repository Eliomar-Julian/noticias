from .views import *
import typing as TH

app = create_app()

@app.route('/', methods=['GET'])
def home() -> TH.Callable:
    return home_()


@app.route('/<categorias>', methods=['GET'])
def esporte(categorias: str = "pagina de categorias") -> TH.Callable:
    return open_page_category(categorias)


@app.route("/admin", methods=["GET", "POST"])
def admin() -> TH.Callable:
    return login()


@app.route("/admin/<session>", methods=["GET", "POST"])
def logon(session) -> TH.Callable:
    return login_on(session)


@app.route("/<category>/<title>", methods=["GET", "POST"])
def open_page(category: str , title: str) -> typing.Callable:
    return query_news(category, title)


@app.route("/contato")
def contact() -> TH.Callable:
    return render_template("contato.html")