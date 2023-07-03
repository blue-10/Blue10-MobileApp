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

    npm install

Run the app:

    npm run ios

or if you're more a fan of Android:

    npm run android

## Contributing
We welcome contributions! Please read the [contribution guidelines](.github/CONTRIBUTING.md) before you start.

## Development build
Follow instruction found here:
https://docs.expo.dev/development/create-development-builds/


## Create builds

**For iOS simulator**
```bash
eas build --profile development-simulator --platform ios
```

**For iOS device**
To register any iOS device you'd like to develop onto your ad hoc provisioning profile, run the following command:
```bash
eas device:create
```

After registering your iOS device, you can create the development build by running the command:
```
eas build --profile development --platform ios
```

**For Android device**
```
eas build --profile development --platform android
```

*Note:* if you want to run them locally you can use the `--local` flag for it.
*Note:* use `--auto-submit` to auto submit directly to the stores.