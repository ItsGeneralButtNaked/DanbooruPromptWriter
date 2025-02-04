# Danbooru Prompt Writer

A simple and efficient prompt writing assistant for Danbooru tags. This project uses a web interface that lets you easily build, save, and export prompts by selecting tags.

## Features

- **Tag Suggestions:** Fetches available tags from a `tags.txt` file and provides live suggestions as you type.
- **Drag & Drop:** Easily rearrange tags via drag & drop.
- **Prompt Management:** Save, load, delete, export, and import prompts with a clean, minimalist interface.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ImSakushi/DanbooruPromptWriter.git
   cd DanbooruPromptWriter
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

   The server will start on port 3000 (or the port defined in your environment) and automatically open your default web browser to `http://localhost:3000`.

## Usage

- **Adding Tags:** Type a tag into the input field and press `Enter` or type a comma to add it.
- **Suggestions:** As you type, tag suggestions from `tags.txt` will appear. Click a suggestion to add it.
- **Managing Prompts:** Use the provided buttons to copy, save, load, export, or import your prompts.
- **Drag & Drop:** Rearrange the order of your tags by dragging them around.


*Feel free to contribute or open issues if you encounter any bugs or have feature requests!*
