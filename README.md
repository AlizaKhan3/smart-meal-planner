# 🥗 Smart Meal Planner & Grocery Automator

A full-stack meal-planning app: build a weekly plan, track calories & macros that are
calculated automatically from ingredient quantities, and auto-generate a categorised
grocery list from everything you planned.

**Stack:** Next.js 14 (App Router, TypeScript, Tailwind) · NestJS 10 · MongoDB (Mongoose) · JWT auth

---

## 📁 Structure

```
smart-meal-planner/
├── backend/     NestJS REST API  (port 4000, prefix /api)
├── frontend/    Next.js app       (port 3000)
└── README.md
```

---

## ✅ Prerequisites

- **Node.js 18+**
- **MongoDB** running locally (`mongodb://localhost:27017`) — or a MongoDB Atlas URI
  - Local (Docker): `docker run -d -p 27017:27017 --name mealdb mongo:7`

---

## 🚀 Setup

### 1. Backend

```bash
cd backend
cp .env.example .env          # then edit MONGODB_URI / JWT_SECRET if needed
npm install
npm run seed                  # loads ~44 ingredients + a demo user with 9 meals
npm run start:dev             # → http://localhost:4000/api
```

### 2. Frontend (new terminal)

```bash
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                        # → http://localhost:3000
```

Open **http://localhost:3000** and log in with the seeded account:

```
Email:    demo@nourishplan.app
Password: password123
```

---

## 🔑 Environment variables

**backend/.env**

| Key | Example | Purpose |
|-----|---------|---------|
| `MONGODB_URI` | `mongodb://localhost:27017/smart-meal-planner` | Database connection |
| `JWT_SECRET` | `a_long_random_string` | Signs auth tokens |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `PORT` | `4000` | API port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |

**frontend/.env.local**

| Key | Example |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` |

---

## 🧠 Core business logic

- **Nutrition** — for each ingredient: `quantity ÷ 100 × nutrient_per_100g`, summed over the meal.
- **Calorie target** — Mifflin-St Jeor BMR × activity factor, adjusted by goal
  (weight loss −400 / maintenance 0 / muscle gain +300), floored at 1200 kcal. Editable; a guideline, not medical advice.
- **Grocery aggregation** — reads every meal in the plan, combines duplicate ingredients
  (matched by name + unit, scaled by servings) and groups them by category.

---

## 🔌 API overview (all prefixed `/api`)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` · `/auth/login` | Auth, returns `{ accessToken, user }` |
| GET | `/auth/me` | Current user |
| GET / PATCH | `/users/me` | Read / update profile (recomputes target) |
| GET POST | `/meals` | List / create meals (nutrition auto-calculated) |
| GET PATCH DELETE | `/meals/:id` | Read / update / delete a meal |
| GET POST | `/meal-plans` | List / create weekly plans (daily totals) |
| GET PATCH DELETE | `/meal-plans/:id` | Manage a plan |
| POST | `/grocery/generate` | Build a grocery list from a plan |
| GET | `/grocery` | List grocery lists |
| POST PATCH DELETE | `/grocery/:id/items[/:itemId]` | Add / tick / remove items |
| GET | `/nutrition/summary?date=` | Consumed vs target for a day |
| POST | `/nutrition/log` | Log a meal as eaten |
| GET | `/nutrition/history?days=` | Daily totals for charts |
| GET | `/ingredients?search=` | Ingredient catalogue |
| GET PATCH | `/subscriptions/me` | Plan & feature flags |

Every route except register/login requires `Authorization: Bearer <token>`.

---

## 📱 Frontend pages

`/` landing · `/login` · `/register` · `/dashboard` (calorie ring + macros) ·
`/planner` (weekly plan + meal detail sheet) · `/grocery` (categorised checklist) ·
`/meals` + `/meals/create` (recipe library) · `/profile` (dietary profile & settings).

The UI is mobile-first and stays responsive up to desktop, where it renders as a
centred app column.

---

## 🛠 Tech notes

- JWT is stored in `localStorage` and attached via an Axios request interceptor;
  a 401 clears the session and redirects to `/login`.
- Rate limiting via `@nestjs/throttler` (100 req/min globally, 10/min on auth).
- Validation via `class-validator` + a global `ValidationPipe`.
- The `free`/`premium` plan is simulated on the user document (`subscriptionPlan`).
# smart-meal-planner
