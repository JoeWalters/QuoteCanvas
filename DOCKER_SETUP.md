# GitHub Secrets Setup for Docker Hub Auto-Build

To enable automatic Docker image builds and uploads to your personal Docker Hub account, you need to configure GitHub repository secrets.

## Required Secrets

### 1. DOCKERHUB_USERNAME
- Your Docker Hub username
- Example: `joewalters`

### 2. DOCKERHUB_TOKEN
- Docker Hub Access Token (recommended) or password
- **Strongly recommended**: Use an Access Token instead of your password

## How to Set Up

### Step 1: Create Docker Hub Access Token
1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to Account Settings → Security
3. Click "New Access Token"
4. Name it something like "GitHub Actions QuoteCanvas"
5. Select permissions: "Public Repo Read, Write, Delete"
6. Copy the generated token (you won't see it again!)

### Step 2: Add Secrets to GitHub Repository
1. Go to your GitHub repository: `https://github.com/JoeWalters/QuoteCanvas`
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"

#### Add DOCKERHUB_USERNAME:
- Name: `DOCKERHUB_USERNAME`
- Secret: `joewalters` (or your Docker Hub username)
- Click "Add secret"

#### Add DOCKERHUB_TOKEN:
- Name: `DOCKERHUB_TOKEN`
- Secret: (paste the access token you created)
- Click "Add secret"

## How It Works

Once configured, the workflow will:

1. **Trigger**: Automatically run when you push to the `main` branch
2. **Build**: Create multi-architecture Docker images (AMD64 + ARM64)
3. **Tag**: Create two tags:
   - `joewalters/quotecanvas:latest` (always points to newest)
   - `joewalters/quotecanvas:YYMMDDHHmmss` (timestamped version, e.g., `251007143022`)
4. **Push**: Upload to Docker Hub automatically
5. **Cache**: Use GitHub Actions cache for faster builds

## Testing the Setup

After configuring the secrets:

1. Make a small change to any file
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Test Docker Hub auto-build"
   git push origin main
   ```
3. Go to the "Actions" tab in your GitHub repository
4. Watch the "Build and Push Docker Image" workflow
5. Check your Docker Hub repository after completion

## Usage After Setup

Once the first build completes, anyone can use your image:

```bash
# Pull and run the latest version
docker run -p 8000:8000 joewalters/quotecanvas:latest

# Or pull a specific timestamped version
docker run -p 8000:8000 joewalters/quotecanvas:251007143022
```

## Troubleshooting

### Build Fails with Authentication Error
- Double-check your `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
- Ensure the access token has "Public Repo Read, Write, Delete" permissions
- Try regenerating the Docker Hub access token

### Build Succeeds but No Images on Docker Hub
- Check if your Docker Hub repository exists (it should be auto-created)
- Verify the workflow only runs on `main` branch pushes, not pull requests
- Check the workflow logs for any push errors

### Multi-architecture Build Issues
- The workflow builds for both AMD64 and ARM64
- If you only need one architecture, you can modify the workflow
- ARM64 builds might take longer than AMD64

## Security Notes

- ✅ Uses Docker Hub Access Token (more secure than password)
- ✅ Secrets are encrypted and not visible in logs
- ✅ Only runs on main branch (not on pull requests)
- ✅ Uses least-privilege access tokens