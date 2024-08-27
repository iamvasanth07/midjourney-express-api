# Midjourney API Wrapper

This project provides a Node.js Express server that acts as a wrapper for the Midjourney API, allowing users to generate and upscale images using Midjourney's AI image generation capabilities.

## Features

- Image generation using Midjourney
- Automatic upscaling of generated images
- Simple REST API endpoint for image generation

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or later)
- npm (Node Package Manager)
- A Midjourney account with API access

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/iamvasanth07/midjourney-api-wrapper.git
   cd midjourney-api-wrapper
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   SERVER_ID=your_server_id
   CHANNEL_ID=your_channel_id
   SALAI_TOKEN=your_salai_token
   PORT=3000
   ```

   Replace `your_server_id`, `your_channel_id`, and `your_salai_token` with your actual Midjourney API credentials.

## Usage

1. Start the server:
   ```
   npm run dev
   ```

2. The server will start running on `http://localhost:3000` (or the port specified in your `.env` file).

3. To generate an image, send a POST request to the `/generate` endpoint with a JSON body containing the prompt:

   ```json
   {
     "prompt": "Your image description here"
   }
   ```

   Example using cURL:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"prompt":"A futuristic cityscape at night"}' http://localhost:3000/generate
   ```

4. The server will respond with a JSON object containing the URL of the generated and upscaled image:

   ```json
   {
     "imageUrl": "https://cdn.midjourney.com/..."
   }
   ```

## How It Works

1. The server receives a prompt through the `/generate` endpoint.
2. It uses the Midjourney client to generate an initial image based on the prompt.
3. The server then automatically selects one of the upscale options (U1, U2, U3, or U4) randomly.
4. It performs a first upscale on the selected option.
5. Finally, it performs a second upscale on the result of the first upscale.
6. The URL of the final upscaled image is returned to the user.

## Error Handling

The server includes basic error handling:
- It validates that a prompt is provided and is a string.
- It catches and logs errors during the image generation and upscaling processes.
- In case of an error, it returns a 500 status code with an error message.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

[LICENSE](LICENSE)

## Contact

If you have any questions or feedback, please contact [Vasanth] at [kvasanth373@gmail.com].

## Credits

This project is built using the Midjourney client from the [midjourney-api](https://github.com/erictik/midjourney-api) project by erictik.
