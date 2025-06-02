# Emergency Care Mobile App

A React Native mobile application for medical emergencies with authentication, voice input, and real-time features.

## Features

- 🚨 **SOS Emergency Button** - One-tap emergency calling
- 📱 **User Authentication** - Secure login with Supabase Auth
- 🗣️ **Voice Input** - Voice commands for AI assistant
- 🏥 **Nearby Hospitals** - Location-based hospital finder
- 🤖 **AI First Aid Assistant** - Gemini-powered medical guidance
- 🩸 **Blood Donor Network** - Connect with blood donors
- 📞 **Emergency Contacts** - Quick access to personal contacts
- 🌙 **Dark Mode** - Theme switching support

## Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Supabase account

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd emergency-care-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Supabase**
   - Create a new Supabase project
   - Update `src/lib/supabase.ts` with your Supabase URL and anon key
   - Run the SQL commands from the web version to create tables

4. **Install iOS dependencies (iOS only)**
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`

5. **Configure permissions**
   - Android: Permissions are already configured in `AndroidManifest.xml`
   - iOS: Permissions are already configured in `Info.plist`

## Running the App

### Android
\`\`\`bash
npm run android
\`\`\`

### iOS
\`\`\`bash
npm run ios
\`\`\`

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
\`\`\`
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### Database Setup
Run these SQL commands in your Supabase SQL editor:

\`\`\`sql
-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own contacts" ON emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for donors table
CREATE POLICY "Anyone can view donors" ON donors
  FOR SELECT USING (available = true);

CREATE POLICY "Users can insert own donor profile" ON donors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donor profile" ON donors
  FOR UPDATE USING (auth.uid() = user_id);
\`\`\`

## Building for Production

### Android
\`\`\`bash
cd android
./gradlew assembleRelease
\`\`\`

### iOS
1. Open `ios/EmergencyCareApp.xcworkspace` in Xcode
2. Select your team and bundle identifier
3. Archive and upload to App Store Connect

## Features Overview

### Authentication
- Email/password authentication
- Password reset with OTP
- Secure session management
- User profile management

### Emergency Features
- One-tap SOS calling (108)
- Emergency contacts management
- Quick access to emergency numbers
- Location-based hospital search

### AI Assistant
- Voice input support
- Text-to-speech responses
- First aid guidance
- Emergency situation assessment

### Blood Donor Network
- Donor registration
- Blood group filtering
- Location-based search
- Direct calling to donors

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   \`\`\`bash
   npx react-native start --reset-cache
   \`\`\`

2. **Android build issues**
   \`\`\`bash
   cd android && ./gradlew clean && cd ..
   \`\`\`

3. **iOS build issues**
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`

4. **Voice recognition not working**
   - Ensure microphone permissions are granted
   - Test on physical device (not simulator)

5. **Location services not working**
   - Check location permissions
   - Test on physical device with GPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
