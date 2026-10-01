# Quiet Strength Recovery

Quiet Strength Recovery (QSR) is a free, optional, self-guided recovery guide built from lived experience. It offers practical reflection tools, daily check-ins, recovery milestones, urge/craving tools, support links, and local encrypted storage.

## Why this project is open source
QSR is being released openly so people can use it, study it, improve it and adapt it to help others. The project code is licensed under **GNU GPL v3.0**. Modified versions that are redistributed must remain open under the same licence terms.

## Important boundary
QSR is a recovery guide, not a medical service. It does not diagnose conditions, prescribe treatment, provide counselling or psychotherapy, manage detoxification, or replace professional or emergency care.

## Privacy
QSR has no advertising or analytics SDKs and no QSR cloud account. Workbook data is designed to remain on the user's device and is encrypted locally. Deliberate text/PDF exports are readable by design so users can save or print them.

## Web version
https://quiet-strength-recovery.netlify.app/

## Android download
Signed Android releases are published in the GitHub **Releases** section and on the official QSR website.

## Source layout
- `app.part*.txt` — maintainable JavaScript source sections
- `styles.part*.css` — maintainable CSS source sections
- `build.mjs` — joins source sections and builds the web app
- `assets/` — QSR-owned app artwork/icons
- `android-release/` — Android Trusted Web Activity source generated from the QSR web app
- `fastlane/metadata/android/en-US/` — store/F-Droid listing metadata

## Build the web app
Requirements: Node.js.

```bash
node build.mjs
```

The built web files are written to `dist/`.

## Build the Android wrapper
Requirements: JDK 17 or 21 (JDK 21 tested) and an Android SDK containing compileSdk 36. Set `ANDROID_HOME` or `ANDROID_SDK_ROOT` to your SDK path.

```bash
cd android-release
./gradlew assembleRelease
```

On Windows use `gradlew.bat assembleRelease`.

The public repository contains **no private signing key**. Release signing keys are deliberately kept outside the repository.

## F-Droid
The repository includes upstream metadata and a `.fdroid.yml` build recipe. The current Android version is a Trusted Web Activity wrapper around the QSR web app. F-Droid's main repository reviews website-wrapper apps for sufficient native value, so acceptance is subject to their review.

## Contributing
Useful fixes, accessibility improvements, translations, privacy improvements, clearer recovery wording and genuinely helpful recovery tools are welcome. Please keep QSR non-clinical, person-centred and privacy-first.

## Licence
Unless a file states otherwise, QSR source code and project-owned assets in this repository are licensed under GPL-3.0-only. Some Android wrapper/build files retain Apache-2.0 notices from the upstream Bubblewrap/Android Browser Helper project; see `THIRD_PARTY_NOTICES.md`.
