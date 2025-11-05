"""
Seed script to populate database with sample Mumbai wards and projects
Run this after migrations: python -m app.scripts.seed_data
"""
import asyncio
from datetime import date, timedelta
from decimal import Decimal

from geoalchemy2.elements import WKTElement
from app.db.session import AsyncSessionLocal
from app.db import models


# Mumbai Wards data (24 administrative wards)
MUMBAI_WARDS = [
    {"name": "A Ward - Colaba", "code": "A"},
    {"name": "B Ward - Dongri", "code": "B"},
    {"name": "C Ward - Kalbadevi", "code": "C"},
    {"name": "D Ward - Grant Road", "code": "D"},
    {"name": "E Ward - Byculla", "code": "E"},
    {"name": "F/N Ward - Matunga", "code": "F"},
    {"name": "F/S Ward - Parel", "code": "F/S"},
    {"name": "G/N Ward - Dadar", "code": "G/N"},
    {"name": "G/S Ward - Worli", "code": "G/S"},
    {"name": "H/E Ward - Bandra East", "code": "H/E"},
    {"name": "H/W Ward - Bandra West", "code": "H/W"},
    {"name": "K/E Ward - Andheri East", "code": "K/E"},
    {"name": "K/W Ward - Andheri West", "code": "K/W"},
    {"name": "L Ward - Kurla", "code": "L"},
    {"name": "M/E Ward - Chembur", "code": "M/E"},
    {"name": "M/W Ward - Mankhurd", "code": "M/W"},
    {"name": "N Ward - Ghatkopar", "code": "N"},
    {"name": "P/N Ward - Malad", "code": "P/N"},
    {"name": "P/S Ward - Goregaon", "code": "P/S"},
    {"name": "R/C Ward - Borivali West", "code": "R/C"},
    {"name": "R/N Ward - Dahisar", "code": "R/N"},
    {"name": "R/S Ward - Kandivali", "code": "R/S"},
    {"name": "S Ward - Bhandup", "code": "S"},
    {"name": "T Ward - Mulund", "code": "T"},
]


# Sample contractors
CONTRACTORS = [
    {
        "name": "Larsen & Toubro Ltd",
        "registration_number": "L99999MH1946PLC004768",
        "address": "L&T House, Ballard Estate, Mumbai 400001",
        "contact_info": {"phone": "+91-22-6752-5656", "website": "www.larsentoubro.com"}
    },
    {
        "name": "Shapoorji Pallonji & Co Ltd",
        "registration_number": "U45200MH1988PLC048329",
        "address": "SP Infocity, 243, Marol, Andheri East, Mumbai 400059",
        "contact_info": {"phone": "+91-22-6112-3456", "website": "www.shapoorjipallonji.com"}
    },
    {
        "name": "Hindustan Construction Company",
        "registration_number": "L45200MH1926PLC001175",
        "address": "Hincon House, Bandra Kurla Complex, Mumbai 400051",
        "contact_info": {"phone": "+91-22-6778-4000", "website": "www.hccindia.com"}
    },
    {
        "name": "NCC Limited",
        "registration_number": "L45200TG1978PLC002296",
        "address": "NCC House, Madhapur, Hyderabad",
        "contact_info": {"phone": "+91-40-2342-0451", "website": "www.ncclimited.com"}
    },
    {
        "name": "Afcons Infrastructure Ltd",
        "registration_number": "U45203MH1976PLC019384",
        "address": "Afcons House, 14 Udyog Vihar, Greater Noida 201306",
        "contact_info": {"phone": "+91-120-254-5000", "website": "www.afcons.com"}
    }
]


# Sample data sources
SOURCES = [
    {
        "name": "MCGM Tenders Portal",
        "source_type": "website",
        "url": "https://portal.mcgm.gov.in/irj/portal/anonymous/qltenders",
        "notes": "Official Municipal Corporation of Greater Mumbai tender portal"
    },
    {
        "name": "Mumbai Smart City",
        "source_type": "website",
        "url": "https://mumbai.smartcity.org.in",
        "notes": "Mumbai Smart City Mission official website"
    },
    {
        "name": "Citizen Reports",
        "source_type": "citizen",
        "url": None,
        "notes": "User-submitted reports and updates"
    },
    {
        "name": "Data.gov.in",
        "source_type": "api",
        "url": "https://data.gov.in",
        "notes": "Open government data portal"
    }
]


