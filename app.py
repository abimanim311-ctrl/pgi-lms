from flask import (Flask, render_template, request, jsonify,
                   session, redirect, url_for, Response, stream_with_context)
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from functools import wraps
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash as wp_check
from sqlalchemy import text
import os, random, string, mimetypes

# ════════════════════════════════════════════════════════
# APP & CONFIG
# ════════════════════════════════════════════════════════
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY']                 = 'pgi-lms-secret-2024'
app.config['SQLALCHEMY_DATABASE_URI']    = (
    'mysql+pymysql://avnadmin:AVNS_twqHLYh1gu_eg85QPV-'
    '@plant-green-inertia-abimani27112003-3e8c.g.aivencloud.com:23879/defaultdb'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS']  = {
    'pool_pre_ping': True,
    'pool_recycle':  300,
    'pool_timeout':  20,
    'pool_size':     5,
    'max_overflow':  10,
}
app.config['UPLOAD_FOLDER']             = os.path.join('static', 'uploads')
app.config['MAX_CONTENT_LENGTH']        = 500 * 1024 * 1024  # 500 MB

ALLOWED_VIDEO = {'mp4', 'webm', 'mov', 'avi', 'mkv'}
ALLOWED_IMG   = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

db     = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Create upload directories on startup
for _sub in ('videos', 'thumbnails', 'avatars'):
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], _sub), exist_ok=True)

# Confirm DB connection on startup
with app.app_context():
    try:
        _r = db.session.execute(text("SELECT DATABASE()"))
        print("✅  Connected to database:", _r.fetchone()[0])
    except Exception as _e:
        print("❌  DB connection failed:", _e)

    # Ensure optional profile columns exist (safe to run every startup)
    for _col_sql in [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE NULL",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) NULL",
    ]:
        try:
            db.session.execute(text(_col_sql))
            db.session.commit()
        except Exception:
            db.session.rollback()


# ════════════════════════════════════════════════════════
# DB HELPERS  (raw SQL via SQLAlchemy — no ORM models needed)
# ════════════════════════════════════════════════════════
def qry(sql, params=None):
    """Run a SELECT and return a list of plain dicts."""
    result = db.session.execute(text(sql), params or {})
    keys   = result.keys()
    return [dict(zip(keys, row)) for row in result.fetchall()]


def qry_one(sql, params=None):
    """Run a SELECT and return a single dict, or None."""
    result = db.session.execute(text(sql), params or {})
    keys   = result.keys()
    row    = result.fetchone()
    return dict(zip(keys, row)) if row else None


def run(sql, params=None):
    """Run INSERT / UPDATE / DELETE, commit, return lastrowid."""
    result = db.session.execute(text(sql), params or {})
    db.session.commit()
    try:
        return result.lastrowid
    except Exception:
        return None


def allowed_file(filename, allowed):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


# ════════════════════════════════════════════════════════
# AUTH DECORATORS
# ════════════════════════════════════════════════════════
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            if request.is_json:
                return jsonify({'error': 'Unauthorized'}), 401
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        u = qry_one("SELECT is_admin FROM users WHERE id = :id",
                    {'id': session['user_id']})
        if not u or not u.get('is_admin'):
            return jsonify({'error': 'Forbidden'}), 403
        return f(*args, **kwargs)
    return decorated


# ════════════════════════════════════════════════════════
# PAGE ROUTES
# ════════════════════════════════════════════════════════
@app.route('/')
def index():
    return redirect(url_for('login_page'))

@app.route('/favicon.ico')
def favicon():
    return Response(status=204)

@app.route('/login')
def login_page():           return render_template('login.html')

@app.route('/register')
def register_page():        return render_template('register.html')

@app.route('/edit-profile')
@login_required
def edit_profile_page():    return render_template('edit_profile.html')

@app.route('/dashboard')
@login_required
def dashboard_page():       return render_template('dashboard.html')

@app.route('/schedule')
@login_required
def schedule_page():        return render_template('schedule.html')

@app.route('/my-courses')
@login_required
def courses_page():         return render_template('my_courses.html')

@app.route('/assignments')
@login_required
def assignments_page():     return render_template('assignments.html')

@app.route('/quiz')
@login_required
def quiz_page():            return render_template('quiz.html')

@app.route('/leaderboard')
@login_required
def leaderboard_page():     return render_template('leaderboard.html')

@app.route('/certifications')
@login_required
def certifications_page():  return render_template('certifications.html')

@app.route('/profile')
@login_required
def profile_page():         return render_template('profile.html')

@app.route('/settings')
@login_required
def settings_page():        return render_template('settings.html')

@app.route('/notifications')
@login_required
def notifications_page():   return render_template('notifications.html')


# ════════════════════════════════════════════════════════
# AUTH API
# ════════════════════════════════════════════════════════
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    d = request.get_json()
    if not d:
        return jsonify({'error': 'No data sent'}), 400

    email    = d.get('email', '').strip()
    password = d.get('password', '')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = qry_one(
        "SELECT * FROM users WHERE email = :e OR username = :u",
        {'e': email, 'u': email}
    )
    if not user:
        return jsonify({'error': 'No account found with that email or username'}), 401

    valid   = False
    pw_hash = user.get('password_hash', '')

    if not valid and pw_hash.startswith('pbkdf2:'):
        try:   valid = wp_check(pw_hash, password)
        except: pass

    if not valid and pw_hash.startswith('$2b$'):
        try:   valid = bcrypt.check_password_hash(pw_hash, password)
        except: pass

    # Demo shortcut — only if hash is a placeholder
    if not valid:
        hash_real = pw_hash.startswith('pbkdf2:') or pw_hash.startswith('$2b$')
        if not hash_real and password == 'demo123':
            valid = True

    if not valid:
        return jsonify({'error': 'Incorrect password'}), 401

    _update_streak(user['id'])
    session.clear()
    session['user_id']   = user['id']
    session['username']  = user['username']
    session['full_name'] = user['full_name']
    return jsonify({'success': True, 'redirect': '/dashboard'})


