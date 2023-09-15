# Blue10 Mobile App

This is the Blue10 Mobile App. It is a React Native app that uses the Blue10 API to provide a mobile interface to the 
Blue10 platform.

## Setup
For development we use .env file.
You can use the following content for the env file.
```
AUTH_LOGIN_PAGE=<login page url>
```

## Getting Started
Install the dependencies:

`npm install`

Run the app:

`npm run ios`

or if you're more a fan of Android:

`npm run android`

## Contributing
We welcome contributions! Please read the [contribution guidelines](.github/CONTRIBUTING.md) before you start.

## Development build
Follow instruction found here:
https://docs.expo.dev/development/create-development-builds/


## Create builds

**For iOS simulator**
```bash
eas build --local --profile development-simulator --platform ios
```

(or use the shorthand: `npm run build:ios`)

**For iOS device**
To register any iOS device you'd like to develop onto your ad hoc provisioning profile, run the following command:
```bash
eas device:create
```

After registering your iOS device, you can create the development build by running the command:
```bash
eas build --local --profile development --platform ios
```

**For Android device or emulator**
```bash
eas build --local --profile development --platform android
```

(or use the shorthand: `npm run build:android`)

*Note:* if you want to build them on the Expo server, you can drop the `--local` flag.

## Building for production and pushing to store

Build the app for `all` platforms with the `production` profile, and use `--auto-submit` to submit the build to the 
Apple App Store and Google Play Store automatically. Build them on the Expo server (so without `--local`) to ensure
Expo knows when the build is complete and can submit automatically.

```bash
eas build --profile production --platform all --auto-submit
```

(or use the shorthand: `npm run build:deploy`)

If asked to log into your Apple account, choose `no`. This is not necessary.
