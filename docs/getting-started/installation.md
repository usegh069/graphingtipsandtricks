# Installation

This guide provides instructions for installing and setting up the CCPorted project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [Git](https://git-scm.com/)

## Clone the Repository

```bash
git clone https://github.com/ccported/ccported.github.io.git
cd ccported.github.io
```

## Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

This will install all the required dependencies, including:

- TypeScript
- JSDoc
- GitBook CLI
- Other development dependencies

## Build the Project

To build the project, run:

```bash
./build.sh
```

This script will:

1. Compile TypeScript files to JavaScript
2. Copy the compiled files to their original locations

If you want to generate documentation as well, use:

```bash
./build.sh --docs
```

## Development Mode

For development, you can use the watch mode to automatically recompile TypeScript files when changes are detected:

```bash
npm run watch
```

## Next Steps

After installation, refer to the [Development Setup](development-setup.md) guide for information on configuring your development environment and running the project locally.
