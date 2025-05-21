from sqlalchemy.orm import Session
from app.models.product_report import ProductReport
from app.schemas.product_report import ProductReportCreate

def create_product_report(db: Session, report: ProductReportCreate):
    db_report = ProductReport(
        product_id=report.product_id,
        reporter_username=report.reporter_username,
        reason=report.reason
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