@app.route('/api/auth/register', methods=['POST'])
def api_register():
    d         = request.get_json()
    username  = d.get('username', '').strip()
    email     = d.get('email', '').strip()
    full_name = d.get('full_name', '').strip()
    password  = d.get('password', '')
    if not all([username, email, full_name, password]):
        return jsonify({'error': 'All fields required'}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        uid = run(
            "INSERT INTO users (username, email, full_name, password_hash) "
            "VALUES (:u, :e, :f, :p)",
            {'u': username, 'e': email, 'f': full_name, 'p': pw_hash}
        )
        session.update({'user_id': uid, 'username': username, 'full_name': full_name})
        return jsonify({'success': True, 'redirect': '/dashboard'})
    except Exception:
        return jsonify({'error': 'Username or email already exists'}), 400


@app.route('/api/auth/logout')
def api_logout():
    session.clear()
    return redirect('/login')


@app.route('/api/auth/reset-password', methods=['POST'])
def api_reset_password():
    d      = request.get_json()
    email  = d.get('email', '').strip().lower()
    new_pw = d.get('new_password', '')
    if not email:         return jsonify({'error': 'Email is required.'}), 400
    if not new_pw:        return jsonify({'error': 'New password is required.'}), 400
    if len(new_pw) < 8:   return jsonify({'error': 'Password must be at least 8 characters.'}), 400

    user = qry_one("SELECT id, email FROM users WHERE email = :e", {'e': email})
    if not user:
        return jsonify({'error': 'No account found with that email address.'}), 404

    new_hash = bcrypt.generate_password_hash(new_pw).decode('utf-8')
    run("UPDATE users SET password_hash = :h WHERE id = :id",
        {'h': new_hash, 'id': user['id']})
    return jsonify({'success': True, 'message': f"Password updated for {user['email']}"})


# ════════════════════════════════════════════════════════
# USER API
# ════════════════════════════════════════════════════════
@app.route('/api/user/me')
@login_required
def api_me():
    u = qry_one(
        "SELECT id, username, full_name, email, level, xp, xp_max, streak_days, "
        "bio, phone, avatar_url, dark_mode, notifications_email, "
        "notifications_push, timezone, "
        "COALESCE(date_of_birth, '') AS date_of_birth, "
        "COALESCE(gender, '')        AS gender "
        "FROM users WHERE id = :id",
        {'id': session['user_id']}
    )
    if u and u.get('date_of_birth'):
        u['date_of_birth'] = str(u['date_of_birth'])
    return jsonify(u)


@app.route('/api/user/update', methods=['POST'])
@login_required
def api_update_user():
    d = request.get_json()
    if not d:
        return jsonify({'error': 'No data received'}), 400

    ALLOWED = {'full_name', 'bio', 'phone', 'timezone',
               'notifications_email', 'notifications_push', 'dark_mode'}
    updates = {k: v for k, v in d.items() if k in ALLOWED}
    if not updates:
        return jsonify({'error': 'No valid fields to update'}), 400

    set_clause = ', '.join(f"{col} = :{col}" for col in updates)
    params     = {**updates, '_uid': session['user_id']}
    run(f"UPDATE users SET {set_clause} WHERE id = :_uid", params)
    return jsonify({'success': True})


@app.route('/api/user/update_profile', methods=['POST'])
@login_required
def update_profile():
    d         = request.get_json()
    uid       = session['user_id']
    full_name = d.get('full_name', '').strip()
    email     = d.get('email', '').strip()
    phone     = d.get('phone', '').strip()
    dob       = d.get('date_of_birth') or None
    gender    = d.get('gender', '').strip()
    bio       = d.get('bio', '').strip()

    if not full_name: return jsonify({'error': 'Full name is required.'}), 400
    if not email:     return jsonify({'error': 'Email is required.'}), 400

    try:
        run("""UPDATE users
               SET full_name = :fn, email = :em, phone = :ph,
                   date_of_birth = :dob, gender = :ge, bio = :bio
               WHERE id = :id""",
            {'fn': full_name, 'em': email, 'ph': phone,
             'dob': dob, 'ge': gender, 'bio': bio, 'id': uid})
        session['full_name'] = full_name
        return jsonify({'success': True, 'message': '✓ Profile updated!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/avatar', methods=['POST'])
@login_required
def api_upload_avatar():
    f = request.files.get('avatar')
    if not f or not allowed_file(f.filename, ALLOWED_IMG):
        return jsonify({'error': 'Invalid file'}), 400
    fname = f"avatar_{session['user_id']}_{secure_filename(f.filename)}"
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], 'avatars', fname))
    url = f"/static/uploads/avatars/{fname}"
    run("UPDATE users SET avatar_url = :url WHERE id = :id",
        {'url': url, 'id': session['user_id']})
    return jsonify({'success': True, 'url': url})


