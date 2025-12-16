# The Commons - Cross-Domain Enterprise Marketplace

## Team Members

1. **Shamathmika** – Nestly (Student Housing Marketplace)
2. **Wendy Nguyen** – Whisk (Online Bakery)
3. **Anandita Prakash** – PetSitHub (Pet Sitting Services)

## Architecture

- **Frontend**: React (Marketplace), Sub-sites (TBD)
- **Backend**: PHP (REST API)
- **Database**: MySQL

### Folder Structure

- `/backend`: PHP API endpoints
  - `/common`: Shared logic (DB, Auth)
  - `/marketplace`: Global features (Tracking, Reviews, Top 5)
  - `/nestly`, `/whisk`, `/petsit`: Domain-specific endpoints
- `/frontend`: Client-side code
  - `/marketplace`: Main portal

## Deployment

Deployed to **InfinityFree** via GitHub Actions.
Website: https://thecommons.great-site.net

## How to Add API Endpoints

1. Create a new PHP file in the respective folder inside `backend/`.
2. Ensure you set the `Content-Type: application/json` header.
3. Use `common/db.php` for database connections.

```php
require_once '../common/db.php';
// Your logic here
```
