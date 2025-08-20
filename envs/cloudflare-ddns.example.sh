CLOUDFLARE_API_TOKEN="your-cloudflare-api-token-here"
DOMAINS=mare-of-the-day.com,www.mare-of-the-day.com 
PROXIED=true
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN DOMAINS=$DOMAINS PROXIED=$PROXIED go run github.com/favonia/cloudflare-ddns/cmd/ddns@latest