/*
  Smart Safety — ESP8266 sensor uploader
  ----------------------------------------------------------------
  Reads DHT22 (temperature/humidity) + MQ-4 (gas, analog) and POSTs
  a JSON reading to the dashboard's API every READ_INTERVAL_MS.

  Libraries needed (Arduino Library Manager):
    - ESP8266WiFi (built-in with ESP8266 board package)
    - ESP8266HTTPClient (built-in)
    - WiFiClientSecure (built-in, needed for https://)
    - DHT sensor library (by Adafruit)
    - ArduinoJson (by Benoit Blanchon)
  ----------------------------------------------------------------
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ---- CONFIGURE THESE ----
const char* WIFI_SSID     = "Rauf";
const char* WIFI_PASSWORD = "22102007";

// Your deployed dashboard, e.g. "https://smart-safety-dashboard.vercel.app/api/sensors"
const char* API_URL = "https://YOUR-PROJECT.vercel.app/api/sensors";

// Must match SENSOR_API_KEY set in Vercel's project environment variables.
// Leave as "" if you haven't set one yet (dev mode, no auth check).
const char* API_KEY = "";

#define DHTPIN   D4
#define DHTTYPE  DHT22
#define MQ4_PIN  A0

const unsigned long READ_INTERVAL_MS = 4000; // matches the dashboard's poll rate

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println("\nConnected. IP: " + WiFi.localIP().toString());
}

// Very rough MQ-4 raw-to-ppm mock scaling — replace with your own
// calibration curve once you've characterized the sensor.
float readGasPPM() {
  int raw = analogRead(MQ4_PIN); // 0-1023 on ESP8266's single ADC
  return raw * (900.0 / 1023.0);
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float gas = readGasPPM();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT22 read failed, skipping this cycle.");
    delay(READ_INTERVAL_MS);
    return;
  }

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // skip certificate validation (fine for a hobby project)

    HTTPClient http;
    http.begin(client, API_URL);
    http.addHeader("Content-Type", "application/json");
    if (strlen(API_KEY) > 0) {
      http.addHeader("x-api-key", API_KEY);
    }

    StaticJsonDocument<200> doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["gas"] = (int)gas;

    String payload;
    serializeJson(doc, payload);

    int statusCode = http.POST(payload);
    Serial.printf("POST /api/sensors -> %d\n", statusCode);
    if (statusCode > 0) {
      Serial.println(http.getString());
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected, skipping upload.");
  }

  delay(READ_INTERVAL_MS);
}
