from flask import Flask, render_template

app = Flask(__name__)

@app.route("/profile", methods=["GET", "POST"])
def profile():
    # TODO: handle form submit later
    return render_template("profile.html")
