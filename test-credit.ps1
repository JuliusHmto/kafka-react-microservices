$body = '{"amount":100.0,"currency":"USD","description":"Test deposit"}'
$uri = "http://localhost:8080/api/accounts/d3hhef99-9c0b-4ef8-bb6d-6bb9bd380a44/credit"
$response = Invoke-WebRequest -Uri $uri -Method POST -Body $body -ContentType "application/json"
Write-Output "Status: $($response.StatusCode)"
Write-Output "Response: $($response.Content)" 