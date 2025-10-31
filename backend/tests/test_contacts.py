import sys
from pathlib import Path

# Ensure backend/ is on sys.path so `import app` works when pytest runs from other CWDs
sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

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
    # API returns 201 Created for successful creation
    assert response.status_code == 201
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
    # Router now raises EmailAlreadyRegisteredError with a message including the email
    assert "already registered" in response.json()["detail"]


def test_create_contact_invalid_phone(client):
    # phone doesn't match the allowed pattern -> should be rejected by pydantic (422)
    response = client.post(
        "/api/contacts",
        json={
            "name": "Bad Phone",
            "email": "badphone@example.com",
            "phone": "not-a-phone"
        }
    )
    assert response.status_code == 422