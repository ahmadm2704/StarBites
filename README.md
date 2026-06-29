# Star Bites Cafe - Full Stack Ordering System

A complete, production-ready fast food ordering platform with customer-facing website and comprehensive admin management portal.

## Features

### Customer Website
- 🏠 Beautiful landing page with hero section
- 🍽️ Dynamic menu with category filtering and search
- 🛒 Shopping cart with item management
- 📝 Guest checkout (no account required)
- 📊 Order tracking by email/phone
- 📱 Fully responsive mobile design
- 🎨 Vibrant, appetizing theme inspired by your menu

### Admin Portal
- 🔐 Secure admin authentication
- 📊 Dashboard with key metrics and analytics
- 🍕 Complete product management (add/edit/delete)
- 📦 Order management with real-time status updates
- 📈 Inventory tracking with low-stock alerts
- 👥 Customer management with order history
- 📉 Advanced analytics with charts and reports
- 💾 CSV export for reports

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Demo-based (upgrade to Supabase Auth for production)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Follow the instructions in `DATABASE_SETUP.md` to:
- Create all required tables
- Set up indexes for performance
- Configure Row Level Security (optional)
- Insert sample data

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the customer website.

## URL Structure

### Customer Website
- `/` - Home page
- `/menu` - Browse full menu
- `/cart` - Shopping cart and checkout
- `/about` - About page (coming soon)
- `/contact` - Contact page (coming soon)

### Admin Portal
- `/admin/login` - Admin login
  - Demo Email: `admin@starbites.pk`
  - Demo Password: `admin123`
- `/admin/dashboard` - Dashboard & statistics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/inventory` - Inventory tracking
- `/admin/customers` - Customer management
- `/admin/analytics` - Analytics & reports

## Design Theme

The site uses a vibrant, appetizing color scheme:
- **Primary**: Red (#DC2626) - Bold and attention-grabbing
- **Secondary**: Orange (#F97316) - Warm and inviting
- **Accent**: Golden Yellow (#FFB800) - Highlight and energy
- **Neutral**: Clean whites and grays for contrast

## Database Schema

### Core Tables

**categories** - Product categories
- id (UUID)
- name (string)
- description (text)
- image_url (text)
- order (integer)
- created_at (timestamp)

**products** - Menu items
- id (UUID)
- category_id (foreign key)
- name (string)
- description (text)
- image_url (text)
- price (decimal)
- is_available (boolean)
- created_at (timestamp)

**product_variants** - Sizes and options
- id (UUID)
- product_id (foreign key)
- size (string)
- price_modifier (decimal)
- created_at (timestamp)

**inventory** - Stock levels
- id (UUID)
- product_id (foreign key)
- quantity (integer)
- reorder_level (integer)
- last_restocked (timestamp)
- created_at (timestamp)

**orders** - Customer orders
- id (UUID)
- user_email (string)
- status (string) - pending, confirmed, preparing, ready, completed, cancelled
- total_amount (decimal)
- delivery_address (text)
- phone (string)
- created_at (timestamp)
- updated_at (timestamp)

**order_items** - Items in each order
- id (UUID)
- order_id (foreign key)
- product_id (foreign key)
- variant_id (foreign key, optional)
- quantity (integer)
- unit_price (decimal)
- special_instructions (text)
- created_at (timestamp)

**admin_users** - Admin accounts
- id (UUID)
- email (string, unique)
- password_hash (string)
- role (string) - admin, manager, staff
- created_at (timestamp)

## Admin Features

### Dashboard
- Total orders count
- Revenue metrics
- Pending orders alert
- Customer statistics
- Today's performance
- Quick action buttons

### Products Management
- Add new products with bulk operations
- Edit existing products
- Delete products
- Set availability status
- Organize by categories
- Track pricing

### Order Management
- View all orders with filtering
- Real-time status updates
- Customer details and delivery address
- Order items breakdown
- Filter by status (pending, confirmed, preparing, ready, completed, cancelled)

### Inventory Tracking
- Monitor stock levels
- Set reorder levels
- Low stock alerts
- Track restock dates
- Quick update interface

### Customer Management
- View all customers
- Order history per customer
- Total spending per customer
- Repeat customer tracking
- Customer contact information

### Analytics & Reports
- Revenue trends (last 30 days)
- Top products by sales
- Order status breakdown (pie chart)
- Key metrics (total revenue, avg order value)
- CSV export for analysis

## Customization

### Change Theme Colors

Edit `/app/globals.css` and modify the color variables in the `:root` section:

```css
:root {
  --primary: oklch(0.62 0.195 30);
  --secondary: oklch(0.55 0.16 29);
  --accent: oklch(0.72 0.18 42);
}
```

### Add New Categories

1. Go to Admin Dashboard → Products
2. Add products and assign to categories
3. Categories auto-populate from the database

### Update Contact Information

Edit the footer in `/app/page.tsx` to update:
- Phone number
- Email address
- Social media links

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- AWS
- Google Cloud
- DigitalOcean
- Heroku
- Self-hosted

## Security Considerations

For production deployment:

1. **Admin Authentication**
   - Replace demo auth with Supabase Auth
   - Use JWT tokens for session management
   - Implement role-based access control

2. **Database Security**
   - Enable Row Level Security (RLS) in Supabase
   - Restrict admin operations to authenticated users
   - Use parameterized queries (already implemented with Supabase client)

3. **Payment Integration**
   - Add Stripe or your preferred payment gateway
   - Implement order payment verification
   - Add order confirmation emails

4. **Data Protection**
   - Use HTTPS in production
   - Implement CORS properly
   - Add rate limiting to API routes
   - Sanitize user inputs

## Future Enhancements

- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Loyalty program
- [ ] Ratings and reviews
- [ ] Social media integration
- [ ] Advanced marketing tools
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Delivery tracking with maps
- [ ] Bulk ordering for corporate clients

## Troubleshooting

### Database Connection Issues

1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is active
3. Ensure network allows outbound connections

### Admin Login Not Working

1. Check browser console for errors
2. Verify database credentials
3. Clear browser cache and try again
4. Check if admin user exists in `admin_users` table

### Products Not Loading

1. Verify categories exist in database
2. Check products table has data
3. Look at browser console for API errors
4. Check Supabase RLS policies if enabled

### Cart Issues

1. Check browser local storage is enabled
2. Verify cart data in browser DevTools
3. Clear local storage and try again

## Support & Contribution

For issues, questions, or improvements:
1. Check the DATABASE_SETUP.md for schema details
2. Review the code comments for implementation details
3. Test features thoroughly before deployment

## License

This project is created for Star Bites Cafe. All rights reserved.

---

**Last Updated**: 2024
**Version**: 1.0
**Author**: v0 AI Assistant
