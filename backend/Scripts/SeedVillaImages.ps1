# SeedVillaImages.ps1
# Reads villa project images from the legacy PerfectJagah assets folder and inserts
# them as binary data into PropertyImages in PerfectJagahDb.
#
# Prerequisites: Run SeedVillaProperties.sql first.
# Idempotent: properties that already have images are skipped.
#
# Usage (run from any directory):
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\SeedVillaImages.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\SeedVillaImages.ps1 -LegacyImagesPath "D:\other\assets\images"

param(
    [string]$LegacyImagesPath = "C:\Data\PerfectJagah\assets\images",
    [string]$ConnectionString  = "Server=SAGAR\SQLEXPRESS;Database=PerfectJagahDb;Trusted_Connection=True;TrustServerCertificate=True;"
)

$ErrorActionPreference = "Stop"

$projects = @(
    [pscustomobject]@{ Title = "West County Villas";      Folder = "project4"  },
    [pscustomobject]@{ Title = "Mayfair Sunrise";         Folder = "project5"  },
    [pscustomobject]@{ Title = "APR Praveen's Eterno";    Folder = "project8"  },
    [pscustomobject]@{ Title = "SSLR's Suprabhatha";      Folder = "project10" },
    [pscustomobject]@{ Title = "Makuta Green Woods";      Folder = "project12" },
    [pscustomobject]@{ Title = "Janapriya Olive County";  Folder = "project13" }
)

Add-Type -AssemblyName "System.Data"

$conn = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
$conn.Open()
Write-Host "Connected to database."

$totalInserted = 0

foreach ($project in $projects) {

    $lc = $conn.CreateCommand()
    $lc.CommandText = "SELECT Id FROM Properties WHERE Title = @t AND PropertyType = 'Villa'"
    $lc.Parameters.AddWithValue("@t", $project.Title) | Out-Null
    $propertyId = $lc.ExecuteScalar()

    if ($null -eq $propertyId) {
        Write-Warning "Property '$($project.Title)' not found. Run SeedVillaProperties.sql first."
        continue
    }

    $cc = $conn.CreateCommand()
    $cc.CommandText = "SELECT COUNT(1) FROM PropertyImages WHERE PropertyId = @pid"
    $cc.Parameters.AddWithValue("@pid", [int]$propertyId) | Out-Null
    $existingCount = [int]($cc.ExecuteScalar())

    if ($existingCount -gt 0) {
        Write-Host "  '$($project.Title)' already has $existingCount image(s) - skipped."
        continue
    }

    $folder = [System.IO.Path]::Combine($LegacyImagesPath, $project.Folder)

    if (-not [System.IO.Directory]::Exists($folder)) {
        Write-Warning "  Folder not found: $folder"
        continue
    }

    $filePaths = [System.IO.Directory]::GetFiles($folder)
    Write-Host "  '$($project.Title)': found $($filePaths.Length) file(s) in $folder"

    if ($filePaths.Length -eq 0) {
        Write-Warning "  No files in $folder"
        continue
    }

    $inserted = 0
    foreach ($filePath in $filePaths) {
        $fileName    = [System.IO.Path]::GetFileName($filePath)
        $ext         = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = "application/octet-stream"
        if ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
        elseif ($ext -eq ".png")  { $contentType = "image/png"  }
        elseif ($ext -eq ".gif")  { $contentType = "image/gif"  }
        elseif ($ext -eq ".webp") { $contentType = "image/webp" }

        $imageBytes = [System.IO.File]::ReadAllBytes($filePath)

        $ic = $conn.CreateCommand()
        $ic.CommandText = "INSERT INTO PropertyImages (PropertyId, ImageData, ContentType, FileName, UploadedAt) VALUES (@pid, @data, @ct, @fn, GETUTCDATE())"
        $ic.Parameters.AddWithValue("@pid", [int]$propertyId) | Out-Null
        $p = $ic.Parameters.Add("@data", [System.Data.SqlDbType]::VarBinary, -1)
        $p.Value = $imageBytes
        $ic.Parameters.AddWithValue("@ct", $contentType) | Out-Null
        $ic.Parameters.AddWithValue("@fn", $fileName)    | Out-Null

        $rows = $ic.ExecuteNonQuery()
        if ($rows -eq 1) {
            $inserted++
            Write-Host "    Inserted: $fileName ($([Math]::Round($imageBytes.Length / 1024)) KB)"
        }
    }

    $totalInserted += $inserted
    Write-Host "  '$($project.Title)': inserted $inserted image(s)."
}

$conn.Close()
Write-Host ""
Write-Host "Done. Total images inserted: $totalInserted"
