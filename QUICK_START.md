# Star Bites - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Supabase Credentials (2 mins)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **Anon Key**

### Step 2: Configure Environment (1 min)
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Setup Database (2 mins)
1. Open Supabase SQL Editor
2. Run all SQL queries from `DATABASE_SETUP.md`
3. Insert sample data (optional)

### Step 4: Start Development
```bash
pnpm dev
```

Visit:
- **Customer Site**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/login
  - Email: `admin@starbites.pk`
  - Password: `admin123`

---

## 📍 Key URLs

### Customer Website
| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Menu | `/menu` | Browse products |
| Cart | `/cart` | Checkout |

### Admin Portal
| Page | URL | Purpose |
|------|-----|---------|
| Login | `/admin/login` | Admin access |
| Dashboard | `/admin/dashboard` | Stats & overview |
| Products | `/admin/products` | Manage menu items |
| Orders | `/admin/orders` | Manage orders |
| Inventory | `/admin/inventory` | Track stock |
| Customers | `/admin/customers` | View customers |
| Analytics | `/admin/analytics` | Reports & trends |

---

## 🛠️ Common Tasks

### Add a New Product
1. Go to `/admin/dashboard`
2. Click "Add New Product"
3. Fill in name, category, price, description
4. Click "Add Product"

### Update Order Status
1. Go to `/admin/dashboard` → Orders
2. Click "View" on an order
3. Select new status
4. Status updates immediately

### View Sales Report
1. Go to `/admin/dashboard` → Analytics
2. See revenue charts and top products
3. Click "Export" to download CSV

### Process Customer Order
1. Go to `/` (home page)
2. Click "Order Now"
3. Browse menu and add items
4. Fill delivery details
5. Click "Place Order"
6. Order appears in admin Orders page

---

## 🎨 Customize Your Site

### Change Theme Colors
Edit `/app/globals.css`:
```css
--primary: oklch(0.62 0.195 30);    /* Red */
--secondary: oklch(0.55 0.16 29);   /* Orange */
--accent: oklch(0.72 0.18 42);      /* Gold */
```

### Update Business Info
Edit `/app/page.tsx` footer:
- Phone number
- Email address
- Social media links

### Add Products
Insert directly into database or use admin panel:
```sql
INSERT INTO products (category_id, name, description, price)
VALUES ((SELECT id FROM categories WHERE name='Pizzas'), 
        'Your Pizza', 'Description', 550);
```

---

## 🔍 Troubleshooting

### Problem: Database not connecting
**Solution**: Check `.env.local` has correct credentials

### Problem: Admin login fails
**Solution**: Clear browser cache, ensure admin_users table has data

### Problem: Products not showing
**Solution**: Verify categories exist, check Supabase URL is correct

### Problem: Orders not saving
**Solution**: Check all required fields are filled, verify database connection

---

## 📊 Default Demo Data

### Admin Credentials
```
Email: admin@starbites.pk
Password: admin123
```

### Sample Menu Categories
- Pizzas
- Burgers
- Fried Chicken
- Sides
- Beverages

---

## 📱 Test Workflows

### Complete Customer Order
1. Open http://localhost:3000
2. Click "Order Now"
3. Add 2-3 items to cart
4. Go to cart
5. Enter name, email, phone, address
6. Click "Place Order"
7. Check admin dashboard for new order

### Update Order Status
1. Login to admin: http://localhost:3000/admin/login
2. Go to Orders
3. Click View on recent order
4. Change status: pending → confirmed → preparing → ready
5. See order progress in modal

### Manage Inventory
1. Go to Inventory
2. Find low-stock items (yellow highlight)
3. Click Update and increase quantity
4. Save changes

---

## 📈 Metrics to Track

In your admin dashboard you'll see:
- **Total Orders**: All orders ever placed
- **Total Revenue**: Sum of all order amounts
- **Pending Orders**: Orders not yet confirmed
- **Total Customers**: Unique email addresses
- **Today's Orders**: Orders placed today
- **Top Product**: Most popular item

---

## 🚀 Deploy to Production

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy via Vercel**
   - Sign up at vercel.com
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

3. **Post-Deployment**
   - Update business contact info
   - Add real product images
   - Set up customer notifications
   - Test entire workflow

---

## 💡 Pro Tips

✅ **Keep Orders Organized**
- Regularly update order statuses
- Process pending orders first
- Mark completed orders to archive later

✅ **Monitor Inventory**
- Check low-stock alerts daily
- Restock before running out
- Track popular items

✅ **Analyze Sales**
- Check analytics weekly
- Export CSV reports
- Track trends and adjust menu

✅ **Customer Experience**
- Respond to customers quickly
- Keep order preparation time short
- Update order status regularly so customers know progress

---

## 📞 Need Help?

- **README.md** - Detailed features and troubleshooting
- **DATABASE_SETUP.md** - Database schema and setup
- **IMPLEMENTATION.md** - Step-by-step installation guide
- **PROJECT_SUMMARY.md** - Complete project overview

---

**Happy Selling! 🍕🍔🍗**
