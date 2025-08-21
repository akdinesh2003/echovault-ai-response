# EchoVault - AI-Powered Emergency Response System

EchoVault is a modern, AI-driven platform for reporting and verifying emergencies in real-time. It empowers users to submit incident reports with text, images, or audio, while leveraging AI to assess severity and authenticity, ensuring that responders can act quickly and effectively.

## ✨ Features

-   **Real-Time Incident Reporting**: Submit emergency reports with precise geolocation.
-   **Multimedia Uploads**: Attach images or audio recordings to provide richer context.
-   **AI-Powered Analysis**:
    -   **Severity Scoring**: Automatically assesses the urgency of a report using Natural Language Processing.
    -   **Authenticity Verification**: AI-driven analysis of media to identify potential false reports.
-   **Interactive Map**: Visualize all reported incidents on a live, interactive map.
-   **Analytics Dashboard**: A comprehensive dashboard with charts and stats to track incident trends.
-   **Anonymous Reporting**: Option for users to submit reports anonymously.
-   **Responsive Design**: A sleek and effective interface that works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **AI**: [Google Gemini (via Genkit)](https://firebase.google.com/docs/genkit)
-   **UI**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
-   **Maps**: [Google Maps Platform](https://mapsplatform.google.com/)

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akdinesh2003/echovault-ai-response.git
    cd echovault-ai-response
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your Firebase and Google Maps credentials. The app is already connected to a Firebase project, so you can use the credentials below.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDA98mp868M8n-wJPvD-anR7hkIrgOopE8"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="echovault-1b80q.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="echovault-1b80q"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="echovault-1b80q.firebasestorage.app"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="361403673991"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:361403673991:web:c4ecea2232da4af3b7f722"

    # Important: You must create your own Google Maps API Key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
    ```

4.  **Google Maps API Key Setup:**

    The application requires a Google Maps API key to display the map. **You must enable billing on your Google Cloud project for the map to work.** Google offers a generous free tier, so you are unlikely to incur charges for development purposes.

    -   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    -   Select the project with the ID `echovault-1b80q`.
    -   Navigate to the **APIs & Services > Credentials** page.
    -   Click **Create credentials** and select **API key**.
    -   Copy the generated API key and paste it into your `.env.local` file for the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` variable.
    -   Go to the [Google Cloud Console Billing page](https://console.cloud.google.com/billing) and link a billing account to the `echovault-1b80q` project.

### Running the Application

Once the setup is complete, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application in action.

## ✍️ Author

-   **AK DINESH** - [https://github.com/akdinesh2003](https://github.com/akdinesh2003)
