# Fix redirect_uri_mismatch — Flowdoro
Error: Akses diblokir: Permintaan tidak valid — Error 400 redirect_uri_mismatch

## Penyebab
Prod curl mengirim redirect_uri=https://api.flowdoro.3scode.my.id/api/auth/callback/google
Console belum ada URI itu → Google block semua user (lokal+prod sama)

## Console checklist (copy-paste exact, tanpa trailing slash)
### Authorized JavaScript origins (8)
```
https://flowdoro.3scode.my.id
https://api.flowdoro.3scode.my.id
https://flowdoro-web.pages.dev
https://96f159ba.flowdoro-web.pages.dev
https://flowdoro.email-trisno-sanjaya.pages.dev
https://flowdoro-api.email-trisno-sanjaya.workers.dev
http://localhost:5173
http://localhost:8787
```

### Authorized redirect URIs (9)
```
http://localhost:8787/api/auth/callback/google
http://localhost:8787/api/auth/callback/github
http://localhost:8787/api/google/callback
https://api.flowdoro.3scode.my.id/api/auth/callback/google
https://api.flowdoro.3scode.my.id/api/auth/callback/github
https://api.flowdoro.3scode.my.id/api/google/callback
https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/callback/google
https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/google/callback
```

### Consent screen
- Authorized domains: 3scode.my.id
- Scopes: email, profile, openid, https://www.googleapis.com/auth/calendar.events
- Test users: tambah email yang error
- Publishing: Testing (tunggu 5 menit)

## Verifikasi
curl -s -X POST https://api.flowdoro.3scode.my.id/api/auth/sign-in/social \
 -H "Content-Type: application/json" -H "Origin: https://flowdoro.3scode.my.id" \
 -d '{"provider":"google","callbackURL":"https://flowdoro.3scode.my.id/dashboard"}' | jq -r '.url'
# decode redirect_uri harus sama dengan daftar di atas
