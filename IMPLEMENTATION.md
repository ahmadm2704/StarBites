# Star Bites Implementation Guide

## Step-by-Step Setup Instructions

### Phase 1: Database Setup (5 mins)

1. **Create Supabase Project**
   - Go to supabase.com and create a new project
   - Choose your region
   - Set a strong database password
   - Copy your project URL and anon key

2. **Run Database Queries**
   - Open Supabase SQL Editor
   - Copy and paste all queries from DATABASE_SETUP.md
   - Run each table creation query
   - Run all index creation queries

3. **Enable RLS (Optional but Recommended)**
   - Navigate to Authentication → Policies
   - Enable RLS on tables that need it
   - Follow the RLS policies in DATABASE_SETUP.md

### Phase 2: Environment Configuration (2 mins)

1. **Create .env.local**
   ```bash
   touch .env.local
   ```

2. **Add Supabase Credentials**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Verify Connection**
   - Start dev server: `pnpm dev`
   - Visit `/menu` - should load without errors
   - Check browser console for any errors

### Phase 3: Add Sample Data (10 mins)

1. **Insert Categories**
   ```sql
   INSERT INTO categories (name, description, "order") VALUES
   ('Pizzas', 'Hand-tossed pizzas with premium ingredients', 1),
   ('Burgers', 'Juicy burgers with signature sauces', 2),
   ('Fried Chicken', 'Crispy fried chicken pieces', 3),
   ('Sides', 'Fries, coleslaw, and sides', 4),
   ('Beverages', 'Soft drinks and hot beverages', 5);
   ```

2. **Insert Sample Products**
   ```sql
   INSERT INTO products (category_id, name, description, price, is_available) VALUES
   ((SELECT id FROM categories WHERE name='Pizzas'), 'Margherita', 'Classic pizza with fresh mozzarella', 450, true),
   ((SELECT id FROM categories WHERE name='Pizzas'), 'Pepperoni', 'Loaded with pepperoni', 550, true),
   ((SELECT id FROM categories WHERE name='Burgers'), 'Classic Burger', 'Beef patty with cheese and lettuce', 300, true),
   ((SELECT id FROM categories WHERE name='Fried Chicken'), 'Chicken Pieces', '6 pieces of crispy chicken', 400, true),
   ((SELECT id FROM categories WHERE name='Sides'), 'French Fries', 'Crispy golden fries', 150, true),
   ((SELECT id FROM categories WHERE name='Beverages'), 'Coca Cola', 'Ice-cold Coca Cola', 100, true);
   ```

3. **Initialize Inventory**
   ```sql
   INSERT INTO inventory (product_id, quantity, reorder_level)
   SELECT id, 50, 10 FROM products;
   ```

### Phase 4: Test Customer Website (10 mins)

1. **Visit Homepage**
   - Open http://localhost:3000
   - Check navigation works
   - Verify hero section displays

2. **Test Menu Page**
   - Click "Order Now" or "View Full Menu"
   - Verify products load from database
   - Test category filtering
   - Test search functionality

3. **Test Cart & Checkout**
   - Add items to cart
   - Verify cart count updates
   - Go to cart page
   - Fill in checkout details
   - Verify order is created in database

### Phase 5: Admin Portal Setup (5 mins)

1. **Access Admin Login**
   - Navigate to http://localhost:3000/admin/login
   - Use demo credentials:
     - Email: `admin@starbites.pk`
     - Password: `admin123`

2. **Explore Dashboard**
   - View statistics
   - Check order count
   - Review revenue metrics

3. **Test Admin Features**
   - Go to Products → Add a test product
   - Go to Orders → View and update order status
   - Go to Inventory → Update stock levels
   - Go to Customers → View customer details
   - Go to Analytics → View charts and export report

### Phase 6: Customization (20 mins)

#### Update Brand Information

1. **Edit Page Metadata** (`app/layout.tsx`)
   - Update page title
   - Update description
   - Add your favicon

2. **Update Footer** (`app/page.tsx`)
   - Change phone number
   - Change email address
   - Add social media links

3. **Update Admin Footer** (`app/admin/dashboard/page.tsx`)
   - Update contact information
   - Add business hours

#### Customize Colors

1. **Edit Theme** (`app/globals.css`)
   - Modify primary color: `--primary`
   - Modify secondary color: `--secondary`
   - Modify accent color: `--accent`

