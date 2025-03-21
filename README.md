# Burndown Chart

A modern, responsive burndown chart application built with Next.js, TypeScript, and Tailwind CSS to help agile teams track sprint progress efficiently.

## Features

- 📊 Interactive burndown charts with customizable views
- 🔄 Real-time sprint progress tracking
- 📱 Fully responsive design that works on all devices
- 🌓 Light/dark mode support
- 📋 Sprint data tables with sorting and filtering capabilities
- 📊 Dashboard overview with key metrics
- 🎨 Modern UI with Radix UI components and Tailwind CSS

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - For type safety and better developer experience
- [Tailwind CSS](https://tailwindcss.com/) - For styling with utility classes
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Recharts](https://recharts.org/) - Composable charting library
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Next Themes](https://github.com/pacocoursey/next-themes) - Theme management

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/burndown-chart.git
   cd burndown-chart
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Configuring Sprint Data

Customize your sprint data by modifying the data structures in the application. The burndown chart component accepts various configuration options to adapt to your team's workflow.

### Viewing Burndown Charts

The main burndown chart view provides a visual representation of your sprint progress, including:

- Ideal burndown line
- Actual progress line
- Remaining work
- Daily updates

### Managing Sprints

Use the dashboard to create, update, and manage sprints. The data table component allows for easy visualization and manipulation of sprint data.

## Development

### Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared logic
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Running in Production Mode

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the contributors who have helped improve this project
- The amazing open-source community around Next.js and React
