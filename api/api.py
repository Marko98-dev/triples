import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import flask_sqlalchemy
import flask_praetorian
import flask_cors

UPLOAD_FOLDER = '/home/marko/Desktop/triples/public/Uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx'}

app = Flask(__name__)

db = SQLAlchemy(app)
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='True')

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []
    
    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()
    
    @classmethod
    def identify(cls, id):
        return cls.query.get(id)
    
    @property
    def identity(self):
        return self.id
    
    def is_valid(self):
        return self.is_active

app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

guard.init_app(app, User)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/triples'
db.init_app(app)

cors.init_app(app)

with app.app_context():
    db.create_all()
    if db.session.query(User).filter_by(username='marko').count() < 1:
        db.session.add(User(
          username='marko',
          password=guard.hash_password('strongpassword'),
          roles='admin'
            ))
    db.session.commit()


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('no file part')
            return redirect(request.url)
        file = request.files['file']

        if file.filename == '':
            flash('No selected files')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('upload_file', filename=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/api/login', methods=['POST'])
def login():
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200
  
  
@app.route('/api/protected')
@flask_praetorian.auth_required
def protected():

    return {message: 'protected endpoint (allowed user {flask_praetorian.current_user().username})'}

if __name__ == '__main__':
    app.run(debug=True)