@app.route('/api/user/change-password', methods=['POST'])
@login_required
def api_change_password():
    d                = request.get_json()
    current_password = d.get('current_password', '')
    new_password     = d.get('new_password', '')
    if not current_password or not new_password:
        return jsonify({'error': 'Both current and new password are required.'}), 400
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters.'}), 400

    user = qry_one("SELECT password_hash FROM users WHERE id = :id",
                   {'id': session['user_id']})
    try:   valid = bcrypt.check_password_hash(user['password_hash'], current_password)
    except: valid = False

    if not valid:
        return jsonify({'error': 'Current password is incorrect.'}), 401

    new_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    run("UPDATE users SET password_hash = :h WHERE id = :id",
        {'h': new_hash, 'id': session['user_id']})
    return jsonify({'success': True, 'message': 'Password changed successfully!'})


@app.route('/api/user/storage')
@login_required
def api_user_storage():
    uid         = session['user_id']
    upload_root = os.path.abspath(app.config['UPLOAD_FOLDER'])
    total_bytes = 0

    avatar_dir = os.path.join(upload_root, 'avatars')
    if os.path.isdir(avatar_dir):
        for f in os.listdir(avatar_dir):
            if f.startswith(f'avatar_{uid}_'):
                try: total_bytes += os.path.getsize(os.path.join(avatar_dir, f))
                except: pass

    videos = qry(
        "SELECT l.video_url FROM user_lessons ul "
        "JOIN lessons l ON ul.lesson_id = l.id "
        "WHERE ul.user_id = :uid AND l.video_url IS NOT NULL AND l.video_url != ''",
        {'uid': uid}
    )
    video_dir = os.path.join(upload_root, 'videos')
    for row in videos:
        fpath = os.path.join(video_dir, os.path.basename(row['video_url']))
        if os.path.isfile(fpath):
            try: total_bytes += os.path.getsize(fpath)
            except: pass

    used_gb = round(total_bytes / (1024 ** 3), 2)
    max_gb  = 5.0
    return jsonify({
        'used_gb':  used_gb,
        'max_gb':   max_gb,
        'used_pct': round((used_gb / max_gb) * 100, 1),
        'used_mb':  round(total_bytes / (1024 ** 2), 1),
    })


# ════════════════════════════════════════════════════════
# DASHBOARD
# ════════════════════════════════════════════════════════
@app.route('/api/dashboard')
@login_required
def api_dashboard():
    uid  = session['user_id']

    user = qry_one(
        "SELECT level, xp, xp_max, streak_days, full_name FROM users WHERE id = :id",
        {'id': uid}
    )
    active_courses = qry_one(
        "SELECT COUNT(*) AS cnt FROM user_courses WHERE user_id = :uid AND status = 'active'",
        {'uid': uid}
    )['cnt']

    hours_row   = qry_one(
        "SELECT COALESCE(SUM(minutes_studied) / 60, 0) AS hours "
        "FROM streak_logs WHERE user_id = :uid",
        {'uid': uid}
    )
    total_hours = round(float(hours_row['hours'] or 0), 1)

    lessons_done = qry_one(
        "SELECT COUNT(*) AS cnt FROM user_lessons WHERE user_id = :uid",
        {'uid': uid}
    )['cnt'] or 0

    courses = qry(
        "SELECT c.title, c.category, uc.current_module, uc.progress_percent, "
        "uc.mode, c.total_modules, c.id AS course_id "
        "FROM user_courses uc JOIN courses c ON uc.course_id = c.id "
        "WHERE uc.user_id = :uid AND uc.status = 'active' ORDER BY uc.enrolled_at DESC",
        {'uid': uid}
    )
    tasks = qry(
        "SELECT a.title, a.type, a.due_date, ua.status "
        "FROM user_assignments ua JOIN assignments a ON ua.assignment_id = a.id "
        "WHERE ua.user_id = :uid AND ua.status != 'graded' ORDER BY a.due_date ASC LIMIT 5",
        {'uid': uid}
    )
    streak_rows = qry(
        "SELECT log_date FROM streak_logs "
        "WHERE user_id = :uid AND log_date >= DATE_SUB(CURDATE(), INTERVAL 21 DAY)",
        {'uid': uid}
    )
    streak_dates = [str(r['log_date']) for r in streak_rows]

    achievements = qry(
        "SELECT a.title, a.icon FROM user_achievements ua "
        "JOIN achievements a ON ua.achievement_id = a.id "
        "WHERE ua.user_id = :uid ORDER BY ua.earned_at DESC LIMIT 8",
        {'uid': uid}
    )
    ftasks = [{'title': t['title'], 'type': t['type'],
               'due_date': str(t['due_date']), 'status': t['status']}
              for t in tasks]

    return jsonify({
        'user': user,
        'stats': {
            'active_courses': active_courses,
            'total_hours':    total_hours,
            'total_xp':       user['xp'],
            'lessons_done':   lessons_done,
            'lessons_today':  0,
            'streak_days':    user['streak_days'],
            'best_streak':    user['streak_days'],
            'level':          user['level'],
        },
        'courses':      courses,
        'tasks':        ftasks,
        'streak_dates': streak_dates,
        'achievements': achievements,
    })


