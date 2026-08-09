# Firebase Cloud Messaging (FCM) Push Notification Sender

A minimal Node.js TypeScript script for sending push notifications to web and mobile devices using the **Firebase Admin SDK** and FCM v1 HTTP API.

---

## Prerequisites

Before running this script, ensure you have:

* **Node.js** (v18 or higher recommended)
* A **Firebase Project** setup in the [Firebase Console](https://console.firebase.google.com/)
* A valid FCM **Device Registration Token** generated from a client app (Web, Android, or iOS)

---

## Setup Instructions

### 1. Download Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Project Settings** > **Service Accounts**.
3. Click **Generate New Private Key**.
4. Download the JSON file, rename it to `serviceAccountKey.json`, and place it in the root directory of this project.

> **Security Note:** Never commit `serviceAccountKey.json` to public version control. Ensure it is listed in your `.gitignore` file.

### 2. Install Dependencies

Install the required dependencies via npm or yarn:

```bash
npm install firebase-admin
npm install -D typescript @types/node