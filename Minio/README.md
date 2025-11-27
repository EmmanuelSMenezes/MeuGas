# Instalação Certbot

sudo apt install certbot python3-certbot-nginx


# Criação certificado

certbot certonly --standalone -d minio.gasinho.com.br --non-interactive --agree-tos -m otavio.polatto@gmail.com --cert-name minio.gasinho.com.br --preferred-challenges http

# Cópia certificados para pasta compartilhada

cp --remove-destination /etc/letsencrypt/live/minio.gasinho.com.br/fullchain.pem /opt/certs/gasinho/public.crt

cp --remove-destination /etc/letsencrypt/live/minio.gasinho.com.br/privkey.pem /opt/certs/gasinho/private.key

# Comando docker criação minio

docker run --name minio --restart=unless-stopped -p 9000:9000 -p 9001:9001 -v /data/minio:/data -v /opt/certs/gasinho:/root/.minio/certs/CAs/ -e MINIO_ROOT_USER=minio -e MINIO_ROOT_PASSWORD=Emami#17604@.. minio/minio server --console-address ":9001" /data --certs-dir /root/.minio/certs/CAs/

