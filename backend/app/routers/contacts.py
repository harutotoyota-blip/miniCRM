from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import Base, engine, get_db
from .. import models, schemas

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.post("", response_model=schemas.ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    exists = db.query(models.Contact).filter(models.Contact.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_contact = models.Contact(name=payload.name, email=payload.email, phone=payload.phone)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.get("", response_model=List[schemas.ContactOut])
def list_contacts(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    return db.query(models.Contact).offset(skip).limit(limit).all()

@router.put("/{contact_id}", response_model=schemas.ContactOut)
def update_contact(contact_id: int, payload: schemas.ContactUpdate, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if payload.name is not None:
        contact.name = payload.name
    if payload.phone is not None:
        contact.phone = payload.phone
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return None
