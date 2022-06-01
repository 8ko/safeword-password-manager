![safeword](https://user-images.githubusercontent.com/28957075/171274341-c551c9d1-13d4-4e6c-8900-0c46b59902cd.png)

---

# SafeWord
A centralized password management solution that stores sensitive information such as website credentials, credit cards, and notes in an encrypted vault.

## Encryption
SafeWord uses **AES-CBC 256-bit** encryption for your Vault data, **PBKDF2 SHA-256** to derive your encryption key.

SafeWord always encrypts and/or hashes your data in the client before anything is sent to the server for storage. SafeWord server is only used for storing encrypted data.

Vault data can only be decrypted using the key derived from your master password. SafeWord is a zero knowledge encryption solution, meaning you are the only party with access to your key and the ability to decrypt your Vault data.

### AES-CBC
[AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)-CBC ([Cipher Block Chaining](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_block_chaining_(CBC))), used to encrypt Vault data, is a standard in cryptography and used by the US government and other government agencies around the world for protecting top-secret data. With proper implementation and a strong encryption key (your master password), AES is considered unbreakable.

### PBKDF2
SHA-256 is used to derive the encryption key from your master password. SafeWord [salts and hashes](https://www.okta.com/blog/2019/03/what-are-salted-passwords-and-password-hashing/) your master password with your email address locally, before transmission to the server. Once the server receives the hashed password, it is salted again with a cryptographically secure random value, hashed again, and stored in the database. The utilized hash functions are one-way hashes, meaning they cannot be reverse engineered by anyone, even the developers, to reveal your master password.

### Invoked Crypto Libraries
SafeWord only invokes crypto from popular reputable crypto libraries that are written and maintained by cryptography experts. The following crypto libraries are used:
* [Node.js Crypto](https://nodejs.org/api/crypto.html)
* [bcrypt](https://www.npmjs.com/package/bcrypt)

## How it works
The user is required to input two fields upon signup/signin: **Email** and **Password**  
These data are then derived from these two fields.  
**vaultKey:**  
`SHA256(email + password)`  
(Used as the key for encrypting & decrypting the vault, this is not sent to the server)  
**authPwd:**  
`SHA256(vaultKey + password)`  
(Used for authentication, this is sent to the server and hashed before storage)  
**vault**  
`AES(data, vaultKey)`  
(An encrypted data (website credential, credit card, or note) that is sent to the server and saved onto the database)


**Signing up,** authPwd is derived and sent to the server then hashed before storage.  
**Logging in,** vaultKey and vault is saved locally.  
**When the user updates the data**, it gets encrypted on the client before being sent to the server.  
**Logging out or refreshToken expires**, formats the localStorage.

## Authentication
SafeWord server is protected from being attacked from an unknown origin as per CORS (Cross-Origin Resource Sharing) policy. moreover, JWT (JSON Web Token) helps to ensure client security. access token and refresh token is granted upon logging in, it is signed and encrypted with JWT. as long as refresh token doesn't expire, a new access token is re-issued every now and then. slight tamper of JWT cookie will result in automatic unauthorized access to the server (HTTP status code 401/403) and user will be forcibly logged out.