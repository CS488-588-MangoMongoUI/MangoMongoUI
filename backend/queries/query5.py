# Peak Period Travel Times: Find the average travel time for 7-9AM and 4-6PM on September 22, 2011 for the
# I-205 NB freeway. Report travel time in minutes.

from pymongo import MongoClient
from datetime import datetime

client = MongoClient('34.69.61.31')
db = client.project
co = db.uniondata
co2 = db.detectors

start = datetime(2011, 9, 22, 7, 0, 0)
end = datetime(2011, 9, 22, 9, 0, 0)
start2 = datetime(2011, 9, 22, 16, 0, 0)
end2 = datetime(2011, 9, 22, 18, 0, 0)
highway = "I-205"
direction = "NORTH"

stations = co2.find({"highwayname": highway,
                    "direction": direction}).distinct("stationid")

total_time = 0
for station in stations:
    detectors = co.find({"detectorInfor.stationid": station,
                         "$or": [{"starttime": {"$gte": start, "$lt": end}},
                                 {"starttime": {"$gte": start2, "$lt": end2}}]})
    total_volume = 0
    volume_speed = 0
    length = co2.find_one({"stationid": station}, {"length": 1})["length"]

    for x in detectors:
        if (x["volume"] is not None) and (x["speed"] is not None):
            total_volume += x["volume"]
            volume_speed += x["speed"] * x["volume"]
    if total_volume != 0:
        avg_speed = volume_speed / total_volume
        total_time += length / avg_speed * 60

print("Total travel time for highway %s %s is: %3.2f minutes" % (highway, direction, total_time))

client.close()