# ════════════════════════════════════════════════════════
# COURSES
# ════════════════════════════════════════════════════════
@app.route('/api/courses')
@login_required
def api_courses():
    uid  = session['user_id']
    rows = qry("""
        SELECT co.id, co.title, co.description, co.instructor,
               co.total_modules, co.total_hours, co.difficulty,
               co.category, co.xp_reward,
               COALESCE(co.google_form_url, '') AS google_form_url,
               uc.progress_percent, uc.current_module,
               uc.status AS enroll_status,
               uc.mode,  uc.id AS uc_id
        FROM   courses co
        LEFT JOIN user_courses uc ON co.id = uc.course_id AND uc.user_id = :uid
        ORDER BY uc.enrolled_at DESC, co.id ASC
    """, {'uid': uid})
    return jsonify(rows)


@app.route('/api/courses/<int:course_id>')
@login_required
def api_course_detail(course_id):
    uid    = session['user_id']
    course = qry_one("""
        SELECT co.*, COALESCE(co.google_form_url, '') AS google_form_url,
               uc.progress_percent, uc.current_module,
               uc.status AS enroll_status, uc.mode
        FROM   courses co
        LEFT JOIN user_courses uc ON co.id = uc.course_id AND uc.user_id = :uid
        WHERE  co.id = :cid
    """, {'uid': uid, 'cid': course_id})

    if not course:
        return jsonify({'error': 'Not found'}), 404

    lessons = qry("""
        SELECT l.id, l.module_number, l.lesson_order,
               l.title, l.content,
               COALESCE(l.video_url,   '') AS video_url,
               COALESCE(l.youtube_url, '') AS youtube_url,
               l.duration_minutes, l.xp_reward,
               CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END AS completed
        FROM   lessons l
        LEFT JOIN user_lessons ul ON l.id = ul.lesson_id AND ul.user_id = :uid
        WHERE  l.course_id = :cid
        ORDER BY l.module_number, l.lesson_order
    """, {'uid': uid, 'cid': course_id})

    for l in lessons:
        l['duration_minutes'] = int(l['duration_minutes'] or 0)
        l['completed']        = bool(l['completed'])

    total_lessons   = len(lessons)
    completed_count = sum(1 for l in lessons if l['completed'])
    all_done        = total_lessons > 0 and completed_count == total_lessons

    return jsonify({
        'course':          course,
        'lessons':         lessons,
        'total_lessons':   total_lessons,
        'completed_count': completed_count,
        'all_done':        all_done,
    })


@app.route('/api/courses/enroll', methods=['POST'])
@login_required
def api_enroll():
    d = request.get_json()
    try:
        run("INSERT INTO user_courses (user_id, course_id) VALUES (:uid, :cid)",
            {'uid': session['user_id'], 'cid': d['course_id']})
        _add_notification(session['user_id'], 'Enrolled! 🎉',
                          'You enrolled in a new course. Start learning!', 'success')
        return jsonify({'success': True})
    except Exception:
        return jsonify({'error': 'Already enrolled'}), 400


@app.route('/api/courses/complete-lesson', methods=['POST'])
@login_required
def api_complete_lesson():
    d   = request.get_json()
    uid = session['user_id']
    lid = d['lesson_id']

    try:
        run("INSERT INTO user_lessons (user_id, lesson_id) VALUES (:uid, :lid)",
            {'uid': uid, 'lid': lid})
    except Exception:
        return jsonify({'success': True, 'already_done': True})

    lesson  = qry_one(
        "SELECT course_id, xp_reward, duration_minutes FROM lessons WHERE id = :id",
        {'id': lid}
    )
    xp_gain, cert_issued, pct = 10, False, 0

    if lesson:
        cid     = lesson['course_id']
        xp_gain = lesson['xp_reward'] or 10

        total = qry_one("SELECT COUNT(*) AS total FROM lessons WHERE course_id = :cid",
                        {'cid': cid})['total']
        done  = qry_one("""
            SELECT COUNT(*) AS done FROM user_lessons ul
            JOIN lessons l ON ul.lesson_id = l.id
            WHERE ul.user_id = :uid AND l.course_id = :cid
        """, {'uid': uid, 'cid': cid})['done']

        pct = int((done / total) * 100) if total else 0

        run("""UPDATE user_courses
               SET progress_percent = :pct, current_module = :mod
               WHERE user_id = :uid AND course_id = :cid""",
            {'pct': pct, 'mod': d.get('module_number', 1), 'uid': uid, 'cid': cid})

        run("UPDATE users SET xp = xp + :xp WHERE id = :id",
            {'xp': xp_gain, 'id': uid})

        dur = d.get('duration', lesson['duration_minutes'] or 10)
        try:
            run("""INSERT INTO streak_logs
                       (user_id, log_date, xp_earned, lessons_completed, minutes_studied)
                   VALUES (:uid, CURDATE(), :xp, 1, :dur)
                   ON DUPLICATE KEY UPDATE
                       xp_earned         = xp_earned + :xp,
                       lessons_completed = lessons_completed + 1,
                       minutes_studied   = minutes_studied + :dur""",
                {'uid': uid, 'xp': xp_gain, 'dur': dur})
        except Exception:
            pass

        if pct == 100:
            cert_num = 'PGI-' + ''.join(
                random.choices(string.ascii_uppercase + string.digits, k=10))
            try:
                run("INSERT INTO certificates (user_id, course_id, certificate_number) "
                    "VALUES (:uid, :cid, :cn)",
                    {'uid': uid, 'cid': cid, 'cn': cert_num})
                _add_notification(uid, '🎓 Certificate Earned!',
                                  f'You completed the course! Certificate #{cert_num} issued.',
                                  'success')
                cert_issued = True
            except Exception:
                pass

    return jsonify({'success': True, 'xp_gained': xp_gain,
                    'progress': pct, 'cert_issued': cert_issued})


