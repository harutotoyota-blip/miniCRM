import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.main import app, get_db

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

def test_create_contact(client):
    response = client.post(
        "/api/contacts",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert data["phone"] == "1234567890"

def test_create_contact_duplicate_email(client):
    # 最初のコンタクトを作成
    client.post(
        "/api/contacts",
        json={
            "name": "Test User 1",
            "email": "test@example.com",
            "phone": "1234567890"
        }
    )
    
    # 同じメールアドレスで2つ目のコンタクトを作成
    response = client.post(
        "/api/contacts",
        json={
            "name": "Test User 2",
            "email": "test@example.com",
            "phone": "0987654321"
        }
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]