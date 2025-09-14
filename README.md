# QR Factory-Secure Product Authentication System 🔒📦

## Overview 🧐

QR Factory is a comprehensive product authentication system designed to combat counterfeit products through secure QR code generation and verification. The application provides two main interfaces:

- **Manufacturer Portal 🏭**: Generate and manage secure QR codes for your products
- **Consumer Verification 👤**: Scan and verify product authenticity instantly

The application features a modern UI with distinct visual themes for different sections:
- **Main Landing Page 🏠**: Elegant design with a professional backdrop
- **Manufacturer Portal 🏭**: Distinctive background theme for brand management
- **Consumer Section 👤**: User-friendly interface with a separate visual identity

## Features ✨

### For Manufacturers 🏭

- **Secure QR Generation 🔑**: Create unique, tamper-proof QR codes for your products
- **Batch Processing 📦**: Generate multiple QR codes at once for production batches
- **Product Information 📝**: Include essential product details like batch numbers, manufacturing dates, and expiry dates
- **Dashboard Management 📊**: Track and manage your generated QR codes

### For Consumers 👤

- **Instant Verification ⚡**: Scan product QR codes to verify authenticity in seconds
- **Detailed Results 📄**: View comprehensive product information for genuine products
- **Counterfeit Alerts 🚨**: Receive clear warnings about potentially fake products
- **User-Friendly Interface 🖱️**: Simple and intuitive scanning process

## Technology Stack 💻

- **Frontend**: React with TypeScript ⚛️
- **UI Framework**: Tailwind CSS with shadcn/ui components 🎨
- **QR Code Handling**: html5-qrcode for scanning 📷, qrcode for generation 🔲
- **Routing**: React Router 🛣️
- **Build Tool**: Vite 🏗️
- **Styling**: Custom glassmorphism effects and background images 🖌️

## Getting Started 🚀

### Prerequisites ⚙️

- Node.js (v14 or higher) 🟢
- npm or bun package manager 📦

### Installation 💾

```bash
# Clone the repository
git clone <repository-url>
cd qr-factory-dash

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```
The application will be available at `http://localhost:8080` 🌐

## Usage 🛠️

### Manufacturer Portal 🏭

- Navigate to the Manufacturer Portal from the home page
- Fill in the product details form (product name, batch number, dates, etc.) 📝
- Specify the quantity of QR codes needed
- Generate the QR codes 🔑
- Download or view the generated QR codes 📥

### Consumer Verification 👤

- Navigate to the Consumer Verification from the home page
- Click "Scan Product" to open the scanner 📷
- Position the product QR code within the scanner frame
- View the verification result and product details ✅

## Demo Mode 🎮

The application includes a demo mode that allows you to test the verification system without scanning actual QR codes:

- **Generate Genuine QR ✅**: Creates a test QR code for a legitimate product
- **Generate Counterfeit QR ⚠️**: Creates a test QR code that will be flagged as potentially fake
- **Generate Invalid QR ❌**: Creates a test QR code with invalid data format

## Building for Production 🏗️

```bash
# Build the application
npm run build
# or
bun run build

# Preview the production build locally
npm run preview
# or
bun run preview
```
## Security Features 🔐

- **Unique Identifiers 🆔**: Each QR code contains a unique product ID to prevent duplication
- **First-Scan Detection 👀**: System flags products that have been scanned before as potential counterfeits
- **Data Validation ✅**: Robust validation of QR code data structure to prevent tampering
- **Visual Authentication 🖼️**: Clear visual indicators for genuine vs. counterfeit products

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Built with [React ⚛️](https://reactjs.org/)
- UI components from [shadcn/ui 🎨](https://ui.shadcn.com/)
- QR code scanning powered by [html5-qrcode 📷](https://github.com/mebjas/html5-qrcode)
- QR code generation with [qrcode 🔲](https://github.com/soldair/node-qrcode)
