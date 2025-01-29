# Class Catch

Class Catch is a powerful and user-friendly web application designed to help students efficiently search, filter, and plan their classes with ease. Whether you're organizing your current semester or strategizing your entire major, Class Catch provides a comprehensive suite of tools to streamline your academic planning process.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Advanced Search & Filtering:** Easily find classes using a wide variety of filters such as department, course level, instructor, schedule, and more.
- **Class Planning:** Organize your classes into completed and planned categories, allowing you to track your academic progress seamlessly.
- **Major Planning Tools:** Plan your entire major with specialized tools that help you meet all requirements and prerequisites.
- **Responsive Design:** Enjoy a smooth experience across all devices with our mobile-friendly and responsive interface.
- **Interactive UI Components:** Utilize dynamic components like Class Cards for intuitive interaction and information display.
- **Notifications & Subscriptions:** Stay updated with class changes and announcements through customizable notifications.

## Demo

![Class Catch Demo](https://via.placeholder.com/800x400) <!-- Replace with actual demo screenshots -->

Explore the [live demo](https://your-vercel-deployment-url.vercel.app) to see Class Catch in action!

## Getting Started

Follow these instructions to set up the Class Catch frontend locally on your machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn** package manager

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/class-catch.git
   cd class-catch/frontend
   ```

2. **Install Dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

### Running the Application

Start the development server:

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org) - A React framework for production.
- **Styling:** [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework for rapid UI development.
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) - A small, fast, and scalable bearbones state-management solution.
- **Icons:** [Material UI Icons](https://mui.com/components/icons/) - A comprehensive set of icons for React.
- **Deployment:** [Vercel](https://vercel.com) - Optimized for Next.js applications.

## Project Structure

```
frontend/
├── app/
│   ├── classes/
│   │   └── page.jsx
│   ├── page.jsx
│   └── layout.jsx
├── components/
│   ├── ClassCard.jsx
│   └── ...other components
├── store/
│   ├── usePlannerStore.js
│   └── useProfileStore.js
├── public/
│   └── ...static assets
├── styles/
│   └── globals.css
├── package.json
├── README.md
└── ...other configuration files
```

## Contributing

We welcome contributions to Class Catch! To get started:

1. **Fork the Repository**

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please reach out to:

- **Email:** kyrylo.bakumenko@gmail.com
- **GitHub:** [@kyrylo-bakumenko](https://github.com/kyrylo-bakumenko)
- **LinkedIn:** [Kyrylo Bakumenko](https://www.linkedin.com/in/kyrylo-bakumenko)

---
2025 Class Catch
