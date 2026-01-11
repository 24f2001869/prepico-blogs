# Prepico Blog CMS

A production-ready blog content management system built for the Prepico Frontend Developer Intern assessment. Implements all requirements with professional-grade features.

## 🚀 Live Application
**[View Live Demo](https://prepico-blogs-nine.vercel.app/)**

## 📋 Features Implemented

### ✅ **Mandatory Requirements**
- [x] **Admin Page with Authentication** - Secure login (admin@prepico.ai / Prepico@2024)
- [x] **Block-based Editor** - 11 content types including complex layouts
- [x] **Media Support** - Images, Videos, Audio, Files (via URLs)
- [x] **Text Elements** - Paragraphs, Headings, Bulleted/Numbered lists
- [x] **Complex Structures** - Row layouts (horizontal), Nested layouts
- [x] **Blog Metadata** - Title and thumbnail for each blog
- [x] **List Page** - Responsive grid of all blogs
- [x] **View Page** - Detailed blog view with all content types
- [x] **Supabase Backend** - PostgreSQL with JSONB storage
- [x] **No localStorage** - All data from Supabase
- [x] **Clean Code Structure** - Modular, maintainable architecture

### 🎨 **Additional Features**
- **Prepico Branding** - Matches prepico.ai design system
- **Mobile Responsive** - Works on all devices
- **Real-time Preview** - See changes while editing
- **Statistics Dashboard** - Insights into content
- **Toast Notifications** - User feedback system
- **Error Handling** - Comprehensive error states
- **Loading States** - Smooth user experience

## 🛠️ Tech Stack
- **Frontend**: Vue 3, Composition API
- **Routing**: Vue Router with Auth Guards
- **State Management**: Pinia
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Editor**: Custom block-based system

## ⚙️ Local Development

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier)

### Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/prepico-blogs.git
cd prepico-blogs

# 2. Install dependencies
npm install

# 3. Environment variables
cp .env.example .env
# Add your Supabase credentials

# 4. Run development server
npm run dev
