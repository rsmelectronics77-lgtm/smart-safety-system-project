import { NextResponse } from 'next/server';

let latestSensorData = {
  temperature: 24.5,
  humidity: 45.0,
  gasValue: 120,
  ipAddress: "192.168.1.105",
  lastCommunication: "Henüz data gəlməyib"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    latestSensorData = {
      temperature: body.temperature ?? latestSensorData.temperature,
      humidity: body.humidity ?? latestSensorData.humidity,
      gasValue: body.gasValue ?? latestSensorData.gasValue,
      ipAddress: body.ipAddress ?? latestSensorData.ipAddress,
      lastCommunication: new Date().toLocaleTimeString('az-AZ')
    };

    return NextResponse.json({ success: true, data: latestSensorData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Məlumat oxunmadı" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestSensorData);
}
