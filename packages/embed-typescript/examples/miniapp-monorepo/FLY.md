# Deployment Guide for Fly.io

This guide will help you deploy the miniapp-monorepo to Fly.io.

## Prerequisites

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Sign up for a Fly.io account: https://fly.io/docs/hands-on/sign-up/
3. Login to Fly: `fly auth login`
4. Create the app via `fly launch` or by deploying a Github Repo

## Environment Variables

Set up your environment variables in Fly.io:

```bash
fly secrets set API_KEY_EMBED=your_embed_api_key_here
```

## Deployment Steps

### 1. Update the app name

Edit `fly.toml` and change `your-app-name-here` to your desired app name:

```toml
app = "your-unique-app-name"
```

### 2. Deploy the application

```bash
# Deploy to Fly.io
fly deploy

# Or deploy with a specific region
fly deploy --region iad
```


### 3. Set up a custom domain (optional)

```bash
# Add your custom domain
fly certs add yourdomain.com

# Follow the DNS instructions provided by Fly
```

### 4. Scale your application (optional)

```bash
# Scale to multiple instances
fly scale count 2

# Scale with more resources
fly scale vm shared-cpu-2x --memory 1024
```

## Monitoring

- View logs: `fly logs`
- Monitor app status: `fly status`
- Open the app: `fly open`

## Health Checks

The application includes health checks at `/health` that will:
- Return 200 OK if the server is running
- Include timestamp and API key status
- Be automatically checked by Fly.io every 30 seconds

## Architecture

This deployment:
- Uses Bun runtime for better performance
- Serves the built React client as static files
- Runs the Hono server on port 3000
- Includes proper health checks and signal handling
- Uses a non-root user for security
- Supports SPA routing with fallback to index.html

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are properly listed in package.json
2. **Health check fails**: Verify the server is starting correctly and the /health endpoint works
3. **Static files not served**: Ensure the client build completed successfully

### Debug Commands

```bash
# Check app status
fly status

# View recent logs
fly logs

# SSH into the running container
fly ssh console

# Restart the app
fly apps restart
```

## Cost Optimization

- The app is configured with `auto_stop_machines = true` to stop when not in use
- `min_machines_running = 0` allows the app to scale to zero
- Uses shared CPU instances for cost efficiency 