# ════════════════════════════════════════════════════════
# ASSIGNMENTS
# ════════════════════════════════════════════════════════
@app.route('/api/assignments')
@login_required
def api_assignments():
    uid  = session['user_id']
    rows = qry("""
        SELECT a.*, c.title AS course_title,
               ua.status AS submission_status,
               ua.score, ua.feedback, ua.submitted_at
        FROM   assignments a
        JOIN   courses c ON a.course_id = c.id
        JOIN   user_courses uc ON c.id = uc.course_id AND uc.user_id = :uid
        LEFT JOIN user_assignments ua ON a.id = ua.assignment_id AND ua.user_id = :uid
        ORDER BY a.due_date ASC
    """, {'uid': uid})
    for a in rows:
        a['due_date']     = str(a['due_date'])
        a['submitted_at'] = str(a['submitted_at']) if a['submitted_at'] else None
    return jsonify(rows)


@app.route('/api/assignments/add', methods=['POST'])
@login_required
def api_add_assignment():
    d   = request.get_json()
    aid = run("""INSERT INTO assignments
                     (course_id, title, description, due_date,
                      max_score, xp_reward, type)
                 VALUES (:cid, :title, :desc, :due, :ms, :xp, :type)""",
              {'cid': d['course_id'], 'title': d['title'],
               'desc': d.get('description', ''), 'due': d['due_date'],
               'ms': d.get('max_score', 100), 'xp': d.get('xp_reward', 50),
               'type': d.get('type', 'Assignment')})

    users = qry(
        "SELECT user_id FROM user_courses WHERE course_id = :cid AND status = 'active'",
        {'cid': d['course_id']}
    )
    for u in users:
        try:
            run("INSERT INTO user_assignments (user_id, assignment_id) VALUES (:uid, :aid)",
                {'uid': u['user_id'], 'aid': aid})
        except Exception:
            pass

    return jsonify({'success': True, 'id': aid})


@app.route('/api/assignments/submit', methods=['POST'])
@login_required
def api_submit_assignment():
    d   = request.get_json()
    uid = session['user_id']
    run("""INSERT INTO user_assignments (user_id, assignment_id, status, submitted_at)
           VALUES (:uid, :aid, 'submitted', NOW())
           ON DUPLICATE KEY UPDATE status = 'submitted', submitted_at = NOW()""",
        {'uid': uid, 'aid': d['assignment_id']})
    return jsonify({'success': True})


# ════════════════════════════════════════════════════════
# SCHEDULE
# ════════════════════════════════════════════════════════
@app.route('/api/schedule')
@login_required
def api_schedule():
    uid   = session['user_id']
    month = request.args.get('month', datetime.now().month)
    year  = request.args.get('year',  datetime.now().year)
    rows  = qry("""
        SELECT se.*, c.title AS course_title
        FROM   schedule_events se
        LEFT JOIN courses c ON se.course_id = c.id
        WHERE  se.user_id = :uid
          AND  MONTH(se.event_date) = :month
          AND  YEAR(se.event_date)  = :year
        ORDER BY se.event_date, se.start_time
    """, {'uid': uid, 'month': month, 'year': year})

    for e in rows:
        e['event_date'] = str(e['event_date'])
        e['start_time'] = str(e['start_time'])
        e['end_time']   = str(e['end_time']) if e['end_time'] else None
    return jsonify(rows)


@app.route('/api/schedule/add', methods=['POST'])
@login_required
def api_add_event():
    d   = request.get_json()
    uid = session['user_id']
    eid = run("""INSERT INTO schedule_events
                     (user_id, title, description, event_type,
                      event_date, start_time, end_time, course_id)
                 VALUES (:uid, :title, :desc, :etype,
                         :edate, :stime, :etime, :cid)""",
              {'uid': uid, 'title': d['title'], 'desc': d.get('description'),
               'etype': d.get('event_type', 'study'), 'edate': d['event_date'],
               'stime': d['start_time'], 'etime': d.get('end_time'),
               'cid': d.get('course_id')})
    return jsonify({'success': True, 'id': eid})


@app.route('/api/schedule/delete/<int:event_id>', methods=['DELETE'])
@login_required
def api_delete_event(event_id):
    run("DELETE FROM schedule_events WHERE id = :id AND user_id = :uid",
        {'id': event_id, 'uid': session['user_id']})
    return jsonify({'success': True})

# ════════════════════════════════════════════════════════
# NOTIFICATIONS
# ════════════════════════════════════════════════════════
@app.route('/api/notifications')
@login_required
def api_notifications():
    rows = qry(
        "SELECT * FROM notifications WHERE user_id = :uid ORDER BY created_at DESC LIMIT 30",
        {'uid': session['user_id']}
    )
    for n in rows:
        n['created_at'] = str(n['created_at'])
    return jsonify(rows)


@app.route('/api/notifications/mark-read', methods=['POST'])
@login_required
def api_mark_read():
    d   = request.get_json() or {}
    nid = d.get('id')
    if nid:
        run("UPDATE notifications SET is_read = TRUE WHERE id = :id AND user_id = :uid",
            {'id': nid, 'uid': session['user_id']})
    else:
        run("UPDATE notifications SET is_read = TRUE WHERE user_id = :uid",
            {'uid': session['user_id']})
    return jsonify({'success': True})


