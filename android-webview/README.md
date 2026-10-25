# AYDA Ders Android WebView

A small Android shell for the AYDA Ders portal. It loads the existing website and does not bundle a second web application.

## Build variants

- Preview: `./gradlew :app:assemblePreviewDebug` loads the pinned Phase 2 GitHub HTML preview. The package ID ends in `.preview`.
- Production configuration: `./gradlew :app:assembleProductionDebug` loads `https://ders.aydadil.com/`. This is a debug build configuration only; it does not publish or sign a store release.

Install the preview APK from GitHub Actions artifact `ayda-ders-preview-debug`. The workflow runs tests and builds on pushes to this feature branch.

## Navigation and permissions

Production navigation is restricted to the portal root, the listed AYDA course paths, and the AYDA OSD/Kurs hosts. Preview builds allow only the pinned htmlpreview URL. HTTP links are blocked; HTTPS links outside the allowlist open in the browser. Safe Browsing is kept enabled, SSL errors are not overridden, and mixed content is blocked.

The app requests internet and network state only. Third-party cookies are disabled. Downloads use Android DownloadManager. File selection uses the system document picker. The shell does not expose a JavaScript bridge or request camera, microphone, or broad storage access.

The site controls its own session and cookies. The wrapper does not clear WebView cache or cookies.
