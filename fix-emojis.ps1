# Script para arreglar emojis corruptos
$file = "views\dashboard.ejs"
$content = Get-Content $file -Raw -Encoding UTF8

# Reemplazar todos los emojis corruptos
$replacements = @{
    'Ã°Å¾Å½Â«' = '🎫'
    'Ã°Å¾â€Âº' = '📂'
    'â­' = '⭐'
    'âœ…' = '✅'
    'Ã°Å¾â€Å¡' = '📊'
    'Ã°Å¾ËœÅ¡' = '😊'
    'â±ï¸' = '⏱️'
    'â†—ï¸' = '↗️'
    'Ã°Å¾â€  ' = '🏆'
    'Ã°Å¾â€"' = '📈'
    'âš¡' = '⚡'
    'Ã°Å¾â€' = '📝'
    'Ã°Å¾â€"„' = '📄'
    'Ã°Å¾¤â€"' = '🤖'
    'Ã°Å¾â€ââ„¢' = '🆘'
    'Ã°Å¾â€¦' = '📅'
    'Ã¤Â½Â½' = '🎫'
    'Ã¤Â½Â¸' = '📂'
    'Ã¤ÂºÅ¡' = '⭐'
    'Ã¤Âœâ€¦' = '✅'
}

foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content -replace [regex]::Escape($old), $new
}

# Guardar con UTF-8
[System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Emojis arreglados!" -ForegroundColor Green
