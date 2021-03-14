import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import flask_sqlalchemy
import flask_praetorian
import flask_cors
from flask_cors import CORS, cross_origin
import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('TripleS App')

UPLOAD_FOLDER = '/home/marko/Desktop/triples/public/Uploads'
ALLOWED_EXTENSIONS = { 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx' }

app = Flask(__name__)

db = SQLAlchemy(app)
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class Files(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    FileName = db.Column(db.Text, unique=True)
    Group = db.Column(db.Text, unique=True)

    def __init__(self, FileName, Group):
        self.FileName = FileName
        self.Group = Group

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

def files_show(file):
    return {
        'id': file.id,
        'FileName': file.FileName,
        'Group': file.Group
    }

@app.route('/api', methods=['GET'])
def index():
    return jsonify([*map(files_show, Files.query.all())])

@app.route('/api/<int:id>')
def show(id):
    return jsonify([*map(files_show, Files.query.filter_by(id=id))])

@app.route('/api/upload', methods=['GET', 'POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')

    if not os.path.isdir(target):
        os.mkdir(target)

    new_fileName = request.form.get('filename')

    logger.info("welcome to upload`")
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, new_fileName])
    file.save(destination)
    session['uploadFilePath'] = destination
    
    uploadToDb = Files(
        FileName = request.form.get('filename'),
        Group = request.form.get('imageGroup')
    )
    db.session.add(uploadToDb)
    db.session.commit()
    
    return 'Saved file infos'

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
    message = ''
    return {message: f'protected endpoint (allowed user {flask_praetorian.current_user().username})'}

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True)

flask_cors.CORS(app, expose_headers='Authorization')
