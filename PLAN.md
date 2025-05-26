# Creator Boosting Platform - Development Plan

## 📋 Project Overview
Platform pemasaran yang menghubungkan **Kreator** dengan **Promotor** untuk kampanye pemasaran digital dengan sistem pelacakan link dan pembayaran otomatis.

## 🎯 Target Users
- **Kreator**: Membuat kampanye, mengelola budget, memantau performa
- **Promotor**: Mencari kampanye, mempromosikan produk, mendapat komisi

## 🏗️ Technical Architecture
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## 📊 Database Schema

### Users Table (Supabase Auth + profiles)
```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('creator', 'promotor')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Campaigns Table
```sql
campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10,2),
  commission_rate DECIMAL(5,2), -- percentage
  target_clicks INTEGER,
  target_conversions INTEGER,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  materials JSONB, -- campaign assets/files
  requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Campaign Participations
```sql
campaign_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  promotor_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  tracking_link TEXT UNIQUE,
  applied_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
)
```

### Link Tracking
```sql
link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participation_id UUID REFERENCES campaign_participations(id),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true -- for fraud detection
)
```

### Performance Reports
```sql
performance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participation_id UUID REFERENCES campaign_participations(id),
  report_type TEXT CHECK (report_type IN ('screenshot', 'analytics', 'conversion')),
  file_url TEXT,
  description TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false
)
```

### Payouts
```sql
payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotor_id UUID REFERENCES profiles(id),
  campaign_id UUID REFERENCES campaigns(id),
  amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method JSONB,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
)
```

## 🚀 Development Phases

### Phase 1: MVP Core Features ✅ (Current)
- [x] Project setup & dependencies
- [x] Authentication system (Supabase Auth)
- [x] Basic routing structure
- [x] UI components setup (Shadcn/ui)
- [ ] **Landing page implementation** 🔄
- [ ] User registration/login flows
- [ ] Basic dashboard layouts

### Phase 2: Campaign Management
- [ ] Campaign creation form (Creators)
- [ ] Campaign listing/discovery (Promotors)
- [ ] Campaign application system
- [ ] File upload for campaign materials
- [ ] Campaign status management

### Phase 3: Link Tracking & Analytics
- [ ] Unique tracking link generation
- [ ] Click tracking system
- [ ] Basic fraud detection (IP/User-Agent filtering)
- [ ] Analytics dashboard
- [ ] Performance reporting

### Phase 4: Payment System
- [ ] Payment gateway integration
- [ ] Payout request system
- [ ] Commission calculation
- [ ] Payment history tracking

### Phase 5: Advanced Features
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] API for external integrations

## 📱 Page Structure

### Public Pages
- `/` - Landing page with platform overview
- `/auth/login` - Login page
- `/auth/signup` - Registration page (with role selection)
- `/campaigns` - Public campaign discovery

### Creator Dashboard
- `/creator/dashboard` - Overview & analytics
- `/creator/campaigns` - Campaign management
- `/creator/campaigns/new` - Create new campaign
- `/creator/campaigns/[id]` - Campaign details & analytics
- `/creator/payouts` - Payment management

### Promotor Dashboard
- `/promotor/dashboard` - Overview & earnings
- `/promotor/campaigns` - Available campaigns
- `/promotor/my-campaigns` - Joined campaigns
- `/promotor/performance` - Performance reports
- `/promotor/payouts` - Payout requests

### Shared Pages
- `/profile` - User profile management
- `/settings` - Account settings
- `/help` - Help & documentation

## 🎨 UI/UX Components Needed

### Landing Page Components
- [ ] Hero section with value proposition
- [ ] Feature highlights
- [ ] How it works section
- [ ] Testimonials/social proof
- [ ] CTA sections for both user types

### Dashboard Components
- [ ] Stats cards
- [ ] Charts & graphs (analytics)
- [ ] Data tables (campaigns, clicks, payouts)
- [ ] Forms (campaign creation, profile)
- [ ] File upload components
- [ ] Notification system

### Campaign Components
- [ ] Campaign cards
- [ ] Campaign filters
- [ ] Application forms
- [ ] Performance metrics
- [ ] Link generator

## 🔒 Security & Fraud Prevention

### Non-ML Fraud Detection
- IP address analysis (rate limiting, geolocation)
- User-Agent pattern detection
- Click frequency monitoring
- Referrer validation
- Time-based analysis

### Security Measures
- Row Level Security (RLS) in Supabase
- API rate limiting
- Input validation & sanitization
- File upload restrictions
- Secure payment processing

## 📈 Analytics & Tracking

### Metrics to Track
- Campaign performance (clicks, conversions, ROI)
- User engagement
- Platform usage statistics
- Revenue metrics
- Fraud detection rates

### Reporting Features
- Real-time dashboards
- Exportable reports
- Custom date ranges
- Comparative analysis

## 🚀 Deployment Strategy

### Environment Setup
- Development: Local + Supabase dev
- Staging: Vercel preview + Supabase staging
- Production: Vercel + Supabase production

### CI/CD Pipeline
- GitHub Actions for testing
- Automatic deployment on merge to main
- Database migrations via Supabase CLI

## 📋 Current Status & Next Steps

### ✅ Completed
- Project setup and dependencies
- Authentication structure
- Basic routing
- UI component library
- Build and deployment pipeline

### 🔄 In Progress
- Landing page implementation
- User flow optimization

### ⏳ Next Priorities
1. **Fix landing page** - Replace default Next.js content
2. **Implement proper navigation** - Header with auth state
3. **Complete user registration flow** - Role selection
4. **Create dashboard layouts** - Separate for creators/promotors
5. **Database schema implementation** - Supabase tables

### 🐛 Known Issues
- Landing page shows default Next.js content
- Missing navigation component
- Environment variables need proper Supabase setup
- User role differentiation not implemented

## 📞 Contact & Resources
- Repository: https://github.com/rendoarsandi/creatorboosting-a
- Deployment: Vercel
- Database: Supabase
- Documentation: This plan + PRD