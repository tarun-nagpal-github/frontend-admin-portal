
SET scriptsDirectory=%~dp0
SET powerShellScriptPath=%scriptsDirectory%preInstall.ps1
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%powerShellScriptPath%'";
