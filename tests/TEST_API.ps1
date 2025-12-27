# Test Suite - PlanEtude Backend v2.1
# Tests d'integration - API Distante

#Requires -Version 5.0

$ErrorActionPreference = 'Continue'

# =====================================================
# EFFACER LA BASE DE DONNEES
# =====================================================

Write-Host "Effacement de la base de donnees..." -ForegroundColor Yellow
try {
  $output = & pnpm exec ts-node clear-db.ts 2>&1
  Write-Host $output
  Write-Host ""
} catch {
  Write-Host "Erreur lors de l'effacement de la BD: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# =====================================================
# CONFIGURATION
# =====================================================

$API_URL = "https://plan-etude.koyeb.app"
$EMAIL = "test$(Get-Date -UFormat '%s')@example.com"
$PASSWORD = "TestPass123!"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  TEST SUITE - PlanEtude Backend v2.1" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API: $API_URL"
Write-Host ""

# =====================================================
# VARIABLES GLOBALES
# =====================================================

$test_count = 0
$pass_count = 0
$USER_ID = ""
$TOKEN = ""
$REFRESH_TOKEN = ""
$PLANNING_ID = ""
$REMINDER_ID = ""

# =====================================================
# FONCTION DE TEST
# =====================================================

function Test-Endpoint {
  param(
    [string]$method,
    [string]$endpoint,
    [string]$data,
    [int]$expected_code,
    [string]$token
  )
  
  $script:test_count++
  Write-Host "[TEST $test_count] $method $endpoint" -ForegroundColor Cyan
  
  $headers = @{'Content-Type' = 'application/json'}
  
  if (-not [string]::IsNullOrEmpty($token)) {
    $headers['Authorization'] = "Bearer $token"
  }
  
  try {
    if ($method -eq "GET") {
      $response = Invoke-WebRequest -Uri "$API_URL$endpoint" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    } else {
      $response = Invoke-WebRequest -Uri "$API_URL$endpoint" `
        -Method $method `
        -Headers $headers `
        -Body $data `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    }
    $http_code = $response.StatusCode
    $body = $response.Content
  } catch {
    $http_code = $_.Exception.Response.StatusCode.Value
    if ([string]::IsNullOrEmpty($http_code)) { $http_code = 0 }
    $body = ""
  }
  
  if ($http_code -eq $expected_code) {
    Write-Host "[OK] Reussi (HTTP $http_code)" -ForegroundColor Green
    $script:pass_count++
    if ($body) {
      try {
        $body | ConvertFrom-Json | ConvertTo-Json -Depth 2
      } catch {
        $body
      }
    }
  } else {
    Write-Host "[FAIL] Echoue (Expected $expected_code, got $http_code)" -ForegroundColor Red
    if ($body) {
      try {
        $body | ConvertFrom-Json | ConvertTo-Json -Depth 2
      } catch {
        $body
      }
    }
  }
  Write-Host ""
}

# =====================================================
# TEST 1: SANTE DE L'API
# =====================================================

Write-Host "=== SANTE DE L'API ===" -ForegroundColor Yellow
Test-Endpoint "GET" "/" "" 200 ""

# =====================================================
# TEST 2: AUTHENTIFICATION - INSCRIPTION
# =====================================================

Write-Host "=== AUTHENTIFICATION ===" -ForegroundColor Yellow

$register_data = @{
  name = "Test User"
  email = $EMAIL
  password = $PASSWORD
  gender = "M"
} | ConvertTo-Json -Depth 10

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/auth/register" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $register_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $json = $response.Content | ConvertFrom-Json
  $script:USER_ID = $json._id
  $script:TOKEN = $json.token
  $script:REFRESH_TOKEN = $json.refreshToken
  $script:test_count++
  
  if (-not [string]::IsNullOrEmpty($USER_ID) -and $USER_ID -ne "null") {
    Write-Host "[TEST $test_count] POST /api/auth/register" -ForegroundColor Cyan
    Write-Host "[OK] Inscription reussie" -ForegroundColor Green
    Write-Host "  User ID: $USER_ID"
    $script:pass_count++
  } else {
    Write-Host "[TEST $test_count] POST /api/auth/register" -ForegroundColor Cyan
    Write-Host "[FAIL] Inscription echouee" -ForegroundColor Red
    Write-Host $response.Content
  }
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/auth/register" -ForegroundColor Cyan
  Write-Host "[FAIL] Inscription echouee" -ForegroundColor Red
  Write-Host $_.Exception.Message
}
Write-Host ""