@app.route('/api/notifications/delete/<int:nid>', methods=['DELETE'])
@login_required
def api_delete_notification(nid):
    run("DELETE FROM notifications WHERE id = :id AND user_id = :uid",
        {'id': nid, 'uid': session['user_id']})
    return jsonify({'success': True})


# ════════════════════════════════════════════════════════
# NAV BADGE COUNTS
# ════════════════════════════════════════════════════════
@app.route('/api/nav-counts')
@login_required
def api_nav_counts():
    uid = session['user_id']

    pending_tests = qry_one("""
        SELECT COUNT(*) AS cnt FROM user_courses uc
        JOIN courses co ON uc.course_id = co.id
        WHERE uc.user_id = :uid AND uc.progress_percent = 100
          AND co.id NOT IN (SELECT course_id FROM certificates WHERE user_id = :uid)
    """, {'uid': uid})['cnt']

    pending_assignments = qry_one("""
        SELECT COUNT(*) AS cnt FROM user_assignments ua
        JOIN assignments a ON ua.assignment_id = a.id
        WHERE ua.user_id = :uid AND ua.status = 'pending' AND a.type != 'Quiz'
    """, {'uid': uid})['cnt']

    pending_quizzes = qry_one("""
        SELECT COUNT(*) AS cnt FROM user_assignments ua
        JOIN assignments a ON ua.assignment_id = a.id
        WHERE ua.user_id = :uid AND ua.status = 'pending' AND a.type = 'Quiz'
    """, {'uid': uid})['cnt']

    unread_notifications = qry_one(
        "SELECT COUNT(*) AS cnt FROM notifications WHERE user_id = :uid AND is_read = FALSE",
        {'uid': uid}
    )['cnt']

    today_events = qry_one(
        "SELECT COUNT(*) AS cnt FROM schedule_events WHERE user_id = :uid AND event_date = CURDATE()",
        {'uid': uid}
    )['cnt']

    return jsonify({
        'courses':       pending_tests,
        'assignments':   pending_assignments,
        'quiz':          pending_quizzes,
        'notifications': unread_notifications,
        'schedule':      today_events,
    })


# ════════════════════════════════════════════════════════
# LEADERBOARD
# ════════════════════════════════════════════════════════
@app.route('/api/leaderboard')
@login_required
def api_leaderboard():
    period = request.args.get('period', 'all')

    if period == 'weekly':
        rows = qry("""
            SELECT u.id, u.full_name, u.username, u.level, u.avatar_url,
                   COALESCE(SUM(sl.xp_earned), 0) AS score,
                   u.streak_days,
                   COUNT(DISTINCT ul.id) AS lessons_done
            FROM   users u
            LEFT JOIN streak_logs  sl ON u.id = sl.user_id
                  AND sl.log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            LEFT JOIN user_lessons ul ON u.id = ul.user_id
                  AND ul.completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY u.id ORDER BY score DESC LIMIT 20
        """)
    elif period == 'monthly':
        rows = qry("""
            SELECT u.id, u.full_name, u.username, u.level, u.avatar_url,
                   COALESCE(SUM(sl.xp_earned), 0) AS score,
                   u.streak_days,
                   COUNT(DISTINCT ul.id) AS lessons_done
            FROM   users u
            LEFT JOIN streak_logs  sl ON u.id = sl.user_id
                  AND sl.log_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            LEFT JOIN user_lessons ul ON u.id = ul.user_id
                  AND ul.completed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY u.id ORDER BY score DESC LIMIT 20
        """)
    else:
        rows = qry("""
            SELECT u.id, u.full_name, u.username, u.level,
                   u.xp AS score, u.avatar_url, u.streak_days,
                   COUNT(DISTINCT ul.id) AS lessons_done
            FROM   users u
            LEFT JOIN user_lessons ul ON u.id = ul.user_id
            GROUP BY u.id ORDER BY u.xp DESC LIMIT 20
        """)

    for i, u in enumerate(rows):
        u['rank']       = i + 1
        u['is_current'] = u['id'] == session['user_id']
    return jsonify(rows)


# ════════════════════════════════════════════════════════
# CERTIFICATIONS
# ════════════════════════════════════════════════════════
@app.route('/api/certifications')
@login_required
def api_certifications():
    uid   = session['user_id']
    certs = qry("""
        SELECT cert.*, co.title AS course_title, co.instructor,
               co.category, co.difficulty, co.total_hours
        FROM   certificates cert JOIN courses co ON cert.course_id = co.id
        WHERE  cert.user_id = :uid ORDER BY cert.issued_at DESC
    """, {'uid': uid})

    in_progress = qry("""
        SELECT co.title, co.category, uc.progress_percent, uc.course_id
        FROM   user_courses uc JOIN courses co ON uc.course_id = co.id
        WHERE  uc.user_id = :uid
          AND  uc.progress_percent >= 80
          AND  uc.progress_percent < 100
          AND  co.id NOT IN (SELECT course_id FROM certificates WHERE user_id = :uid)
    """, {'uid': uid})

    for cert in certs:
        cert['issued_at'] = str(cert['issued_at'])
    return jsonify({'certificates': certs, 'in_progress': in_progress})


