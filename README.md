# Wryte

**Wryte** is a cross-platform desktop application built with Rust and Tauri, featuring a modern frontend powered by Vite and Node.js.

> **Warning:**  
> This project is heavily under development and **not ready for use**. Expect breaking changes, incomplete features, and frequent updates.

## Features

- Rust backend for performance and safety
- Tauri for secure desktop app packaging
- Vite/Node.js frontend for rapid development
- Cross-platform support (Linux, macOS, Windows)

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Tauri CLI](https://tauri.app/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wryte.git
cd wryte

# Install frontend dependencies
cd frontend
yarn install # or npm install

# Build the frontend
yarn build # or npm run build

# Go back to the root and run Tauri
cd ..
cargo tauri dev
```

## Project Structure

```
wryte/
├── frontend/         # Vite/Node.js frontend source
├── src-tauri/        # Rust/Tauri backend source
├── .gitignore
├── README.md
└── ...
```

## Contributing

Contributions are welcome! Please open issues or pull requests for discussion.

## License

This project is licensed under the MIT License.

---

**Note:**  
This project is in its early stages. Please do not use it in