# =====================================================
# TEST 3: CONNEXION
# =====================================================

$login_data = @{
  email = $EMAIL
  password = $PASSWORD
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/auth/login" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $login_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $json = $response.Content | ConvertFrom-Json
  $script:TOKEN = $json.token
  $script:test_count++
  
  if (-not [string]::IsNullOrEmpty($TOKEN) -and $TOKEN -ne "null") {
    Write-Host "[TEST $test_count] POST /api/auth/login" -ForegroundColor Cyan
    Write-Host "[OK] Connexion reussie" -ForegroundColor Green
    $script:pass_count++
  } else {
    Write-Host "[TEST $test_count] POST /api/auth/login" -ForegroundColor Cyan
    Write-Host "[FAIL] Connexion echouee" -ForegroundColor Red
  }
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/auth/login" -ForegroundColor Cyan
  Write-Host "[FAIL] Connexion echouee" -ForegroundColor Red
}
Write-Host ""

# =====================================================
# TEST 4: REFRESH TOKEN
# =====================================================

if (-not [string]::IsNullOrEmpty($REFRESH_TOKEN)) {
  $refresh_data = @{
    token = $REFRESH_TOKEN
  } | ConvertTo-Json
  
  try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/refresh" `
      -Method POST `
      -Headers @{'Content-Type' = 'application/json'} `
      -Body $refresh_data `
      -UseBasicParsing `
      -ErrorAction SilentlyContinue
    
    $json = $response.Content | ConvertFrom-Json
    $script:TOKEN = $json.token
    $script:test_count++
    
    if (-not [string]::IsNullOrEmpty($TOKEN) -and $TOKEN -ne "null") {
      Write-Host "[TEST $test_count] POST /api/auth/refresh" -ForegroundColor Cyan
      Write-Host "[OK] Refresh token reussi" -ForegroundColor Green
      $script:pass_count++
    } else {
      Write-Host "[TEST $test_count] POST /api/auth/refresh" -ForegroundColor Cyan
      Write-Host "[FAIL] Refresh token echoue" -ForegroundColor Red
    }
  } catch {
    $script:test_count++
    Write-Host "[TEST $test_count] POST /api/auth/refresh" -ForegroundColor Cyan
    Write-Host "[FAIL] Refresh token echoue" -ForegroundColor Red
  }
  Write-Host ""
}

# =====================================================
# TEST 5: PROFIL UTILISATEUR
# =====================================================

Write-Host "=== PROFIL UTILISATEUR ===" -ForegroundColor Yellow
Test-Endpoint "GET" "/api/users/profile" "" 200 $TOKEN

$update_profile = @{
  name = "Test User Updated"
  preferences = @{
    matieres = @("Maths", "Francais")
    themes = @("dark")
  }
} | ConvertTo-Json -Depth 10

Test-Endpoint "PUT" "/api/users/profile" $update_profile 200 $TOKEN

# =====================================================
# TEST 6: PLANNING
# =====================================================

Write-Host "=== PLANNING ===" -ForegroundColor Yellow

