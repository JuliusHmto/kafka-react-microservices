# Quick fix script to add the demo user to the database
# Use this if you get the foreign key constraint error

Write-Host "Adding demo user to banking database..." -ForegroundColor Blue

try {
    $query = "INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number) VALUES ('b061f043-07b3-4006-be9f-b75e90631b96', 'john.doe', 'john.doe@bank.com', '`$2a`$10`$dummy.hash.for.testing', 'John', 'Doe', '+1234567890') ON CONFLICT (id) DO NOTHING;"
    
    docker-compose exec -T postgres psql -U banking_user -d banking_db -c $query
    
    Write-Host "Demo user added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now create accounts. The demo user ID is:" -ForegroundColor Cyan
    Write-Host "b061f043-07b3-4006-be9f-b75e90631b96" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try creating an account again!" -ForegroundColor Green
}
catch {
    Write-Host "Failed to add demo user. Make sure the database is running:" -ForegroundColor Red
    Write-Host "  docker-compose ps postgres" -ForegroundColor Gray
    Write-Host ""
    Write-Host "If postgres is not running, start it with:" -ForegroundColor Gray
    Write-Host "  docker-compose up -d postgres" -ForegroundColor Gray
} 