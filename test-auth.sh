#!/bin/bash
set -e
BASE="http://localhost:8787"
EMAIL="test-$(date +%s)-$$@flowdoro.local"
PASS="password123"
NAME="Test User Auth"
echo "=== Flowdoro Better Auth Local Test ==="
echo "BASE=$BASE EMAIL=$EMAIL"
echo ""
echo "[1] Health"
curl -s "$BASE/api/health" | python3 -m json.tool
echo ""
echo "[2] Migrate (idempotent)"
curl -s -X POST "$BASE/api/auth/migrate" | python3 -m json.tool || true
echo ""
echo "[3] Sign-up (should 200 + Set-Cookie)"
RESP=$(curl -s -i -X POST "$BASE/api/auth/sign-up/email" -H "Content-Type: application/json" -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
echo "$RESP" | head -n 30
echo "$RESP" | grep -i set-cookie || echo "no set-cookie"
JSON=$(echo "$RESP" | tail -n1)
echo "JSON:"; echo "$JSON" | python3 -m json.tool || echo "$JSON"
# Extract cookies
COOKIE1=$(echo "$RESP" | grep -i "set-cookie:" | head -n1 | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
COOKIE2=$(echo "$RESP" | grep -i "set-cookie:" | sed -n "2p" | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
FULL="$COOKIE1; $COOKIE2"
echo "COOKIE1=$COOKIE1"
echo "COOKIE2 len=$(echo $COOKIE2 | wc -c)"
echo ""
echo "[4] Duplicate sign-up (should error)"
curl -s -X POST "$BASE/api/auth/sign-up/email" -H "Content-Type: application/json" -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | python3 -m json.tool || true
echo ""
echo "[5] Sign-in correct"
RESP2=$(curl -s -i -X POST "$BASE/api/auth/sign-in/email" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
echo "$RESP2" | head -n 30
COOKIE1b=$(echo "$RESP2" | grep -i "set-cookie:" | head -n1 | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
COOKIE2b=$(echo "$RESP2" | grep -i "set-cookie:" | sed -n "2p" | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
FULLB="$COOKIE1b; $COOKIE2b"
echo "FULLB len=$(echo $FULLB | wc -c)"
if [ -n "$COOKIE1b" ]; then FULL="$FULLB"; echo "Using sign-in cookies"; fi
echo ""
echo "[6] Sign-in wrong password (should 401/400)"
curl -s -X POST "$BASE/api/auth/sign-in/email" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpass\"}" | python3 -m json.tool || true
echo ""
echo "[7] Get-session with cookie (should 200 with user)"
curl -s "$BASE/api/auth/get-session" -H "Cookie: $FULL" | python3 -m json.tool | head -n 60
echo ""
echo "[8] Get-session without cookie (should null)"
curl -s "$BASE/api/auth/get-session" | python3 -m json.tool | head -n 60
echo ""
echo "[9] GET /api/me with cookie (protected, should 200 + profile restRatio)"
curl -s "$BASE/api/me" -H "Cookie: $FULL" | python3 -m json.tool | head -n 60
echo ""
echo "[10] GET /api/me without cookie (should 401)"
curl -s "$BASE/api/me" | python3 -m json.tool
echo ""
echo "[11] GET /api/tasks with cookie (should 200 array)"
curl -s "$BASE/api/tasks" -H "Cookie: $FULL" | python3 -m json.tool | head -n 60
echo ""
echo "[12] POST /api/tasks with cookie (create)"
TASK_RESP=$(curl -s -X POST "$BASE/api/tasks" -H "Content-Type: application/json" -H "Cookie: $FULL" -d '{"name":"Test Task Auth"}')
echo "$TASK_RESP" | python3 -m json.tool | head -n 60
TASK_ID=$(echo "$TASK_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('\$id','') or d.get('data',{}).get('id','') or '')" 2>/dev/null || echo "")
echo "TASK_ID=$TASK_ID"
echo ""
echo "[13] POST /api/sessions start focus with task"
SESS_RESP=$(curl -s -X POST "$BASE/api/sessions" -H "Content-Type: application/json" -H "Cookie: $FULL" -d "{\"taskId\": \"$TASK_ID\"}")
echo "$SESS_RESP" | python3 -m json.tool | head -n 80
SESS_ID=$(echo "$SESS_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('\$id','') or d.get('data',{}).get('id','') or '')" 2>/dev/null || echo "")
echo "SESS_ID=$SESS_ID"
echo ""
echo "[14] PATCH /api/sessions/:id complete (5 min focus -> 1 min rest)"
if [ -n "$SESS_ID" ]; then
  curl -s -X PATCH "$BASE/api/sessions/$SESS_ID" -H "Content-Type: application/json" -H "Cookie: $FULL" -d '{"status":"completed","durationSeconds":300,"restEarnedSeconds":60}' | python3 -m json.tool | head -n 80
else echo "no sess id"
fi
echo ""
echo "[15] GET /api/analytics/summary with cookie"
curl -s "$BASE/api/analytics/summary" -H "Cookie: $FULL" | python3 -m json.tool | head -n 80
echo ""
echo "[16] Sign-out (should clear cookie)"
curl -s -i -X POST "$BASE/api/auth/sign-out" -H "Cookie: $FULL" | head -n 30
echo ""
echo "[17] GET /api/me after sign-out without cookie (should 401)"
curl -s "$BASE/api/me" | python3 -m json.tool
echo ""
echo "[18] Legacy Appwrite login fallback still works? (demo@flowdoro.app via old route)"
curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"email":"demo@flowdoro.app","password":"password123"}' | python3 -m json.tool | head -n 80
echo ""
echo "=== DONE ==="