# ════════════════════════════════════════════════════════
# QUIZ
# ════════════════════════════════════════════════════════
@app.route('/api/quiz/<int:aid>')
@login_required
def api_get_quiz(aid):
    assignment = qry_one(
        "SELECT a.*, co.title AS course_title FROM assignments a "
        "JOIN courses co ON a.course_id = co.id WHERE a.id = :id",
        {'id': aid}
    )
    questions = qry(
        "SELECT id, question, option_a, option_b, option_c, option_d, explanation "
        "FROM quiz_questions WHERE assignment_id = :aid",
        {'aid': aid}
    )
    return jsonify({'assignment': assignment, 'questions': questions})


@app.route('/api/quiz/add-question', methods=['POST'])
@login_required
def api_add_question():
    d   = request.get_json()
    qid = run("""INSERT INTO quiz_questions
                     (assignment_id, question, option_a, option_b,
                      option_c, option_d, correct_option, explanation)
                 VALUES (:aid, :q, :a, :b, :c, :d, :co, :expl)""",
              {'aid': d['assignment_id'], 'q': d['question'],
               'a': d['option_a'], 'b': d['option_b'],
               'c': d.get('option_c'), 'd': d.get('option_d'),
               'co': d['correct_option'], 'expl': d.get('explanation', '')})
    return jsonify({'success': True, 'id': qid})


@app.route('/api/quiz/submit', methods=['POST'])
@login_required
def api_submit_quiz():
    d       = request.get_json()
    uid     = session['user_id']
    aid     = d['assignment_id']
    answers = d.get('answers', {})

    questions = qry("SELECT * FROM quiz_questions WHERE assignment_id = :aid", {'aid': aid})
    correct   = sum(1 for q in questions
                    if answers.get(str(q['id'])) == q['correct_option'])
    total     = len(questions)
    score     = int((correct / total) * 100) if total else 0

    run("""INSERT INTO user_assignments
               (user_id, assignment_id, status, score, submitted_at)
           VALUES (:uid, :aid, 'graded', :score, NOW())
           ON DUPLICATE KEY UPDATE
               status = 'graded', score = :score, submitted_at = NOW()""",
        {'uid': uid, 'aid': aid, 'score': score})

    if score >= 60:
        xp_row = qry_one("SELECT xp_reward FROM assignments WHERE id = :id", {'id': aid})
        if xp_row:
            run("UPDATE users SET xp = xp + :xp WHERE id = :id",
                {'xp': int(xp_row['xp_reward'] * score / 100), 'id': uid})

    results = [
        {'id': q['id'], 'question': q['question'],
         'your_answer':    answers.get(str(q['id'])),
         'correct_option': q['correct_option'],
         'explanation':    q.get('explanation', ''),
         'options': {'a': q['option_a'], 'b': q['option_b'],
                     'c': q.get('option_c'), 'd': q.get('option_d')}}
        for q in questions
    ]
    return jsonify({'score': score, 'correct': correct,
                    'total': total, 'results': results})


# ════════════════════════════════════════════════════════
# PROFILE
# ════════════════════════════════════════════════════════
@app.route('/api/profile/<int:uid>')
@login_required
def api_profile(uid):
    u = qry_one(
        "SELECT id, full_name, username, level, xp, streak_days, bio, avatar_url "
        "FROM users WHERE id = :id",
        {'id': uid}
    )
    badges = qry(
        "SELECT a.title, a.icon, ua.earned_at FROM user_achievements ua "
        "JOIN achievements a ON ua.achievement_id = a.id WHERE ua.user_id = :uid",
        {'uid': uid}
    )
    courses = qry(
        "SELECT co.title, co.category, uc.progress_percent "
        "FROM user_courses uc JOIN courses co ON uc.course_id = co.id "
        "WHERE uc.user_id = :uid",
        {'uid': uid}
    )
    for b in badges:
        b['earned_at'] = str(b['earned_at'])
    return jsonify({'user': u, 'badges': badges, 'courses': courses})


# ════════════════════════════════════════════════════════
# ADMIN
# ════════════════════════════════════════════════════════
@app.route('/api/admin/lessons/<int:lesson_id>/upload-video', methods=['POST'])
@admin_required
def api_admin_upload_video(lesson_id):
    f = request.files.get('video')
    if not f:
        return jsonify({'error': 'No file provided'}), 400
    ext = f.filename.rsplit('.', 1)[-1].lower() if '.' in f.filename else ''
    if ext not in ALLOWED_VIDEO:
        return jsonify({'error': f'Invalid type. Allowed: {", ".join(ALLOWED_VIDEO)}'}), 400
    fname    = f"lesson_{lesson_id}_{int(datetime.now().timestamp())}.{ext}"
    save_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'videos')
    os.makedirs(save_dir, exist_ok=True)
    f.save(os.path.join(save_dir, fname))
    url = f"/video/videos/{fname}"
    run("UPDATE lessons SET video_url = :url WHERE id = :id", {'url': url, 'id': lesson_id})
    return jsonify({'success': True, 'url': url})


@app.route('/api/admin/courses/<int:course_id>/form-url', methods=['POST'])
@admin_required
def api_admin_set_form_url(course_id):
    d   = request.get_json()
    url = d.get('google_form_url', '').strip()
    run("UPDATE courses SET google_form_url = :url WHERE id = :id",
        {'url': url, 'id': course_id})
    return jsonify({'success': True})


