from fastapi import HTTPException, status

class ContactException(HTTPException):
    """連絡先に関する基本例外クラス"""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ContactNotFoundError(ContactException):
    """連絡先が見つからない場合の例外"""
    def __init__(self, contact_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

class EmailAlreadyRegisteredError(ContactException):
    """メールアドレスが既に登録されている場合の例外"""
    def __init__(self, email: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {email} already registered"
        )