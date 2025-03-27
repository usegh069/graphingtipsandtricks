# Development Setup

This guide provides instructions for setting up your development environment for the CCPorted project.

## Editor Configuration

We recommend using Visual Studio Code with the following extensions:

- **TypeScript**: For TypeScript language support
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **GitLens**: For enhanced Git capabilities
- **Live Server**: For local development server

## TypeScript Configuration

The project uses TypeScript for type checking. The configuration is defined in `tsconfig.json` at the root of the project. Key settings include:

- JavaScript files are included in type checking (`allowJs: true`)
- Declaration files are generated (`declaration: true`)
- Source maps are enabled (`sourceMap: true`)
- Output directory is set to `./dist` (`outDir: "./dist"`)

## Environment Setup

No specific environment variables are required for basic development. However, for authentication features, you may need to set up Amazon Cognito credentials.

## Running Locally

To run the project locally:

1. Build the project:
   ```bash
   ./build.sh
   ```

2. Serve the static files using a local server. If you have the Live Server extension in VS Code, you can right-click on `index.html` and select "Open with Live Server".

   Alternatively, you can use any static file server:
   ```bash
   npx serve
   ```

3. Open your browser and navigate to the local server URL (typically http://localhost:5000 or similar).

## Development Workflow

1. Make changes to the JavaScript files in the `/static` directory
2. Run the TypeScript compiler to check for type errors:
   ```bash
   npm run build
   ```
   or use watch mode:
   ```bash
   npm run watch
   ```
3. Test your changes locally
4. Generate documentation if needed:
   ```bash
   npm run docs
   ```
5. Commit and push your changes

## Debugging

For debugging:

1. Use browser developer tools to debug JavaScript
2. Check the console for errors
3. Use source maps to debug the original source code

## Testing

Currently, the project does not have automated tests. Manual testing should be performed for any changes.