2. **Update Hero Section** (`app/page.tsx`)
   - Change hero text
   - Update business description
   - Modify call-to-action buttons

#### Add Product Images

Currently using emoji placeholders. To add real images:

1. **Using Supabase Storage**
   - Create a bucket called "product-images"
   - Upload images
   - Update product `image_url` with public URLs

2. **Using External CDN**
   - Upload images to your CDN
   - Add URLs to products table
   - Images will display in menu

### Phase 7: Testing Workflow

1. **Customer Flow**
   - [ ] Browse menu
   - [ ] Add items to cart
   - [ ] Remove items from cart
   - [ ] Update quantities
   - [ ] Checkout with guest details
   - [ ] Verify order in admin panel

2. **Admin Flow**
   - [ ] Login to admin portal
   - [ ] Add new product
   - [ ] Edit product details
   - [ ] Update product availability
   - [ ] Delete test product
   - [ ] View orders and update status
   - [ ] Update inventory
   - [ ] View customer list

3. **Edge Cases**
   - [ ] Empty cart checkout (should fail)
   - [ ] Missing required fields (should fail)
   - [ ] Add item, then delete product (cart should be intact)
   - [ ] Very long product names (should wrap properly)

### Phase 8: Deploy to Production

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial Star Bites platform"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit vercel.com
   - Import GitHub repository
   - Add environment variables
   - Deploy!

3. **Post-Deployment**
   - Test all features in production
   - Set up monitoring
   - Configure error tracking
   - Monitor customer feedback

## Configuration Reference

### Admin Credentials
- Default Email: `admin@starbites.pk`
- Default Password: `admin123`
- Update in: `/app/api/admin/login/route.ts`

### Order Statuses
- `pending` - New order
- `confirmed` - Admin confirmed
- `preparing` - Being prepared
- `ready` - Ready for pickup/delivery
- `completed` - Delivered/Picked up
- `cancelled` - Cancelled order

### Product Categories
Create these default categories:
- Pizzas
- Burgers
- Fried Chicken
- Sides
- Beverages

### Pricing Guidelines
Suggested structure:
- Appetizers: 100-200 PKR
- Main Items: 300-600 PKR
- Family Combos: 1500-3000 PKR
- Beverages: 50-150 PKR

## Performance Optimization

### Already Implemented
- Database indexes on foreign keys
- Supabase client-side caching
- Optimized queries
- Image lazy loading with emojis

### Recommended Additions
1. Add CDN for images using Vercel Blob
2. Implement ISR (Incremental Static Regeneration)
3. Add Redis caching for frequently accessed data
4. Optimize bundle size with code splitting

## Common Tasks

### Add New Menu Category
1. Login to admin
2. Go to Products
3. Create product with new category name
4. Category auto-appears in filters

### Update Product Prices
1. Admin → Products
2. Click Edit on product
3. Change price
4. Click Update

### Manage Orders
1. Admin → Orders
2. Click View
3. Change status to: confirmed, preparing, ready, completed
4. Status updates automatically

### View Sales Analytics
1. Admin → Analytics
2. See revenue trends
3. View top products
4. Export CSV report

## Troubleshooting

### Issue: Products Not Showing
**Solution**: 
- Check database has products
- Verify Supabase URL and key are correct
- Check browser console for API errors

### Issue: Admin Login Fails
**Solution**:
- Clear browser cache
- Check admin_users table has entry
- Verify password is correct

### Issue: Orders Not Saving
**Solution**:
- Check all required fields filled
- Verify database connection
- Check order_items table has records

### Issue: Images Not Loading
**Solution**:
- Currently using emoji placeholders (no images)
- To add images, update product image_url
- Host images on Supabase Storage or external CDN

## Support

For detailed technical questions:
- Check README.md for feature overview
- Review DATABASE_SETUP.md for schema details
- Check code comments for implementation details
- Test thoroughly before making changes

## Next Steps After Deployment

1. **Payment Integration**
   - Add Stripe for card payments
   - Set up payment verification

2. **Notifications**
   - Add order confirmation emails
   - Set up SMS notifications

3. **Analytics**
   - Integrate with Google Analytics
   - Set up performance monitoring

4. **Marketing**
   - Set up email campaigns
   - Create social media integration

5. **Customer Features**
   - User accounts and loyalty
   - Saved addresses
   - Order history
   - Reviews and ratings

---

**Happy Building! 🚀**
