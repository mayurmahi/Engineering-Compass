const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Engineering Compass...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# MongoDB Connection String
# Local development
MONGODB_URI=mongodb://localhost:27017/engineering-compass

# For production, use MongoDB Atlas or other cloud database
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/engineering-compass

# JWT Secret Key (Generate a new one for production)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=x7ZdaiSpSLdih8j9wxd4OpR0vIhLZu1oDEvhHMKfLEQ=

# Google Gemini API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyDlbB4G6sppI0FaAjTrCoPoP17LPL1TSeY

# Server Port (optional)
PORT=5000

# Email Configuration (for future features)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MongoDB is running locally or update MONGODB_URI in .env');
console.log('2. Update GEMINI_API_KEY in .env with your actual API key');
console.log('3. Run: npm run install-all');
console.log('4. Run: npm run dev');
console.log('\n🎯 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\n✨ Happy coding!');
