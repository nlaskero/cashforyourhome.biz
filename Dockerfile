FROM nginx:alpine
LABEL org.opencontainers.image.description="Static site for Cash for Your Home LLC"
COPY . /usr/share/nginx/html

