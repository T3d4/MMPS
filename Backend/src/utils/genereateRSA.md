 # Generate a private key
 openssl genrsa -aes256 -passout pass:2303 -out private-key.pem 4096

# Generate corresponding public key
openssl rsa -in private-key.pem -passin pass:2303 -pubout > public-key.pem