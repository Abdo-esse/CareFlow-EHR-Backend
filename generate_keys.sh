#!/bin/bash
set -e

mkdir -p secrets certs

echo "🔑 Generating RSA key pair for JWT..."
openssl genrsa -out secrets/jwt_private.pem 2048
openssl rsa -in secrets/jwt_private.pem -pubout -out secrets/jwt_public.pem

echo "🔒 Generating self-signed HTTPS certificate..."


# command to execute this script in bash terminal
# bash generate_keys.sh 