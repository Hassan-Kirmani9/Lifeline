import pyodbc
import random
from datetime import datetime, timedelta

connection_string = 'DRIVER={SQL Server};SERVER=LP-024\SQLEXPRESS;DATABASE=LifeLinedb;Trusted_Connection=yes;'
connection = pyodbc.connect(connection_string)
cursor = connection.cursor()

hospital_ids = [15, 31, 32, 33, 34, 15]

blood_groups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']

start_date = datetime(2023, 11, 16)
end_date = datetime(2024, 1, 1)

current_date = start_date
while current_date < end_date:
    for hospital_id in hospital_ids:
        for blood_group in blood_groups:
            bottles_available = random.randint(1, 20)

            formatted_date = current_date.strftime('%Y-%m-%d')
            formatted_time = current_date.strftime('%H:%M:%S')

            insert_query = f"""
                INSERT INTO Blood_Availability (BA_H_ID, BA_BloodGroup, BA_BottlesAvailable, BA_Date, BA_Time)
                VALUES ({hospital_id}, '{blood_group}', {bottles_available}, '{formatted_date}', '{formatted_time}')
            """
            cursor.execute(insert_query)
            connection.commit()

    current_date += timedelta(days=1)

connection.close()