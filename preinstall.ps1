$source="E:\WebApps\Dev\Extron.UI\*"
$destination ="E:\WebApps\Dev\Backups\admin-portal-$(((get-date).ToUniversalTime()).ToString("yyyyMMddThhmmssZ"))"
$curentDirectory=Get-Location;
set-alias sz "$env:ProgramFiles\7-Zip\7z.exe"


if (-Not (Test-Path $destination))
{
     md -path $destination
}
Move-Item -Path $source -Destination $destination -Recurse -Force