$planning_data = @{
  periode = "semaine"
  dateDebut = "2025-12-29T09:00:00"
  sessions = @(
    @{
      matiere = "Mathematiques"
      debut = "2025-12-29T09:00:00"
      fin = "2025-12-29T10:30:00"
      notes = "Algebre lineaire"
    },
    @{
      matiere = "Francais"
      debut = "2025-12-29T11:00:00"
      fin = "2025-12-29T12:30:00"
    }
  )
} | ConvertTo-Json -Depth 10

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/planning" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'; 'Authorization' = "Bearer $TOKEN"} `
    -Body $planning_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $json = $response.Content | ConvertFrom-Json
  $script:PLANNING_ID = $json._id
  $script:test_count++
  
  if (-not [string]::IsNullOrEmpty($PLANNING_ID) -and $PLANNING_ID -ne "null") {
    Write-Host "[TEST $test_count] POST /api/planning" -ForegroundColor Cyan
    Write-Host "[OK] Planning cree" -ForegroundColor Green
    Write-Host "  Planning ID: $PLANNING_ID"
    $script:pass_count++
  } else {
    Write-Host "[TEST $test_count] POST /api/planning" -ForegroundColor Cyan
    Write-Host "[FAIL] Creation planning echouee" -ForegroundColor Red
  }
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/planning" -ForegroundColor Cyan
  Write-Host "[FAIL] Creation planning echouee" -ForegroundColor Red
}
Write-Host ""

Test-Endpoint "GET" "/api/planning" "" 200 $TOKEN

if (-not [string]::IsNullOrEmpty($PLANNING_ID) -and $PLANNING_ID -ne "null") {
  $update_planning = @{
    periode = "semaine"
    sessions = @(
      @{
        matiere = "Mathematiques"
        debut = "2025-12-29T10:00:00"
        fin = "2025-12-29T11:30:00"
        notes = "Algebre lineaire - UPDATE"
      }
    )
  } | ConvertTo-Json -Depth 10
  
  Test-Endpoint "PUT" "/api/planning/$PLANNING_ID" $update_planning 200 $TOKEN
}

# =====================================================
# TEST 7: CHAT IA
# =====================================================

Write-Host "=== CHAT IA ===" -ForegroundColor Yellow

$chat_data = @{
  message = "Bonjour! Je voudrais creer un planning pour mes revisions de maths. J'ai 3 heures libres demain matin. Peux-tu m'aider?"
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/chat" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'; 'Authorization' = "Bearer $TOKEN"} `
    -Body $chat_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $json = $response.Content | ConvertFrom-Json
  $script:test_count++
  
  if ($json.response) {
    Write-Host "[TEST $test_count] POST /api/chat" -ForegroundColor Cyan
    Write-Host "[OK] Chat reponse recue" -ForegroundColor Green
    $script:pass_count++
  } else {
    Write-Host "[TEST $test_count] POST /api/chat" -ForegroundColor Cyan
    Write-Host "[FAIL] Chat echoue" -ForegroundColor Red
  }
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/chat" -ForegroundColor Cyan
  Write-Host "[FAIL] Chat echoue" -ForegroundColor Red
}
Write-Host ""

Test-Endpoint "GET" "/api/chat/metrics" "" 200 $TOKEN

# =====================================================
# TEST 8: PROGRES
# =====================================================

Write-Host "=== PROGRES ===" -ForegroundColor Yellow

$progress_data = @{
  date = "2025-12-29"
  sessionsCompletees = 2
  tempsEtudie = 120
  notes = "Session productive"
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/progress" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'; 'Authorization' = "Bearer $TOKEN"} `
    -Body $progress_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/progress" -ForegroundColor Cyan
  Write-Host "[OK] Progres enregistre" -ForegroundColor Green
  $script:pass_count++
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/progress" -ForegroundColor Cyan
  Write-Host "[FAIL] Progres echoue" -ForegroundColor Red
}
Write-Host ""

Test-Endpoint "GET" "/api/progress" "" 200 $TOKEN
Test-Endpoint "GET" "/api/progress/summary" "" 200 $TOKEN

# =====================================================
# TEST 9: RAPPELS
# =====================================================

Write-Host "=== RAPPELS ===" -ForegroundColor Yellow

