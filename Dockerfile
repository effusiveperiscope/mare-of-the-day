FROM python:3.13.7-trixie AS builder
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm git
WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/pip pip3 install poetry
RUN git clone https://github.com/effusiveperiscope/mare-of-the-day.git
RUN git clone https://github.com/synthbot-anon/mareoftheday-reviews.git
WORKDIR /app/mare-of-the-day
COPY marescripts/requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip3 install -r requirements.txt 
ARG PULL_VAR
RUN git pull
RUN --mount=type=cache,target=/root/.npm npm install && npm run build

FROM python:3.13.7-trixie
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm golang-go && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /app/mare-of-the-day /app/mare-of-the-day
COPY --from=builder /app/mareoftheday-reviews /app/mareoftheday-reviews

WORKDIR /app/mareoftheday-reviews
RUN --mount=type=cache,target=/root/.cache/pypoetry/artifacts python -m poetry install

WORKDIR /app
COPY envs/.env.marescripts /app/mare-of-the-day/marescripts/.env
COPY envs/.env.marescripts /app/mareoftheday-reviews/.env
COPY envs/.env.node /app/mare-of-the-day/.env
COPY envs/run.sh /app/mare-of-the-day/run.sh
COPY envs/cloudflare-ddns.sh /app/mare-of-the-day/cloudflare-ddns.sh
EXPOSE 3000
CMD ["bash", "/app/mare-of-the-day/run.sh"]