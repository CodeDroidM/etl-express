# ETL-Express: Full Stack WordPress + React Starter

## Overview

**ETL-Express** is a Dockerized development environment combining:

* A full WordPress stack with MariaDB, Redis, Mailhog, and Nginx
* A React-based UI (ETL dashboard) in the `etl-express-ui/` folder
* Wordfence 2FA and WooCommerce compatibility
* Theme: `saaslauncher`, fully mounted and editable locally

This project is ideal for building data-driven WordPress dashboards with custom UI overlays.

---

## 🔧 Prerequisites

Ensure you have the following installed:

* **Docker** + **Docker Compose**
* **Yarn** (`v1.22+`) **or npm**
* **Node.js** `v21.7.1`
* **git  lfs** `

---

## 🚀 Quick Start

```bash
git clone https://github.com/CodeDroidM/etl-express
git lfs pull        # fetch the backup files

```

### 1. Start the Docker Stack

```bash
docker compose up 
```

This will launch:

* WordPress at: `http://localhost:8080`
* Mailhog at: `http://localhost:8025`

### 2. Install WordPress Backup (First Time Only)

* Login to WP admin: `http://localhost:8080/wp-admin`
* Install the **All-in-One WP Migration** plugin
* Import your `.wpress` file to restore the site

### 3. Start the React App

In a separate terminal:

```bash
cd etl-express-ui
yarn install
yarn start
```

React app runs at: `http://localhost:3000`

---

## 🗂️ Project Structure

| Path                              | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `etl-express-ui/`                 | React frontend ETL dashboard                   |
| `docker-compose.yml`              | WordPress + DB + Nginx stack                   |
| `nginx.conf`                      | Routes Nginx traffic to PHP-FPM                |
| `wp-content/themes/saaslauncher/` | Custom theme, editable locally                 |
 

---

## 🔐 Admin & Security Notes

* **2FA** is provided by Wordfence. Use a dark-mode CSS override in `style.css` to fix visibility on custom themes.
* Disable access to `/wp-admin/` when embedding React into WordPress, if necessary.

---

## 📦 WordPress Theme Notes

The `saaslauncher` theme is mounted via Docker volume:

```yaml
- ./wp-content/themes/saaslauncher:/var/www/html/wp-content/themes/saaslauncher
```

This allows instant edits to `functions.php`, block templates, and style sheets.

Use this to:

* Customize the WooCommerce My Account page

* Inject menu logic 

---

## 🧪 Testing

* WP site: [http://localhost:8080](http://localhost:8080)
* React UI: [http://localhost:3000](http://localhost:3000)
* Mailhog (email catch): [http://localhost:8025](http://localhost:8025)

---


## ✅ Troubleshooting

### WordPress showing blank theme or 2FA errors?

Ensure the theme files are complete, especially `functions.php` and `inc/` folder. Fix permissions:

```bash
sudo chown -R $USER:www-data wp-content/themes/saaslauncher
sudo chmod -R 775 wp-content/themes/saaslauncher
```


### Test user account

user: test_user
p: lYx9ar&6)4IOUQKyj0#&&8sX



user: teacher
p: can be recovered throiugh Mailhog