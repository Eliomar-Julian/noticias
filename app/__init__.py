from .views import *

app = create_app()

@app.route('/')
def home():
    return render_template("base.html")


@app.route("/admin", methods=["GET", "POST"])
def admin():
    return login()


@app.route("/admin/<session>")
def logon(session):
    return login_on(session)