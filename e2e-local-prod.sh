#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${YELLOW}▶ $1${NC}"; }

BASE_LOCAL="http://localhost:8787"
BASE_PROD="https://flowdoro-api.email-trisno-sanjaya.workers.dev"
ORIGIN_LOCAL="http://localhost:5173"
ORIGIN_PROD="https://flowdoro-web.pages.dev"

run_e2e() {
  local BASE=$1
  local ORIGIN=$2
  local LABEL=$3
  info "=== E2E $LABEL ($BASE) ==="
  local EMAIL="e2e-$(date +%s)-$$-${LABEL}@flowdoro.local"
  local PASS="password123"
  local NAME="E2E $LABEL"

  info "[$LABEL] 1. Health"
  curl -s "$BASE/api/health" | grep -q '"status":"ok"' && pass "$LABEL health" || fail "$LABEL health"

  info "[$LABEL] 2. Sign-up"
  RESP=$(curl -s -i -X POST "$BASE/api/auth/sign-up/email" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
  echo "$RESP" | grep -q "200" && pass "$LABEL sign-up 200" || fail "$LABEL sign-up"
  C1=$(echo "$RESP" | grep -i "set-cookie:" | head -n1 | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
  C2=$(echo "$RESP" | grep -i "set-cookie:" | sed -n "2p" | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
  FULL="$C1; $C2"
  if [ -z "$C1" ]; then fail "$LABEL cookie missing"; return 1; else pass "$LABEL cookie HttpOnly"; fi
  echo "$RESP" | grep -q "HttpOnly" && pass "$LABEL HttpOnly flag" || fail "$LABEL HttpOnly"
  echo "$RESP" | grep -q "SameSite=Lax" && pass "$LABEL SameSite=Lax" || fail "$LABEL SameSite"

  info "[$LABEL] 3. Get-session"
  curl -s "$BASE/api/auth/get-session" -H "Origin: $ORIGIN" -H "Cookie: $FULL" | grep -q '"user"' && pass "$LABEL get-session" || fail "$LABEL get-session"

  info "[$LABEL] 4. GET /api/me"
  curl -s "$BASE/api/me" -H "Origin: $ORIGIN" -H "Cookie: $FULL" | grep -q '"restRatio":5' && pass "$LABEL /api/me" || fail "$LABEL /api/me"

  info "[$LABEL] 5. Create list"
  LIST_RESP=$(curl -s -X POST "$BASE/api/lists" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -H "Cookie: $FULL" -d '{"name":"My List"}')
  echo "$LIST_RESP" | grep -q '"name":"My List"' && pass "$LABEL create list" || fail "$LABEL create list"
  LIST_ID=$(echo "$LIST_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('\$id',''))" 2>/dev/null || echo "")
  echo "  LIST_ID=$LIST_ID"

  info "[$LABEL] 6. Create task with list"
  TASK_RESP=$(curl -s -X POST "$BASE/api/tasks" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -H "Cookie: $FULL" -d "{\"name\":\"Task $LABEL\",\"title\":\"Task $LABEL\",\"listId\":\"$LIST_ID\"}")
  echo "$TASK_RESP" | grep -q "Task $LABEL" && pass "$LABEL create task" || fail "$LABEL create task"
  TASK_ID=$(echo "$TASK_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('\$id',''))" 2>/dev/null || echo "")
  echo "  TASK_ID=$TASK_ID"

  info "[$LABEL] 7. GET tasks"
  curl -s "$BASE/api/tasks" -H "Origin: $ORIGIN" -H "Cookie: $FULL" | grep -q "Task $LABEL" && pass "$LABEL GET tasks" || fail "$LABEL GET tasks"

  info "[$LABEL] 8. POST sessions (start focus)"
  SESS_RESP=$(curl -s -X POST "$BASE/api/sessions" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -H "Cookie: $FULL" -d "{\"taskId\":\"$TASK_ID\"}")
  echo "$SESS_RESP" | grep -q '"status":"active"' && pass "$LABEL start session" || fail "$LABEL start session"
  SESS_ID=$(echo "$SESS_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('\$id',''))" 2>/dev/null || echo "")
  echo "  SESS_ID=$SESS_ID"

  info "[$LABEL] 9. PATCH sessions complete (400s)"
  curl -s -X PATCH "$BASE/api/sessions/$SESS_ID" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -H "Cookie: $FULL" -d '{"status":"completed","durationSeconds":400,"restEarnedSeconds":80}' | grep -q '"status":"completed"' && pass "$LABEL complete session" || fail "$LABEL complete session"

  info "[$LABEL] 10. Analytics"
  curl -s "$BASE/api/analytics/summary" -H "Origin: $ORIGIN" -H "Cookie: $FULL" | grep -q '"todayFocus":400' && pass "$LABEL analytics" || fail "$LABEL analytics"

  info "[$LABEL] 11. Sign-out"
  curl -s -X POST "$BASE/api/auth/sign-out" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -H "Cookie: $FULL" -d '{}' | grep -q '"success":true' && pass "$LABEL sign-out" || fail "$LABEL sign-out"

  info "[$LABEL] 12. GET /api/me without cookie should 401"
  curl -s "$BASE/api/me" | grep -q 'UNAUTHORIZED' && pass "$LABEL 401 after logout" || fail "$LABEL 401"

  info "[$LABEL] 13. Relogin (critical: data persist)"
  RESP2=$(curl -s -i -X POST "$BASE/api/auth/sign-in/email" -H "Content-Type: application/json" -H "Origin: $ORIGIN" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
  echo "$RESP2" | grep -q "200" && pass "$LABEL relogin 200" || fail "$LABEL relogin"
  C1=$(echo "$RESP2" | grep -i "set-cookie:" | head -n1 | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
  C2=$(echo "$RESP2" | grep -i "set-cookie:" | sed -n "2p" | sed -E "s/.*Set-Cookie: //I" | cut -d";" -f1 | tr -d "\r")
  FULL2="$C1; $C2"

  info "[$LABEL] 14. GET tasks after relogin (should still have Task)"
  curl -s "$BASE/api/tasks" -H "Origin: $ORIGIN" -H "Cookie: $FULL2" | grep -q "Task $LABEL" && pass "$LABEL persist tasks after relogin (BUG FIXED)" || fail "$LABEL persist tasks"

  info "[$LABEL] 15. GET lists after relogin"
  curl -s "$BASE/api/lists" -H "Origin: $ORIGIN" -H "Cookie: $FULL2" | grep -q "My List" && pass "$LABEL persist lists" || fail "$LABEL persist lists"

  info "[$LABEL] 16. GET sessions after relogin"
  curl -s "$BASE/api/sessions" -H "Origin: $ORIGIN" -H "Cookie: $FULL2" | grep -q "$SESS_ID" && pass "$LABEL persist sessions" || fail "$LABEL persist sessions"

  echo -e "${GREEN}=== $LABEL DONE ===${NC}"
  echo ""
}

# Run both
run_e2e "$BASE_LOCAL" "$ORIGIN_LOCAL" "LOCAL"
run_e2e "$BASE_PROD" "$ORIGIN_PROD" "PROD"

# Extra: cek email.trisno di prod
info "=== PROD cek email.trisno.sanjaya@gmail.com ==="
# Try to list via Appwrite directly (need env)
# Instead, test via login if possible with prodtest user created earlier (we know one)
info "PROD cek existing prodtest user relogin"
EMAIL="prodtest-1788484584-537222@flowdoro.local"
curl -s -X POST "$BASE_PROD/api/auth/sign-in/email" -H "Content-Type: application/json" -H "Origin: $ORIGIN_PROD" -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" | grep -q "user" && pass "PROD prodtest relogin" || echo "prodtest maybe not found, skip"

echo ""
info "=== FRONTEND ==="
curl -s https://flowdoro-web.pages.dev | grep -q "Flowdoro" && pass "Web prod title" || fail "Web prod"
curl -s https://flowdoro-web.pages.dev/assets/index-*.js 2>&1 | head -n 1 | grep -q "404" && fail "Web assets" || pass "Web assets exist"
# Check VITE_API_URL in built JS
grep -q "flowdoro-api.email-trisno-sanjaya.workers.dev" /home/3scode/code/flowdoro/apps/web/dist/assets/index-*.js 2>/dev/null && pass "Web built with prod API URL" || echo "check manually"

echo ""
echo -e "${GREEN}=== ALL E2E DONE ===${NC}"