@app.route('/api/admin/courses/add', methods=['POST'])
@admin_required
def api_admin_add_course():
    d = request.get_json()
    if not d.get('title', '').strip():
        return jsonify({'error': 'Title is required'}), 400
    cid = run("""INSERT INTO courses
                     (title, description, instructor, total_modules,
                      total_hours, difficulty, category, xp_reward)
                 VALUES (:title, :desc, :inst, :mods, :hrs, :diff, :cat, :xp)""",
              {'title': d['title'].strip(),
               'desc':  d.get('description', ''),
               'inst':  d.get('instructor', ''),
               'mods':  int(d.get('total_modules', 0)),
               'hrs':   float(d.get('total_hours', 0)),
               'diff':  d.get('difficulty', 'Beginner'),
               'cat':   d.get('category', 'General'),
               'xp':    int(d.get('xp_reward', 100))})
    return jsonify({'success': True, 'id': cid})


@app.route('/api/admin/stats')
@admin_required
def api_admin_stats():
    students    = qry_one("SELECT COUNT(*) AS cnt FROM users WHERE is_admin = 0")['cnt']
    courses     = qry_one("SELECT COUNT(*) AS cnt FROM courses")['cnt']
    lessons     = qry_one("SELECT COUNT(*) AS cnt FROM lessons")['cnt']
    with_video  = qry_one(
        "SELECT COUNT(*) AS cnt FROM lessons "
        "WHERE (youtube_url IS NOT NULL AND youtube_url != '') "
        "   OR (video_url   IS NOT NULL AND video_url   != '')"
    )['cnt']
    no_video    = qry_one(
        "SELECT COUNT(*) AS cnt FROM lessons "
        "WHERE (youtube_url IS NULL OR youtube_url = '') "
        "  AND (video_url   IS NULL OR video_url   = '')"
    )['cnt']
    completions = qry_one("SELECT COUNT(*) AS cnt FROM user_lessons")['cnt']
    return jsonify({'students': students, 'courses': courses,
                    'lessons': lessons, 'with_video': with_video,
                    'no_video': no_video, 'completions': completions})


# ════════════════════════════════════════════════════════
# HELPERS
# ════════════════════════════════════════════════════════
def _update_streak(uid):
    u     = qry_one("SELECT last_login, streak_days FROM users WHERE id = :id", {'id': uid})
    today = date.today()
    last  = u.get('last_login')
    if isinstance(last, datetime):
        last = last.date()

    if last == today:
        pass
    elif last == today - timedelta(days=1):
        run("UPDATE users SET streak_days = streak_days + 1, last_login = :today WHERE id = :id",
            {'today': today, 'id': uid})
    else:
        run("UPDATE users SET streak_days = 1, last_login = :today WHERE id = :id",
            {'today': today, 'id': uid})

    try:
        run("INSERT INTO streak_logs "
            "(user_id, log_date, xp_earned, lessons_completed, minutes_studied) "
            "VALUES (:uid, :today, 0, 0, 0)",
            {'uid': uid, 'today': today})
    except Exception:
        pass


def _add_notification(uid, title, message, ntype='info'):
    run("INSERT INTO notifications (user_id, title, message, type) "
        "VALUES (:uid, :title, :msg, :type)",
        {'uid': uid, 'title': title, 'msg': message, 'type': ntype})


# ════════════════════════════════════════════════════════
# VIDEO STREAMING  (HTTP Range requests for seek / scrub)
# ════════════════════════════════════════════════════════
@app.route('/video/<path:filename>')
@login_required
def stream_video(filename):
    upload_root = os.path.abspath(app.config['UPLOAD_FOLDER'])
    file_path   = os.path.abspath(os.path.join(upload_root, filename))

    if not file_path.startswith(upload_root):
        return jsonify({'error': 'Forbidden'}), 403
    if not os.path.isfile(file_path):
        return jsonify({'error': 'File not found'}), 404

    file_size        = os.path.getsize(file_path)
    mime_type, _     = mimetypes.guess_type(file_path)
    mime_type        = mime_type or 'application/octet-stream'
    range_header     = request.headers.get('Range')

    if range_header:
        parts  = range_header.replace('bytes=', '').split('-')
        start  = int(parts[0]) if parts[0] else 0
        end    = int(parts[1]) if parts[1] else file_size - 1
        end    = min(end, file_size - 1)
        length = end - start + 1

        def gen_chunk():
            with open(file_path, 'rb') as f:
                f.seek(start)
                remaining = length
                while remaining > 0:
                    chunk = f.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    yield chunk

        return Response(stream_with_context(gen_chunk()), status=206, headers={
            'Content-Range':  f'bytes {start}-{end}/{file_size}',
            'Accept-Ranges':  'bytes',
            'Content-Length': str(length),
            'Content-Type':   mime_type,
            'Cache-Control':  'no-cache',
        })

    def gen_full():
        with open(file_path, 'rb') as f:
            while True:
                chunk = f.read(64 * 1024)
                if not chunk:
                    break
                yield chunk

    return Response(stream_with_context(gen_full()), status=200, headers={
        'Content-Length': str(file_size),
        'Content-Type':   mime_type,
        'Accept-Ranges':  'bytes',
        'Cache-Control':  'no-cache',
    })


@app.route('/static/uploads/<path:filename>')
def serve_upload_static(filename):
    return redirect(f'/video/{filename}')


# ════════════════════════════════════════════════════════
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)