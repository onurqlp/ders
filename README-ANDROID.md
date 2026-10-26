# AYDA Öğrenci Portalı Android WebView

The Android shell opens `https://ders.aydadil.com/` directly. Portal pages and UI are never copied into the APK, so web content updates arrive from the live site without rebuilding or reinstalling the app.

## Build a signed release

Install Android SDK platform 35 and Gradle 8.9, then run:

```sh
gradle :app:assembleRelease \
  -PAYDA_STORE_FILE=/secure/path/ayda-release.jks \
  -PAYDA_STORE_PASSWORD=... \
  -PAYDA_KEY_ALIAS=ayda-release \
  -PAYDA_KEY_PASSWORD=...
```

Keep the release keystore and passwords in a private backup. Do not commit them. A future native APK update must use the same signing key; routine portal content changes need no APK update.