$reminder_data = @{
  title = "Reviser Maths Chapitre 1-3"
  date = "2025-12-30T08:00:00"
  planningId = $PLANNING_ID
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "$API_URL/api/reminders" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'; 'Authorization' = "Bearer $TOKEN"} `
    -Body $reminder_data `
    -UseBasicParsing `
    -ErrorAction SilentlyContinue
  
  $json = $response.Content | ConvertFrom-Json
  $script:REMINDER_ID = $json._id
  $script:test_count++
  
  if (-not [string]::IsNullOrEmpty($REMINDER_ID) -and $REMINDER_ID -ne "null") {
    Write-Host "[TEST $test_count] POST /api/reminders" -ForegroundColor Cyan
    Write-Host "[OK] Rappel cree" -ForegroundColor Green
    $script:pass_count++
  } else {
    Write-Host "[TEST $test_count] POST /api/reminders" -ForegroundColor Cyan
    Write-Host "[FAIL] Creation rappel echouee" -ForegroundColor Red
  }
} catch {
  $script:test_count++
  Write-Host "[TEST $test_count] POST /api/reminders" -ForegroundColor Cyan
  Write-Host "[FAIL] Creation rappel echouee" -ForegroundColor Red
}
Write-Host ""

Test-Endpoint "GET" "/api/reminders" "" 200 $TOKEN

# =====================================================
# TEST 10: BADGES
# =====================================================

Write-Host "=== BADGES ===" -ForegroundColor Yellow

$badge_data = @{
  key = "first_planning"
  name = "Planificateur"
  description = "Cree le premier planning"
} | ConvertTo-Json

Test-Endpoint "POST" "/api/badges" $badge_data 201 $TOKEN
Test-Endpoint "GET" "/api/badges" "" 200 $TOKEN

# =====================================================
# TEST 11: EXPORTS
# =====================================================

Write-Host "=== EXPORTS ===" -ForegroundColor Yellow

if (-not [string]::IsNullOrEmpty($PLANNING_ID) -and $PLANNING_ID -ne "null") {
  Write-Host "Telechargement iCal..."
  try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/planning/$PLANNING_ID/export.ical" `
      -Method GET `
      -Headers @{'Authorization' = "Bearer $TOKEN"} `
      -UseBasicParsing `
      -ErrorAction SilentlyContinue
    
    $script:test_count++
    $fileSize = $response.Content.Length
    
    if ($fileSize -gt 0) {
      Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.ical" -ForegroundColor Cyan
      Write-Host "[OK] Export iCal reussi ($fileSize bytes)" -ForegroundColor Green
      $script:pass_count++
    } else {
      Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.ical" -ForegroundColor Cyan
      Write-Host "[FAIL] Export iCal echoue" -ForegroundColor Red
    }
  } catch {
    $script:test_count++
    Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.ical" -ForegroundColor Cyan
    Write-Host "[FAIL] Export iCal echoue" -ForegroundColor Red
  }
  
  Write-Host ""
  Write-Host "Telechargement PDF..."
  try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/planning/$PLANNING_ID/export.pdf" `
      -Method GET `
      -Headers @{'Authorization' = "Bearer $TOKEN"} `
      -UseBasicParsing `
      -ErrorAction SilentlyContinue
    
    $script:test_count++
    $fileSize = $response.Content.Length
    
    if ($fileSize -gt 0) {
      Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.pdf" -ForegroundColor Cyan
      Write-Host "[OK] Export PDF reussi ($fileSize bytes)" -ForegroundColor Green
      $script:pass_count++
    } else {
      Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.pdf" -ForegroundColor Cyan
      Write-Host "[FAIL] Export PDF echoue" -ForegroundColor Red
    }
  } catch {
    $script:test_count++
    Write-Host "[TEST $test_count] GET /api/planning/$PLANNING_ID/export.pdf" -ForegroundColor Cyan
    Write-Host "[FAIL] Export PDF echoue" -ForegroundColor Red
  }
}
Write-Host ""

# =====================================================
# RESUME
# =====================================================

Write-Host "=== RESUME ===" -ForegroundColor Yellow
Write-Host "Tests passes: $pass_count / $test_count"

if ($pass_count -eq $test_count) {
  Write-Host "SUCCES: Tous les tests reussis!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "ECHEC: Certains tests ont echoue" -ForegroundColor Red
  exit 1
}
