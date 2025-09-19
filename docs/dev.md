# Agile Development Guide for Logseq Plugins

This document explains how to set up a local development environment to build and test this Logseq plugin in real-time, avoiding the slow cycle of manually exporting and installing it.

## Step 1: Prerequisites

Ensure you have the following installed on your system:

1.  **Logseq Desktop App**: The desktop application for Logseq.
2.  **Node.js and npm**: The JavaScript runtime and its package manager. You can download it from [nodejs.org](https://nodejs.org/).
3.  **Git**: For cloning the repository.

## Step 2: Dependency Installation

The base project has already been cloned into the `logseq-plugin-dev` folder. The next step is to install the dependencies.

1.  Open a terminal.
2.  Navigate to the plugin directory:
    ```sh
    cd logseq-plugin-dev
    ```
3.  Install all necessary dependencies:
    ```sh
    npm install
    ```

## Step 3: Start the Development Server

This is the key step for agility. The development server will compile your code and automatically update whenever you save a change.

1.  In the terminal, inside the `logseq-plugin-dev` directory, run:
    ```sh
    npm run dev
    ```
2.  This command will start a local server and "watch" for changes in your source files (inside `src/`).

## Step 4: Load the Plugin in Logseq

Now you need to tell Logseq to load the plugin from your local development environment.

1.  Open the Logseq application.
2.  Enable **Developer Mode**:
    *   Go to `Settings` > `Advanced`.
    *   Toggle the **Developer mode** switch on.
    *   Restart Logseq if prompted.
3.  Load the plugin:
    *   Once restarted, go to the `Plugins` menu (puzzle piece icon in the toolbar).
    *   Click the green **`Load unpacked plugin`** button.
    *   In the file explorer, select the root folder of this project: `logseq-plugin-dev`.

## The Workflow

With everything set up, your development cycle will be this simple:

1.  Make sure `npm run dev` is running in a terminal.
2.  Make changes to the plugin's source code (e.g., in `logseq-plugin-dev/src/App.tsx`).
3.  **Save the file**.
4.  The development server will automatically recompile the plugin.
5.  Logseq will detect the new version and **reload the plugin in real-time**. You will see your changes almost instantly.

To stop the development server, simply press `Ctrl + C` in the terminal where it is running.