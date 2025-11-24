#!/bin/bash
set -e

mkdir -p secrets 

echo "🔑 Generating RSA key pair for JWT..."
openssl genrsa -out secrets/jwt_private.pem 2048
openssl rsa -in secrets/jwt_private.pem -pubout -out secrets/jwt_public.pem