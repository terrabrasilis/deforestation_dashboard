# sets the Base Image (nginx) for subsequent instructions - tag: latest
FROM nginx

# adds maintainer metadata as a key-value pair
LABEL mantainer="Luiz Fernando Assis <luizffga@dpi.inpe.br>"

# executes remotion of default.conf in a new layer on top of the current image and commit the results
RUN rm /etc/nginx/conf.d/default.conf

# copies dashboard.conf and nginx.conf, and adds them to the filesystem of the container at the defined path
COPY webapp-25-homologation-nginx/conf/webapp-25-homologation.conf /etc/nginx/conf.d/webapp-25-homologation.conf
COPY webapp-25-homologation-nginx/conf/nginx.conf /etc/nginx/nginx.conf

# listens on the specified network port at runtime
EXPOSE 80

# allows container to run as an executable using nginx
ENTRYPOINT ["nginx"]

# defines parameters to ENTRYPOINT
CMD ["-g", "daemon off;"]
