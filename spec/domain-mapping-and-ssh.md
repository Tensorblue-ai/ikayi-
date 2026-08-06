# Domain Mapping And SSH Notes

## Current VM SSH Command

Run this from Windows PowerShell:

```powershell
ssh -i "C:\Users\beeso\OneDrive\Desktop\riya-instance-1_key (1).pem" azureuser@20.51.219.119
```

The VM public IP is:

```text
20.51.219.119
```

Current app URLs before domain mapping:

```text
Frontend: http://20.51.219.119/
Admin:    http://20.51.219.119/admin
API:      http://20.51.219.119/api
Health:   http://20.51.219.119/health
```

## Current Hosting Flow

The production flow is:

```text
Browser -> Nginx port 80 -> Next.js frontend on 127.0.0.1:3000
Browser -> Nginx port 80 -> Backend API on 127.0.0.1:5001
```

Nginx is the public entry point. PM2 keeps the frontend and backend processes alive.

Current expected PM2 processes:

```text
ikayi-frontend    Next.js production server on port 3000
ikayi-backend     Node backend on port 5001
ikayi-cloudflare  Optional quick Cloudflare tunnel to Nginx port 80
```

## Temporary Cloudflare Quick Tunnel

The quick tunnel command is:

```bash
cloudflared tunnel --url http://localhost:80
```

When running through PM2:

```bash
pm2 start cloudflared --name ikayi-cloudflare -- tunnel --url http://localhost:80
pm2 save
```

Important limitation: a `trycloudflare.com` quick tunnel URL is temporary. If the tunnel stops or restarts, Cloudflare can give a different URL. Do not treat this as the final production URL.

## Final Domain Mapping Steps

These steps should be done later after the real domain is ready.

1. Add the domain to Cloudflare.

2. Change the domain registrar nameservers to the two Cloudflare nameservers shown in the Cloudflare dashboard.

3. SSH into the VM:

```bash
ssh -i "C:\Users\beeso\OneDrive\Desktop\riya-instance-1_key (1).pem" azureuser@20.51.219.119
```

4. Login cloudflared on the VM:

```bash
cloudflared tunnel login
```

5. Create a named tunnel:

```bash
cloudflared tunnel create ikayi
```

6. Create the Cloudflare tunnel config:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Paste this, replacing `ikayi.com` with the real domain and replacing the credentials file path with the actual tunnel JSON file path printed by Cloudflare:

```yaml
tunnel: ikayi
credentials-file: /home/azureuser/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: ikayi.com
    service: http://localhost:80
  - hostname: www.ikayi.com
    service: http://localhost:80
  - service: http_status:404
```

7. Route DNS to the tunnel:

```bash
cloudflared tunnel route dns ikayi ikayi.com
cloudflared tunnel route dns ikayi www.ikayi.com
```

8. Install cloudflared as a system service:

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl restart cloudflared
sudo systemctl status cloudflared --no-pager
```

9. Update backend environment on the VM:

```bash
cd ~/ikayi/ikayi/backend
nano .env
```

Use the real domain:

```env
NODE_ENV=production
PORT=5001
FRONTEND_ORIGIN=https://ikayi.com
API_ASSET_BASE_URL=https://ikayi.com/api/assets
```

Do not remove the existing database, auth, or storage secrets from `.env`.

10. Restart backend:

```bash
pm2 restart ikayi-backend
```

11. Update frontend production environment on the VM:

```bash
cd ~/ikayi/ikayi/frontend
nano .env.production
```

Use:

```env
NEXT_PUBLIC_API_ORIGIN=https://ikayi.com
IKAYI_API_ORIGIN=http://127.0.0.1:5001
PORT=3000
NODE_ENV=production
```

12. Rebuild and restart frontend:

```bash
pnpm build
pm2 restart ikayi-frontend
pm2 save
```

13. Rewrite old asset URLs stored in MongoDB:

```bash
cd ~/ikayi/ikayi
node script.js OLD_ASSET_BASE_URL https://ikayi.com/api/assets
```

Examples:

```bash
node script.js http://localhost:5000/api/assets https://ikayi.com/api/assets
node script.js http://20.51.219.119/api/assets https://ikayi.com/api/assets
node script.js https://plate-chelsea-images-micro.trycloudflare.com/api/assets https://ikayi.com/api/assets
```

14. Verify there are no old URLs left:

```bash
curl -s http://127.0.0.1:5001/api/admin/sections | grep 'localhost\|20.51.219.119\|trycloudflare'
```

Expected result: no output.

15. Test the final URLs:

```text
https://ikayi.com/
https://ikayi.com/admin
https://ikayi.com/health
https://ikayi.com/api/assets/assets/exp1.png
```

## Notes

After the real domain is mapped, users should open the app with the domain only. They should not use their own IP addresses, the VM IP, or frontend/backend ports directly.

Keep Azure port `80` open if using direct IP access. With Cloudflare Tunnel, Cloudflare connects outbound from the VM, so the public site can work without exposing app ports like `3000` or `5001`.
