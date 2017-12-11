# Usage
Supports username, id or email (just provide one) and a new password:

USAGE: setPassword [--u USERNAME | --e EMAIL | --i ID] --p NEWPASSWORD

Examples:

./setPassword --u andrew -p 1234

# Installation
npm install pg

npm install bcrypt

chmod +x setPassword

Then edit setPassword.js and specify the database credentials at the top
