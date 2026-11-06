# Legal Cabinet Management Platform - Frontend

The official Angular frontend for the **Legal Cabinet Management Platform**, custom-built for lawyer Mahassen Saïdane's office. It provides a clean, professional dashboard for managing client appointments, tracking court hearings, organizing case files, and handling client onboarding verifications.

---

## 🚀 Key Features

* **Dashboard & Analytics:** Overview of upcoming court hearings, active cases, and consultation schedules.
* **Appointment Slot Scheduling:** Interactive calendar and booking interface for client consultations.
* **Court Hearing Tracker:** Real-time tracking of court dates, statuses, and case timelines.
* **Case & Client Management:** Detailed views for organizing legal files, client documentation, and verification statuses.
* **Role-Based Access Control:** Secure views tailored for lawyers, administrative staff, and clients.

---

## 🛠️ Tech Stack

* **Framework:** Angular (v20+)
* **Styling:** Tailwind CSS / Modern UI components
* **Routing & Guards:** Angular Router with reactive authentication guards
* **HTTP Client:** Angular HttpClient with RxJS for reactive data streams

---

## 📁 Project Structure

```text
cabinet-law-frontend/
├── public/               # Static assets & logos
├── src/
│   ├── app/
│   │   ├── core/         # Interceptors, guards, and global services
│   │   ├── features/     # Feature modules (cases, appointments, hearings, clients)
│   │   ├── shared/       # Reusable UI components, pipes, and directives
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/           # Images, fonts, and styles
│   └── main.ts           # Application entry point
├── .env.example          # Sample environment configuration
├── angular.json          # Angular CLI configuration
├── package.json          # Dependencies and scripts
└── README.md             # Frontend documentation

⚙️ Getting Started & How to Run
Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

1. Clone the Repository
Bash
git clone [https://github.com/your-username/cabinet-law-frontend.git](https://github.com/your-username/cabinet-law-frontend.git)
cd cabinet-law-frontend
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a environment configuration file (e.g., src/environments/environment.development.ts):

TypeScript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
4. Run the Development Server
Bash
ng serve
The application will be accessible at http://localhost:4200.

📦 Build for Production
To compile the optimized production bundle:

Bash
ng build --configuration production
