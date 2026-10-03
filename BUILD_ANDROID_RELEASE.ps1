$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AppName = 'Quiet-Strength-Recovery'
$AndroidRoot = Join-Path $ProjectRoot 'android-release'
$JdkHome = [IO.File]::ReadAllText((Join-Path $env:LOCALAPPDATA 'Java\temurin-21\JAVA_HOME.txt')).Trim()
$env:JAVA_HOME = $JdkHome
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$Tools = Join-Path $env:ANDROID_HOME 'build-tools\36.0.0'
$SigningDir = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'QSR_Release_Private'
$KeyStore = Join-Path $SigningDir 'qsr-upload-key.jks'
$SecretFile = Join-Path $SigningDir 'qsr-upload-password.dpapi'
$KeyAlias = 'qsr-upload'
if (-not (Test-Path -LiteralPath $KeyStore) -or -not (Test-Path -LiteralPath $SecretFile)) { throw 'The existing signing key is missing. No replacement key was created.' }
$GradleFile = [IO.File]::ReadAllText((Join-Path $AndroidRoot 'app\build.gradle'))
$Version = [regex]::Match($GradleFile, 'versionName\s+"([^"]+)"').Groups[1].Value
$VersionCode = [regex]::Match($GradleFile, 'versionCode\s+(\d+)').Groups[1].Value
if (-not $Version -or -not $VersionCode) { throw 'Android version could not be read.' }
$ReleaseDir = Join-Path $ProjectRoot 'release'
New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
$ApkPath = Join-Path $ReleaseDir ($AppName + '-v' + $Version + '.apk')
$AabPath = Join-Path $ReleaseDir ($AppName + '-v' + $Version + '.aab')
$AlignedPath = Join-Path $env:TEMP ($AppName + '-v' + $Version + '-aligned.apk')
$ApkSigner = Join-Path $Tools 'apksigner.bat'
$ZipAlign = Join-Path $Tools 'zipalign.exe'
$JarSigner = Join-Path $JdkHome 'bin\jarsigner.exe'
Push-Location $ProjectRoot
try {
  & node '.\build.mjs'
  if ($LASTEXITCODE -ne 0) { throw 'Web release checks failed.' }
  Push-Location $AndroidRoot
  try {
    & '.\gradlew.bat' assembleRelease bundleRelease --no-daemon
    if ($LASTEXITCODE -ne 0) { throw 'Android build failed.' }
  } finally { Pop-Location }
  $UnsignedApk = Join-Path $AndroidRoot 'app\build\outputs\apk\release\app-release-unsigned.apk'
  $UnsignedAab = Join-Path $AndroidRoot 'app\build\outputs\bundle\release\app-release.aab'
  if (-not (Test-Path $UnsignedApk) -or -not (Test-Path $UnsignedAab)) { throw 'Expected Android build output is missing.' }
  & $ZipAlign -P 16 -f 4 $UnsignedApk $AlignedPath
  if ($LASTEXITCODE -ne 0) { throw 'APK alignment failed.' }
  Copy-Item -LiteralPath $UnsignedAab -Destination $AabPath -Force
  $SecurePassword = ConvertTo-SecureString ([IO.File]::ReadAllText($SecretFile).Trim())
  try {
    $env:QSR_RELEASE_SIGNING_PASSWORD = ([System.Net.NetworkCredential]::new('', $SecurePassword)).Password
    & $ApkSigner sign --ks $KeyStore --ks-key-alias $KeyAlias --ks-pass env:QSR_RELEASE_SIGNING_PASSWORD --key-pass env:QSR_RELEASE_SIGNING_PASSWORD --out $ApkPath $AlignedPath
    if ($LASTEXITCODE -ne 0) { throw 'APK signing failed.' }
    & $JarSigner -keystore $KeyStore -storepass:env QSR_RELEASE_SIGNING_PASSWORD -keypass:env QSR_RELEASE_SIGNING_PASSWORD $AabPath $KeyAlias
    if ($LASTEXITCODE -ne 0) { throw 'AAB signing failed.' }
  } finally {
    $env:QSR_RELEASE_SIGNING_PASSWORD = $null
    if ($SecurePassword) { $SecurePassword.Dispose() }
    Remove-Variable SecurePassword -ErrorAction SilentlyContinue
  }
  & $ApkSigner verify --verbose --print-certs $ApkPath
  if ($LASTEXITCODE -ne 0) { throw 'Signed APK verification failed.' }
  & $JarSigner -verify $AabPath
  if ($LASTEXITCODE -ne 0) { throw 'Signed AAB verification failed.' }
  & $ZipAlign -c -P 16 4 $ApkPath
  if ($LASTEXITCODE -ne 0) { throw 'Signed APK alignment verification failed.' }
  $Downloads = Join-Path $ProjectRoot 'downloads'
  New-Item -ItemType Directory -Force -Path $Downloads | Out-Null
  Copy-Item -LiteralPath $ApkPath -Destination $Downloads -Force
  & node '.\build.mjs'
  if ($LASTEXITCODE -ne 0) { throw 'Final web build failed.' }
  $Checksums = @($ApkPath, $AabPath) | ForEach-Object { $f=Get-Item -LiteralPath $_; [PSCustomObject]@{ File=$f.Name; Bytes=$f.Length; SHA256=(Get-FileHash -LiteralPath $_ -Algorithm SHA256).Hash } }
  [PSCustomObject]@{ App=$AppName; Version=$Version; VersionCode=$VersionCode; Packages=$Checksums; PhysicalDeviceTested=$false } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $ReleaseDir ('release-checks-v' + $Version + '.json')) -Encoding UTF8
  Write-Output ('RELEASE READY: ' + $AppName + ' v' + $Version + ' (code ' + $VersionCode + ')')
} finally { Pop-Location }
