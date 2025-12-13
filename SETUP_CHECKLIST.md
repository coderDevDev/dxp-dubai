# ✅ Poster.tv CMS - Quick Setup Checklist

Follow these steps in order to get your CMS up and running.

## 📦 Step 1: Database Setup (5 minutes)

- [ ] Start XAMPP
- [ ] Start Apache and MySQL services
- [ ] Open phpMyAdmin: `http://localhost/phpmyadmin`
- [ ] Click on **SQL** tab
- [ ] Open file: `database/setup.sql`
- [ ] Copy all contents and paste into phpMyAdmin
- [ ] Click **Go** to execute
- [ ] Verify database `posterco_cms` was created
- [ ] Check that tables exist: `projects`, `categories`, `admin_users`

## 🔌 Step 2: Test API (2 minutes)

- [ ] Open in browser: `http://localhost/posterco/posterco.tv/api/projects.php`
- [ ] You should see JSON data with 7 projects
- [ ] If error appears, check:
  - [ ] MySQL is running in XAMPP
  - [ ] Database credentials in `api/config.php` are correct
  - [ ] File paths are correct

## 🎨 Step 3: Integrate with HTML (2 minutes)

- [ ] Open your `index.html` file
- [ ] Find the closing `</body>` tag (near end of file)
- [ ] Add this line **BEFORE** `</body>`:
  ```html
  <script src="assets/js/cms-integration.js"></script>
  ```
- [ ] Save the file

## 🔐 Step 4: Test Admin Login (2 minutes)

- [ ] Open: `http://localhost/posterco/posterco.tv/admin/login.html`
- [ ] Login with:
  - Username: `admin`
  - Password: `admin123`
- [ ] You should see the projects dashboard
- [ ] Verify all 7 projects are listed

## ✏️ Step 5: Test CRUD Operations (5 minutes)

- [ ] Click **"Add New Project"** button
- [ ] Fill in test project:
  - Title: Test Project
  - Director: Test Director
  - Category: Commercials
  - Vimeo IDs: 1234567890 (both fields)
  - Check "Featured"
- [ ] Click **Save**
- [ ] Verify project appears in list
- [ ] Click **Edit** on test project
- [ ] Change title to "Updated Test"
- [ ] Click **Save**
- [ ] Verify changes saved
- [ ] Click **Delete** on test project
- [ ] Confirm deletion
- [ ] Verify project removed

## 🌐 Step 6: Verify Frontend Integration (5 minutes)

- [ ] Open: `http://localhost/posterco/posterco.tv/index.html`
- [ ] Open browser console (F12)
- [ ] Look for message: "✅ CMS content loaded successfully"
- [ ] Check homepage carousel shows your projects
- [ ] Scroll down to projects grid
- [ ] Verify all projects display correctly
- [ ] Test category filters work

## 🎯 Optional: Clean Up

- [ ] Change admin password (security!)
- [ ] Add more projects through admin panel
- [ ] Update project order using "Order Index"
- [ ] Set featured projects for homepage
- [ ] Test video playback

---

## ⚠️ Troubleshooting

### If API shows error:
1. Check XAMPP Control Panel - MySQL must be green/running
2. Verify database exists in phpMyAdmin
3. Check `api/config.php` credentials match your MySQL setup

### If admin login fails:
1. Check browser console for errors
2. Clear browser cookies/cache
3. Verify `admin_users` table has data in phpMyAdmin

### If frontend doesn't update:
1. Clear browser cache (Ctrl+F5)
2. Check console for JavaScript errors
3. Verify `cms-integration.js` is loaded
4. Test API endpoint directly in browser

### If videos don't play:
1. Check Vimeo video IDs are correct
2. Test video URL directly in browser
3. Verify internet connection for Vimeo CDN

---

## 🎉 Success Indicators

You're ready to use the CMS when:

✅ Database created with 7 projects
✅ API returns JSON data
✅ Admin panel accessible
✅ Can add/edit/delete projects
✅ Frontend loads projects from CMS
✅ Videos play correctly

---

## 📚 Next Steps

1. Read full documentation: `admin/README.md`
2. Customize admin panel styles
3. Add more project fields if needed
4. Set up production environment
5. Configure backups

---

**Estimated Total Setup Time: 20-25 minutes**

**Questions?** Check `admin/README.md` for detailed documentation.
