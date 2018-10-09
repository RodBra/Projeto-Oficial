#include <DHT.h>
#include <Adafruit_Sensor.h>

#define DHTPIN A0
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT");
  } else {
  Serial.print(t);
  Serial.print(":");
  Serial.println(h);   
  }
    
  delay(1000);
}
