# Danbooru Prompt Writer

A simple and efficient prompt writing assistant for Danbooru tags. This project uses a web interface that lets you easily build, save, and export prompts by selecting tags.

## Features

- **Tag Suggestions:** Fetches available tags from a `tags.txt` file and provides live suggestions as you type.
- **Drag & Drop:** Easily rearrange tags via drag & drop.
- **Prompt Management:** Save, load, delete, export, and import prompts with a clean, minimalist interface.
- **Docker Support:** Run the app in a containerized environment with the provided Dockerfile.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)
- Docker (if running via container)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ItsGeneralButtNaked/DanbooruPromptWriter.git
    cd DanbooruPromptWriter
    ```

1. **Install the dependencies:**

    ```bash
    npm install
    ```

   > Note: A `node_modules` folder will be created locally containing all dependencies.

2. **Start the application:**

    ```bash
    npm start
    ```

   The server will start on port 3000 (or the port defined in your environment). Browser auto-opening has been disabled in `app.js`, so you will need to open `http://localhost:3000` manually.

### Using Docker

1. **Build the Docker image:**

    ```bash
    docker build -t danboorupromptwriter .
    ```

2. **Run the container:**

    ```bash
    docker run -p 3000:3000 danboorupromptwriter
    ```

3. **Optional with docker-compose:**

    ```bash
    docker-compose up
    ```

Then open `http://localhost:3000` in your browser.

## Usage

- **Adding Tags:** Type a tag into the input field and press `Enter` or type a comma to add it.
- **Suggestions:** As you type, tag suggestions from `tags.txt` will appear. Click a suggestion to add it.
- **Managing Prompts:** Use the provided buttons to copy, save, load, export, or import your prompts.
- **Drag & Drop:** Rearrange the order of your tags by dragging them around.

*Feel free to contribute or open issues if you encounter any bugs or have feature requests!*
