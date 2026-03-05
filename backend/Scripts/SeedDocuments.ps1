# SeedDocuments.ps1
# Reads property documents (PDFs, DOCX, etc.) from the legacy PerfectJagah assets
# folder and inserts them as binary data into PropertyDocuments in PerfectJagahDb.
#
# Prerequisites: Run SeedVillaProperties.sql and SeedApartmentPlotProperties.sql first.
# Idempotent: properties that already have documents are skipped.
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\SeedDocuments.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\SeedDocuments.ps1 -LegacyDocsPath "D:\other\assets\documents"

param(
    [string]$LegacyDocsPath   = "C:\Data\PerfectJagah\assets\documents",
    [string]$ConnectionString  = "Server=SAGAR\SQLEXPRESS;Database=PerfectJagahDb;Trusted_Connection=True;TrustServerCertificate=True;"
)

$ErrorActionPreference = "Stop"

# Maps each legacy project folder to the exact property title in the DB
$projects = @(
    [pscustomobject]@{ Title = "SRINIVASAM by PROTEK Realty";            Folder = "project1"  },
    [pscustomobject]@{ Title = "Newmark Gardenia";                       Folder = "project2"  },
    [pscustomobject]@{ Title = "SVG Flora";                              Folder = "project3"  },
    [pscustomobject]@{ Title = "APR Praveen's Eterno";                   Folder = "project4"  },
    [pscustomobject]@{ Title = "Mayfair Sunrise";                        Folder = "project5"  },
    [pscustomobject]@{ Title = "RajaBhoomi Aananda";                     Folder = "project6"  },
    [pscustomobject]@{ Title = "Shree Samprada";                         Folder = "project7"  },
    [pscustomobject]@{ Title = "West County Villas";                     Folder = "project8"  },
    [pscustomobject]@{ Title = "ANTARVANA - Hillock The Nature Retreat";  Folder = "project9"  },
    [pscustomobject]@{ Title = "SSLR's Suprabhatha";                     Folder = "project10" },
    [pscustomobject]@{ Title = "MVV Lake Breeze";                        Folder = "project11" },
    [pscustomobject]@{ Title = "Makuta Green Woods";                     Folder = "project12" },
    [pscustomobject]@{ Title = "Janapriya Olive County";                 Folder = "project13" }
)

Add-Type -AssemblyName "System.Data"

$conn = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
$conn.Open()
Write-Host "Connected to database."

$totalInserted = 0

foreach ($project in $projects) {

    # Look up the property ID by title
    $lc = $conn.CreateCommand()
    $lc.CommandText = "SELECT Id FROM Properties WHERE Title = @t"
    $lc.Parameters.AddWithValue("@t", $project.Title) | Out-Null
    $propertyId = $lc.ExecuteScalar()

    if ($null -eq $propertyId) {
        Write-Warning "Property '$($project.Title)' not found in DB. Skipping."
        continue
    }

    # Idempotency check: skip if documents already present
    $cc = $conn.CreateCommand()
    $cc.CommandText = "SELECT COUNT(1) FROM PropertyDocuments WHERE PropertyId = @pid"
    $cc.Parameters.AddWithValue("@pid", [int]$propertyId) | Out-Null
    $existingCount = [int]($cc.ExecuteScalar())

    if ($existingCount -gt 0) {
        Write-Host "  '$($project.Title)' already has $existingCount document(s) - skipped."
        continue
    }

    $folder = [System.IO.Path]::Combine($LegacyDocsPath, $project.Folder)

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
        $fileName = [System.IO.Path]::GetFileName($filePath)
        $ext      = [System.IO.Path]::GetExtension($filePath).ToLower()

        $contentType = switch ($ext) {
            ".pdf"  { "application/pdf" }
            ".docx" { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
            ".doc"  { "application/msword" }
            ".xlsx" { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            default { "application/octet-stream" }
        }

        # Build a clean display name from the file name
        $displayName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
        $displayName = $displayName -replace '[_]', ' '
        $displayName = $displayName -replace '[-]', ' '
        $displayName = $displayName.Trim()

        $bytes = [System.IO.File]::ReadAllBytes($filePath)

        $ic = $conn.CreateCommand()
        $ic.CommandText = @"
INSERT INTO PropertyDocuments (PropertyId, DocumentData, ContentType, FileName, DisplayName, UploadedAt)
VALUES (@pid, @data, @ct, @fn, @dn, GETUTCDATE())
"@
        $ic.Parameters.AddWithValue("@pid",  [int]$propertyId)    | Out-Null
        $ic.Parameters.AddWithValue("@data", $bytes)               | Out-Null
        $ic.Parameters.AddWithValue("@ct",   $contentType)         | Out-Null
        $ic.Parameters.AddWithValue("@fn",   $fileName)            | Out-Null
        $ic.Parameters.AddWithValue("@dn",   $displayName)         | Out-Null
        $ic.ExecuteNonQuery() | Out-Null

        Write-Host "    Inserted: $fileName ($contentType)"
        $inserted++
    }

    Write-Host "  -> $inserted document(s) inserted for '$($project.Title)'"
    $totalInserted += $inserted
}

$conn.Close()
Write-Host ""
Write-Host "Done. Total documents inserted: $totalInserted"
