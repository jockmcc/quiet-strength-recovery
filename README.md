<!-- Current feature update: use the official website app; old Netlify copies are pending a credit-limit resolution. -->
# Quiet Strength Recovery

Download both free apps: https://quietstrengthrecovery.co.uk/downloads/ . Current signed Android build: v1.10 (v1.11 is in testing)


## Current release

| App | Version | Code | Release tag | APK | SHA-256 | Status |
|---|---|---|---|---|---|---|
| Quiet Strength Recovery | 1.10 | 5 | mobile-resources-2026-10-12 | Quiet-Strength-Recovery-v1.10.apk | 600c4d8fc06d1e93cf3997ec76741fb416a2e6d3d9bd54e852078d214e9d28da | Public |
| Quiet Strength Recovery | 1.11 | 6 | not released | Quiet-Strength-Recovery-v1.11.apk | 1cb195c8e3699b559c6d4aacec70f38ada4590937ece39a4e9599458208d4389 | In testing; promoted only after the Android acceptance test |

Check a download on Windows with `Get-FileHash Quiet-Strength-Recovery-v1.10.apk`. The sections further down are release history.

Quiet Strength Recovery (QSR) is a free, optional, self-guided recovery guide built from lived experience. For adults aged 18+, it offers practical reflection tools, daily check-ins, recovery milestones, urge/craving tools, support links, and local encrypted storage.

## Why this project is open source
QSR is being released openly so people can use it, study it, improve it and adapt it to help others. The project code is licensed under **GNU GPL v3.0**. Modified versions that are redistributed must remain open under the same licence terms.

## Important boundary
QSR is a recovery guide, not a medical service. It does not diagnose conditions, prescribe treatment, provide counselling or psychotherapy, manage detoxification, or replace professional or emergency care.

## Privacy
QSR has no advertising or analytics SDKs and no QSR cloud account. Workbook data is designed to remain on the user's device and is encrypted locally. Deliberate text/PDF exports are readable by design so users can save or print them.

## Web version
https://quietstrengthrecovery.co.uk/apps/strength/

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

## History: reliability and privacy release — v1.8

Large local journals and encrypted backups use bounded byte encoding. New and changed passcodes require six to eight digits; existing four-digit users remain supported. A shorter welcome keeps urgent help accessible. Background locking, visible save warnings and consistent adult-only privacy wording are included. The unused Android notification permission was removed.

Acceptance checks covered 150,000-character and 1,048,576-character fictional journals, reload, encrypted export/restore, offline reopening and existing-user compatibility. Live checks included background locking and the backup-picker cancellation path. Actual-device and independent content review remain outstanding.

On Chris's Windows release machine, `BUILD_ANDROID_RELEASE.ps1` builds and signs APK/AAB files using the existing protected signing setup. Generic unsigned wrapper builds still use the Gradle instructions above.


## History: Android package — v1.9

v1.9 (version code 4) was the signed build at the time. It includes the approved app icon at all Android launcher sizes, current download/version labels, an updated Substack link and refreshed offline assets. The live web app and v1.9 APK were verified against the built files. See `RELEASE_NOTES_v1.9.md` for package checks and limitations.

Google Play checked on 9 October 2026: the active code-4 closed-test bundle is v1.9 and its downloaded original AAB matches the signed local release. The corrected educational/nonmedical listing, current icon, feature graphic, six interface screenshots and local-PIN reviewer instructions are saved. Both health declarations remain accurate. Google's 8 October app-specific reply upheld the verified Organisation-account requirement; the app remains rejected and unavailable on Google Play. The owner declined the organisation/D-U-N-S route. No approval, production release or completed closed testing is claimed. See store-assets/PLAY_SUBMISSION.md.
## Website and direct downloads

The current sharing and download page is https://quietstrengthrecovery.co.uk/downloads/ . The signed Android build at that time was v1.9. Both apps are free for adults aged 18+. Google Play work is paused; website/Android downloads and user feedback are the current focus. See DISTRIBUTION.md for links and the verified APK hash.



## History: mobile resources update — v1.10

v1.10 (code 5) is the current direct Android release. Home gives clear access to daily readings, writing, watching and the coffee-shop finder. A searchable tool index makes the workbook pages easier to find on mobile. Existing private storage keys, passcodes, app identity and signing certificate are retained.
Quiet Strength includes 365 original QSR readings with recovery/ACOA themes, official AA and ACA reading links and 20 direct creator-video links.

JavaScript builds, all 365 calendar dates, reader date navigation, new routes, search/filter interactions and Maps query generation passed isolated tests. Browser-layout and physical-phone acceptance are not claimed.
