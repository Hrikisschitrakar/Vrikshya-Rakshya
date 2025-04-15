from pydantic import BaseModel

class RemedyResponse(BaseModel):
    plant_name: str
    disease_name: str
    description: str
    remedies: str
    pesticides_fertilizers: str

    class Config:
        orm_mode = True
        from_attributes = True