#!/usr/bin/env python3
"""Daily U.S.-warehouse inventory history. Never treat network failures as zero."""
import json
import pathlib
import re
import urllib.request
import urllib.error
import datetime
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]
LEDGER = ROOT / "inventory-status.json"
TODAY = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
BASE = "https://niksremodeling.com/api/store-product?product="

def ids():
    found = set()
    for name in ("retail-catalog.js", "store-catalog.js"):
        text = (ROOT / name).read_text(encoding="utf-8")
        found.update(re.findall(r'"id"\s*:\s*"(\d{12,22})"', text))
    bathroom = (ROOT / "bathroom-shop.js").read_text(encoding="utf-8")
    block = bathroom.split("const bathroomSaved=[", 1)[1].split("\n ];", 1)[0]
    found.update(re.findall(r"id:'(\d{12,22})'", block))
    return sorted(found)

def check(pid):
    req = urllib.request.Request(BASE + pid, headers={"User-Agent": "NiksRemodeling-Inventory-Audit/1.0", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.load(res)
        if data.get("warehouseCountry") != "US" or not isinstance(data.get("variants"), list) or not isinstance(data.get("inStockUS"), bool):
            return None
        total = sum(max(0, int(v.get("usStock") or 0)) for v in data["variants"])
        return total
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError, TypeError, OSError):
        return None

def main():
    try:
        old = json.loads(LEDGER.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        old = {"items": {}}
    items = old.get("items", {})
    for pid in ids():
        count = check(pid)
        record = items.get(pid, {"zeroDays": 0, "archived": False})
        if count is None:
            record["lastCheck"] = TODAY
            record["checkState"] = "unknown"
        elif count > 0:
            record.update(lastCheck=TODAY, checkState="in_stock", lastConfirmedStock=count,
                          lastConfirmedAt=TODAY, zeroDays=0, archived=False)
        else:
            previous = record.get("lastConfirmedAt")
            yesterday = (datetime.date.fromisoformat(TODAY) - datetime.timedelta(days=1)).isoformat()
            count_days = record.get("zeroDays", 0) + 1 if previous == yesterday and record.get("lastConfirmedStock") == 0 else 1
            record.update(lastCheck=TODAY, checkState="out_of_stock", lastConfirmedStock=0,
                          lastConfirmedAt=TODAY, zeroDays=count_days, archived=count_days>=30)
        items[pid] = record
        time.sleep(0.25)
    LEDGER.write_text(json.dumps({"updatedAt": TODAY, "items": items}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print("Checked", len(ids()), "items; archived", sum(bool(v.get("archived")) for v in items.values()))

if __name__ == "__main__":
    main()
