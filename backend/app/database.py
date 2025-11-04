# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite データベースのURL
DATABASE_URL = "sqlite:///./mini_crm.db"

# ORM モデルの基底クラス
Base = declarative_base()

# SQLite はシングルスレッド動作なので check_same_thread=False を指定
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# セッションローカル（FastAPI の各リクエスト単位で使用）
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

# FastAPI の依存関数（リクエストごとにDBセッションを提供）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# DB初期化用の関数
def init_db():
    """
    mini_crm.db にテーブルを作成する。
    models.py のクラス定義（User, Contactなど）を基に自動生成。
    """
    from app import models
    print("✅ Creating tables in mini_crm.db ...")
    Base.metadata.create_all(bind=engine)
    print("✅ Done. Tables are ready.")


# DB初期化用の関数を単体実行したときにテーブルを自動生成
if __name__ == "__main__":
    init_db()
