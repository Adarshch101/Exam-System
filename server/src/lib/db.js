import dotenv from 'dotenv';

dotenv.config();

let db; // mysql2/promise pool with helpers

export async function initDb() {
  const mysql = await import('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql.railway.internal',
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Ensure schema (idempotent)
  await pool.query('CREATE TABLE IF NOT EXISTS users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(191) NOT NULL UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  role ENUM(\'student\',\'instructor\',\'admin\') NOT NULL DEFAULT "student",\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB;');

  await pool.query('CREATE TABLE IF NOT EXISTS exams (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  title VARCHAR(200) NOT NULL,\n  description TEXT,\n  duration_minutes INT NOT NULL,\n  instructor_id INT NULL,\n  scheduled_at DATETIME NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL\n) ENGINE=InnoDB;');

  // Defensive migration: ensure instructor_id exists on legacy DBs
  try {
    const [cols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'exams' AND COLUMN_NAME = 'instructor_id'",
      [process.env.DB_NAME]
    );
    if (!Array.isArray(cols) || cols.length === 0) {
      await pool.query('ALTER TABLE exams ADD COLUMN instructor_id INT NULL');
      await pool.query('ALTER TABLE exams ADD CONSTRAINT fk_exams_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL').catch(()=>{});
    }
  } catch (e) {
    await pool.query('ALTER TABLE exams ADD COLUMN IF NOT EXISTS instructor_id INT NULL').catch(()=>{});
    await pool.query('ALTER TABLE exams ADD CONSTRAINT fk_exams_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL').catch(()=>{});
  }

  // Defensive migration: ensure scheduled_at exists on legacy DBs
  try {
    const [cols2] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'exams' AND COLUMN_NAME = 'scheduled_at'",
      [process.env.DB_NAME]
    );
    if (!Array.isArray(cols2) || cols2.length === 0) {
      await pool.query('ALTER TABLE exams ADD COLUMN scheduled_at DATETIME NULL');
    }
  } catch (e) {
    await pool.query('ALTER TABLE exams ADD COLUMN IF NOT EXISTS scheduled_at DATETIME NULL').catch(()=>{});
  }

  // Defensive migration: if legacy DB has a strict created_by column, relax it
  try {
    const [createdByCols] = await pool.query(
      "SELECT IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'exams' AND COLUMN_NAME = 'created_by'",
      [process.env.DB_NAME]
    );
    if (Array.isArray(createdByCols) && createdByCols.length > 0) {
      const col = createdByCols[0];
      const isNullable = (col.IS_NULLABLE || '').toUpperCase() === 'YES';
      const hasDefault = col.COLUMN_DEFAULT !== null && col.COLUMN_DEFAULT !== undefined;
      if (!isNullable && !hasDefault) {
        await pool.query('ALTER TABLE exams MODIFY COLUMN created_by INT NULL');
        // Optionally add FK; ignore errors if constraint exists
        await pool.query('ALTER TABLE exams ADD CONSTRAINT fk_exams_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL').catch(()=>{});
      }
    }
  } catch (e) {
    // Best-effort fallback: attempt to relax nullability if server supports it
    await pool.query('ALTER TABLE exams MODIFY COLUMN created_by INT NULL').catch(()=>{});
  }
  await pool.query('CREATE TABLE IF NOT EXISTS questions (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  exam_id INT NOT NULL,\n  text TEXT NOT NULL,\n  option_a TEXT NOT NULL,\n  option_b TEXT NOT NULL,\n  option_c TEXT NOT NULL,\n  option_d TEXT NOT NULL,\n  correct_option ENUM(\'A\',\'B\',\'C\',\'D\') NOT NULL,\n  marks INT NOT NULL DEFAULT 1,\n  negative_marks DECIMAL(5,2) DEFAULT 0,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE\n) ENGINE=InnoDB;').catch(()=>{});

  // Defensive migration: ensure all expected columns exist on questions
  try {
    const [qcols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'questions'",
      [process.env.DB_NAME]
    );
    const have = new Set(Array.isArray(qcols) ? qcols.map(r => r.COLUMN_NAME) : []);

    // If legacy column 'question_text' exists and 'text' does not, rename it
    if (have.has('question_text') && !have.has('text')) {
      await pool.query('ALTER TABLE questions CHANGE COLUMN question_text text TEXT NOT NULL');
      have.add('text');
    }

    const addIfMissing = async (name, ddl) => {
      if (!have.has(name)) {
        await pool.query(`ALTER TABLE questions ADD COLUMN ${ddl}`);
      }
    };
    // Ensure legacy question_text won't block inserts if it still exists
    if (have.has('question_text')) {
      await pool.query('ALTER TABLE questions MODIFY COLUMN question_text TEXT NULL').catch(()=>{});
    }
    await addIfMissing('text', 'text TEXT NULL');
    await addIfMissing('option_a', 'option_a TEXT NULL');
    await addIfMissing('option_b', 'option_b TEXT NULL');
    await addIfMissing('option_c', 'option_c TEXT NULL');
    await addIfMissing('option_d', 'option_d TEXT NULL');
    await addIfMissing('correct_option', "correct_option ENUM('A','B','C','D') NULL");
    await addIfMissing('marks', 'marks INT NOT NULL DEFAULT 1');
    await addIfMissing('negative_marks', 'negative_marks DECIMAL(5,2) DEFAULT 0');
    await addIfMissing('created_at', 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  } catch (e) {
    // Fallback best-effort adds (ignore errors)
    await pool.query('ALTER TABLE questions ADD COLUMN text TEXT NULL').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN option_a TEXT NULL').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN option_b TEXT NULL').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN option_c TEXT NULL').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN option_d TEXT NULL').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN marks INT NOT NULL DEFAULT 1').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN negative_marks DECIMAL(5,2) DEFAULT 0').catch(()=>{});
    await pool.query('ALTER TABLE questions ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP').catch(()=>{});
  }

  await pool.query('CREATE TABLE IF NOT EXISTS submissions (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  exam_id INT NOT NULL,\n  student_id INT NOT NULL,\n  score DECIMAL(7,2) NOT NULL DEFAULT 0,\n  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,\n  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE\n ) ENGINE=InnoDB;');

  await pool.query('CREATE TABLE IF NOT EXISTS answers (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  submission_id INT NOT NULL,\n  question_id INT NOT NULL,\n  chosen_option ENUM(\'A\',\'B\',\'C\',\'D\') NULL,\n  is_correct TINYINT(1) NOT NULL DEFAULT 0,\n  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,\n  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE\n) ENGINE=InnoDB;');

  await pool.query('CREATE INDEX IF NOT EXISTS idx_exams_instructor ON exams(instructor_id);').catch(()=>{});
  await pool.query('CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);').catch(()=>{});

  // Defensive migration: drop legacy unique constraint if present
  await pool.query('CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);').catch(()=>{});
  // Ensure cooldown-friendly index and drop legacy unique constraint if present
  try {
    await pool.query('ALTER TABLE submissions DROP INDEX uniq_submission');
  } catch (e) {
    // ignore if it does not exist
  }
  await pool.query('CREATE INDEX IF NOT EXISTS idx_submissions_exam_student_time ON submissions(exam_id, student_id, submitted_at)')
    .catch(()=>{});

  // Helpers to match prior sqlite API
  pool.get = async (sql, ...params) => {
    const [rows] = await pool.query(sql, params);
    return Array.isArray(rows) ? rows[0] : undefined;
  };
  pool.all = async (sql, ...params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  };
  pool.run = async (sql, ...params) => {
    const [result] = await pool.query(sql, params);
    return { lastID: result?.insertId ?? 0, changes: result?.affectedRows ?? 0 };
  };
  pool.prepare = async (sql) => ({
    run: async (...params) => {
      const [result] = await pool.query(sql, params);
      return { lastID: result?.insertId ?? 0, changes: result?.affectedRows ?? 0 };
    },
    finalize: async () => {},
  });

  db = pool;
  return pool;
}

export { db };
