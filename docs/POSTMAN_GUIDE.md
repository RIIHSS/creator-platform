Here is a comprehensive and professional **`POSTMAN_GUIDE.md`** tailored to your Creator Platform project. 

***

# cri8tor API - Postman Guide

This guide will help you set up and test the cri8tor API using Postman. Following this specific order is necessary because many requests depend on the authentication token generated during login.

## 1. Prerequisites
- **Docker Desktop** must be running.
- The stack must be active: `docker-compose up --build`.
- **Postman** (Desktop or Web version) installed.

---

## 2. Setup Instructions

### Import the Collection
1. Open Postman.
2. Click the **Import** button in the top-left sidebar.
3. Drag and drop the `cri8tor_collection.json` file (provided in the `docs/postman/` folder).
4. You should now see "Creator's Platform API" in your collections.

### Import the Environment
1. Click **Import** again.
2. Drag and drop the `cri8tor_environment.json` file.
3. In the top-right corner of Postman, click the Environment dropdown and select **"Local Development"**.

---

## 3. Explanation of Variables
The collection uses variables to save you from copy-pasting IDs and tokens manually.

| Variable | Description |
| :--- | :--- |
| `{{baseURL}}` | The URL of your server (default: `http://localhost:5000`). |
| `{{authToken}}` | The JWT generated after Login/Register. Used for protected routes. |
| `{{currentPostId}}` | The ID of the post you are currently viewing or updating. |

---

## 4. Recommended Order of Requests

To test the full API lifecycle, run the requests in this specific order:

### Phase 1: Authentication
1. **Register User (POST)**: Create a new account.
2. **Login User (POST)**: Authenticate. 
   - *Note: Our "Scripts" (Tests) logic will automatically save the returned token to your `{{authToken}}` variable.*

### Phase 2: User Management
3. **Get All Users (GET)**: Verify you can see the list of registered users. This requires a valid `authToken`.

### Phase 3: Posts & Images
4. **Upload Image (POST)**:
   - Go to the **Body** tab.
   - Select **form-data**.
   - Hover over the key and change it to **File**.
   - Select an image from your computer and click **Send**.
   - Copy the returned `url` for the next step.
5. **Create Post (POST)**:
   - Provide a `title`, `content`, and the `coverImage` URL from the previous step.
6. **Get All Posts (GET)**:
   - Fetch the list of all posts. Copy an `_id` from the response to use in the next steps.

### Phase 4: Specific Post Actions
7. **Update Post (PUT)**:
   - Ensure the ID in the URL matches a post you created.
   - Change the title or content in the Body.
8. **Get Single Post (GET)**:
   - Verify the updates were saved.
9. **Delete Post (DELETE)**:
   - Remove the post from the database.

---

## 5. Troubleshooting Common Errors

### 401 Unauthorized / "User not found"
- **Cause**: Your token is expired or the user associated with the token was deleted from the database.
- **Fix**: Run the **Login User** request again to refresh the `{{authToken}}`.

### 404 Not Found
- **Cause**: The ID in the URL is incorrect or belongs to a different collection (e.g., using a User ID in a Post URL).
- **Fix**: Run **Get All Posts**, copy a fresh `_id`, and paste it into the URL. Ensure there are no hidden spaces at the end of the URL.

### 400 Bad Request / "Title/Content required"
- **Cause**: The request body is empty or formatted incorrectly.
- **Fix**: Ensure the **Body** tab is set to **raw** and the format dropdown is set to **JSON**. Check that `content` is at least 10 characters long.

### "Cannot POST /api/posts/..."
- **Cause**: Using the wrong HTTP method (e.g., using POST instead of PUT for an update).
- **Fix**: Change the dropdown next to the URL to the method specified in this guide.