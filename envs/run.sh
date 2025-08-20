# start_servers.sh

# Exit immediately if a command fails
set -e

# Create a logs directory if not exists
mkdir -p /app/logs

# Function to start a server in a given directory with a log file
start_server() {
  local dir=$1
  local cmd=$2
  local log_name=$3

  echo "Starting server in $dir..."
  (
    cd "$dir"
    # Run command, redirect stdout & stderr, keep process alive in background
    nohup $cmd > "/app/logs/${log_name}.out" 2>&1 &
    echo "  PID: $!"
  )
}

start_server "/app/mare-of-the-day" "node -r dotenv/config .next/standalone/server.js" "mare-of-the-day"
start_server "/app/mare-of-the-day" "bash cloudflare-ddns.sh" "cloudflare-ddns"
start_server "/app/mareoftheday-reviews" "python -m poetry run python -m mareoftheday" "mareoftheday-reviews"
tail -f /dev/null