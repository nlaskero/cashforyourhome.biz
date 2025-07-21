FROM nginx:alpine
COPY . /usr/share/nginx/html
LABEL org.opencontainers.image.description="Static site for Cash for Your Home"
