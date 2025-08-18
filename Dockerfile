FROM python:3.14-rc-trixie AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm \
    git
WORKDIR /app

RUN pip3 install poetry
RUN git clone https://github.com/effusiveperiscope/mare-of-the-day.git
WORKDIR /app/mare-of-the-day
COPY marescripts/requirements.txt .
RUN pip3 install -r requirements.txt && npm install && npm run build

WORKDIR /app
RUN git clone https://github.com/synthbot-anon/mareoftheday-reviews.git
WORKDIR /app/mareoftheday-reviews
RUN poetry install

FROM python:3.14-rc-trixie
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm golang-go && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/mare-of-the-day /app/mare-of-the-day
COPY --from=builder /usr/local/lib/python3.14/site-packages /usr/local/lib/python3.14/site-packages
COPY envs/.env.marescripts /app/mare-of-the-day/marescripts/.env
COPY envs/.env.node /app/mare-of-the-day/.env
COPY envs/run.sh /app/mare-of-the-day/run.sh
CMD ["/app/mare-of-the-day/run.sh"]