async def seed_database():
    """Main seed function"""
    async with AsyncSessionLocal() as db:
        try:
            print("🌱 Starting database seeding...")
            
            # 1. Create wards
            print("\n📍 Creating Mumbai wards...")
            ward_objects = []
            for ward_data in MUMBAI_WARDS:
                ward = models.Ward(**ward_data)
                db.add(ward)
                ward_objects.append(ward)
            await db.commit()
            print(f"✅ Created {len(ward_objects)} wards")
            
            # Refresh to get IDs
            for ward in ward_objects:
                await db.refresh(ward)
            
            # 2. Create contractors
            print("\n🏗️ Creating contractors...")
            contractor_objects = []
            for contractor_data in CONTRACTORS:
                contractor = models.Contractor(**contractor_data)
                db.add(contractor)
                contractor_objects.append(contractor)
            await db.commit()
            print(f"✅ Created {len(contractor_objects)} contractors")
            
            for contractor in contractor_objects:
                await db.refresh(contractor)
            
            # 3. Create sources
            print("\n📊 Creating data sources...")
            source_objects = []
            for source_data in SOURCES:
                source = models.Source(**source_data)
                db.add(source)
                source_objects.append(source)
            await db.commit()
            print(f"✅ Created {len(source_objects)} sources")
            
            for source in source_objects:
                await db.refresh(source)
            
            # 4. Create sample projects
            print("\n🚧 Creating sample projects...")
            
            sample_projects = [
                {
                    "title": "Coastal Road Project - Phase 1",
                    "description": "Construction of coastal road from Marine Drive to Worli with sea link and tunnels",
                    "ward_id": ward_objects[8].id,  # G/S Ward - Worli
                    "status": "in_progress",
                    "budget_amount": Decimal("12500000000"),  # 12,500 crores
                    "budget_currency": "INR",
                    "start_date": date(2023, 1, 15),
                    "expected_end_date": date(2025, 12, 31),
                    "confidence_score": Decimal("0.95"),
                    "external_ids": {"mcgm": "MCGM-COAST-2023-001"},
                    "centroid": "POINT(72.8162 18.9932)"  # Worli Sea Face
                },
                {
                    "title": "Andheri Metro Station Upgradation",
                    "description": "Modernization and capacity expansion of Andheri Metro station with improved connectivity",
                    "ward_id": ward_objects[11].id,  # K/E Ward - Andheri East
                    "status": "tendered",
                    "budget_amount": Decimal("850000000"),  # 850 crores
                    "budget_currency": "INR",
                    "start_date": date(2024, 6, 1),
                    "expected_end_date": date(2026, 3, 31),
                    "confidence_score": Decimal("0.88"),
                    "external_ids": {"mmrc": "MMRC-ANE-2024-012"},
                    "centroid": "POINT(72.8697 19.1197)"  # Andheri East
                },
                {
                    "title": "Bandra-Kurla Complex Road Widening",
                    "description": "Road widening and junction improvements in BKC area for better traffic flow",
                    "ward_id": ward_objects[9].id,  # H/E Ward - Bandra East
                    "status": "awarded",
                    "budget_amount": Decimal("450000000"),  # 450 crores
                    "budget_currency": "INR",
                    "start_date": date(2024, 2, 1),
                    "expected_end_date": date(2025, 8, 31),
                    "confidence_score": Decimal("0.92"),
                    "centroid": "POINT(72.8681 19.0633)"  # BKC
                },
                {
                    "title": "Colaba Water Supply Network Upgrade",
                    "description": "Replacement of aging water supply pipelines and installation of smart meters",
                    "ward_id": ward_objects[0].id,  # A Ward - Colaba
                    "status": "in_progress",
                    "budget_amount": Decimal("280000000"),  # 280 crores
                    "budget_currency": "INR",
                    "start_date": date(2023, 9, 1),
                    "expected_end_date": date(2024, 12, 31),
                    "confidence_score": Decimal("0.85"),
                    "centroid": "POINT(72.8347 18.9067)"  # Colaba
                },
                {
                    "title": "Malad Smart City Initiative",
                    "description": "Integrated smart city infrastructure including WiFi, CCTV, smart lighting and waste management",
                    "ward_id": ward_objects[17].id,  # P/N Ward - Malad
                    "status": "proposed",
                    "budget_amount": Decimal("620000000"),  # 620 crores
                    "budget_currency": "INR",
                    "start_date": None,
                    "expected_end_date": None,
                    "confidence_score": Decimal("0.65"),
                    "centroid": "POINT(72.8489 19.1866)"  # Malad
                },
                {
                    "title": "Dadar Market Renovation",
                    "description": "Complete renovation of Dadar flower and vegetable market with modern facilities",
                    "ward_id": ward_objects[7].id,  # G/N Ward - Dadar
                    "status": "completed",
                    "budget_amount": Decimal("150000000"),  # 150 crores
                    "budget_currency": "INR",
                    "start_date": date(2022, 4, 1),
                    "expected_end_date": date(2023, 10, 31),
                    "confidence_score": Decimal("0.98"),
                    "centroid": "POINT(72.8431 19.0176)"  # Dadar
                },
                {
                    "title": "Borivali National Park Buffer Zone Development",
                    "description": "Eco-tourism infrastructure and buffer zone development around Sanjay Gandhi National Park",
                    "ward_id": ward_objects[19].id,  # R/C Ward - Borivali West
                    "status": "in_progress",
                    "budget_amount": Decimal("320000000"),  # 320 crores
                    "budget_currency": "INR",
                    "start_date": date(2023, 11, 1),
                    "expected_end_date": date(2025, 6, 30),
                    "confidence_score": Decimal("0.78"),
                    "centroid": "POINT(72.8593 19.2403)"  # Borivali
                },
                {
                    "title": "Kurla MSEB Substation Modernization",
                    "description": "Upgrading electrical substation to improve power distribution reliability",
                    "ward_id": ward_objects[13].id,  # L Ward - Kurla
                    "status": "tendered",
                    "budget_amount": Decimal("180000000"),  # 180 crores
                    "budget_currency": "INR",
                    "start_date": date(2024, 8, 1),
                    "expected_end_date": date(2025, 12, 31),
                    "confidence_score": Decimal("0.82"),
                    "centroid": "POINT(72.8794 19.0728)"  # Kurla
                }
            ]
            
            project_objects = []
            for project_data in sample_projects:
                # Convert centroid string to WKTElement for PostGIS
                if "centroid" in project_data:
                    project_data["centroid"] = WKTElement(project_data["centroid"], srid=4326)
                
                project = models.Project(**project_data)
                db.add(project)
                project_objects.append(project)
            await db.commit()
            print(f"✅ Created {len(project_objects)} sample projects")
            
            for project in project_objects:
                await db.refresh(project)
            
            # 5. Create some tenders
            print("\n📋 Creating sample tenders...")
            tenders = [
                {
                    "tender_number": "MCGM/CE/2024/001",
                    "title": "Andheri Metro Station Upgradation - Civil Works",
                    "issuing_agency": "Mumbai Metro Rail Corporation",
                    "project_id": project_objects[1].id,
                    "tender_value": Decimal("850000000"),
                    "publish_date": date(2024, 3, 15),
                    "close_date": date(2024, 5, 15),
                    "award_date": None,
                    "source": {"url": "https://portal.mcgm.gov.in/tender/001"}
                },
                {
                    "tender_number": "MCGM/WD/2024/045",
                    "title": "Colaba Water Pipeline Replacement",
                    "issuing_agency": "MCGM Water Department",
                    "project_id": project_objects[3].id,
                    "tender_value": Decimal("280000000"),
                    "publish_date": date(2023, 7, 1),
                    "close_date": date(2023, 8, 15),
                    "award_date": date(2023, 8, 25),
                    "awarded_to": contractor_objects[2].id,
                    "source": {"url": "https://portal.mcgm.gov.in/tender/045"}
                }
            ]
            
            for tender_data in tenders:
                tender = models.Tender(**tender_data)
                db.add(tender)
            await db.commit()
            print(f"✅ Created {len(tenders)} tenders")
            
            # 6. Create sample contracts
            print("\n📑 Creating sample contracts...")
            contracts = [
                {
                    "project_id": project_objects[2].id,  # BKC Road Widening
                    "contractor_id": contractor_objects[0].id,  # L&T
                    "contract_value": Decimal("450000000"),
                    "start_date": date(2024, 2, 1),
                    "completion_date": date(2025, 8, 31),
                    "status": "active"
                },
                {
                    "project_id": project_objects[3].id,  # Colaba Water
                    "contractor_id": contractor_objects[2].id,  # HCC
                    "contract_value": Decimal("280000000"),
                    "start_date": date(2023, 9, 1),
                    "completion_date": date(2024, 12, 31),
                    "status": "active"
                }
            ]
            
            for contract_data in contracts:
                contract = models.Contract(**contract_data)
                db.add(contract)
            await db.commit()
            print(f"✅ Created {len(contracts)} contracts")
            
            # 7. Create sample progress updates
            print("\n📸 Creating sample progress updates...")
            updates = [
                {
                    "project_id": project_objects[0].id,  # Coastal Road
                    "source_id": source_objects[0].id,
                    "update_type": "official",
                    "title": "Phase 1 - 60% Complete",
                    "description": "Marine Drive to Worli section progressing on schedule. Tunnel boring completed.",
                    "reported_at": date.today() - timedelta(days=15),
                    "verified": True,
                    "confidence_score": Decimal("0.95")
                },
                {
                    "project_id": project_objects[3].id,  # Colaba Water
                    "source_id": source_objects[2].id,
                    "update_type": "citizen",
                    "title": "Construction causing traffic issues",
                    "description": "Road dug up for pipeline work. Significant traffic congestion in the area.",
                    "reported_at": date.today() - timedelta(days=3),
                    "verified": False,
                    "confidence_score": Decimal("0.70")
                }
            ]
            
            for update_data in updates:
                update = models.ProgressUpdate(**update_data)
                db.add(update)
            await db.commit()
            print(f"✅ Created {len(updates)} progress updates")
            
            print("\n✅ Database seeding completed successfully!")
            print(f"\n📊 Summary:")
            print(f"   - {len(ward_objects)} wards")
            print(f"   - {len(contractor_objects)} contractors")
            print(f"   - {len(source_objects)} data sources")
            print(f"   - {len(project_objects)} projects")
            print(f"   - {len(tenders)} tenders")
            print(f"   - {len(contracts)} contracts")
            print(f"   - {len(updates)} progress updates")
            
        except Exception as e:
            print(f"\n❌ Error seeding database: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_database())
