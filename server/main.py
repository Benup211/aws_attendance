from typing import Union
import pandas as pd
from fastapi import FastAPI,HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()

origins = [
    os.getenv("ORIGIN_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/attendance")
async def read_attendance():
    try:
    
        df = pd.read_csv('attendance.csv')
        present_records = df[df['Attendance'] == 'Present']

        result = present_records[['Email Address', 'Name','Attendance','Time']].to_dict(orient='records')

        return JSONResponse(content=result)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

class AttendanceCheck(BaseModel):
    name: str
    email: str

@app.post("/check_attendance")
async def check_attendance(attendance_check: AttendanceCheck):
    try:
        df = pd.read_csv('attendance.csv')
        record = df[(df['Name'] == str(attendance_check.name)) | (df['Email Address'] == str(attendance_check.email))]
        if record.empty:
            return JSONResponse(content={
                "Message": "No record found with the provided Name or Email Address"
            }, status_code=400)
        current_date = datetime.now().strftime('%Y-%m-%d')
        attendance_value = record['Attendance'].values[0]
        time_value = record['Time'].values[0]
        if pd.isna(attendance_value) or pd.isna(time_value):
            df.loc[(df['Name'] == attendance_check.name) | (df['Email Address'] == attendance_check.email), 'Attendance'] = "Present"
            df.loc[(df['Name'] == attendance_check.name) | (df['Email Address'] == attendance_check.email), 'Time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            df.to_csv('attendance.csv', index=False)
            return JSONResponse(content={"Attendance": "Present", "Time": datetime.now().strftime('%Y-%m-%d %H:%M:%S')},status_code=201)
        return JSONResponse(content={"Attendance": attendance_value, "Time": time_value},status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)