# RunaRoute 🏃

RunaRoute is a mobile running companion app built with Expo and React Native. It generates randomized running routes, tracks your runs in real time, and shows weather forecasts so you can plan the perfect run.

## Core Features

- **Route Generation** – Enter a starting address and desired distance (1–30 km), and get three alternative running routes powered by the [OpenRouteService API](https://openrouteservice.org/).
- **Real-Time Run Tracking** – Track your active run with live stats: distance covered, elapsed time, and current pace. Uses GPS via `expo-location`.
- **Interactive Map** – View generated routes and your current location on an interactive map (`react-native-maps`). Tap a route to select it, then start running.
- **Address Search** – Search for any starting location using address autocomplete backed by [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/).
- **Weather Forecast** – Check a 7-day weather forecast (powered by [WeatherAPI](https://www.weatherapi.com/)) to plan your runs around the weather.
- **Run History** – View your completed routes with date, distance, time, and pace.
- **Running Statistics** – See your total distance, average pace, number of routes completed, and activity over the last 30 days.
- **User Authentication** – Create an account and log in with email and password via [Supabase](https://supabase.com/).

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | [Expo](https://expo.dev) (React Native) |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Maps | [react-native-maps](https://github.com/react-native-maps/react-native-maps) |
| Location | [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) |
| Auth & Backend | [Supabase](https://supabase.com/) |
| Route API | [OpenRouteService](https://openrouteservice.org/) |
| Weather API | [WeatherAPI](https://www.weatherapi.com/) |
| Geocoding | [Nominatim](https://nominatim.openstreetmap.org/) |
| Language | TypeScript |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- API keys for OpenRouteService and WeatherAPI
- A [Supabase](https://supabase.com/) project (URL and anon key)

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root (or update the existing one) with your API keys:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_ORS_API_KEY=your_openrouteservice_api_key
   EXPO_PUBLIC_WEATHER_API_KEY=your_weatherapi_key
   ```

3. **Start the app**

   ```bash
   npx expo start
   ```

   Then open the app in one of:
   - [Expo Go](https://expo.dev/go) (scan the QR code)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

## Project Structure

```
app/              # Screens (file-based routing)
├── (tabs)/       # Main tab screens: Home, Weather, Profile
└── statistics/   # Statistics screen
components/       # Reusable UI components
constants/        # Colors and other constants
hooks/            # Custom React hooks
assets/           # Fonts, images, and icons
```
