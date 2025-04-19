const fs = require("fs");
const path = require("path");

// Check command line arguments
const args = process.argv.slice(2);

// Help message
function showHelp() {
  console.log("Text File Word Counter");
  console.log("Usage: node count.js <file.txt> [options]");
  console.log("\nOptions:");
  console.log("  -h, --help     Show help");
  console.log("  -s, --summary  Show only summary (total counts)");
  console.log("  -d, --detail   Show detailed statistics");
  console.log("\nExample:");
  console.log("  node count.js sample.txt");
  console.log("  node count.js sample.txt --detail");
  process.exit(0);
}

// Show help if no arguments or help flag
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  showHelp();
}

// Parse command line options
const filePath = args[0];
const showSummary = args.includes("--summary") || args.includes("-s");
const showDetail = args.includes("--detail") || args.includes("-d");

// Validate file path
if (!filePath.endsWith(".txt")) {
  console.error("Error: Please provide a .txt file");
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`Error: File '${filePath}' does not exist`);
  process.exit(1);
}

// Read file content
function readFile(filePath) {
  try {
    // Read file as buffer for more accurate character counting
    const buffer = fs.readFileSync(filePath);
    return buffer;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// Count statistics
function countStatistics(buffer) {
  // Convert buffer to string for text analysis
  const content = buffer.toString();

  // Count characters (including whitespace)
  const charCount = buffer.length;

  // Count lines (split by newline character)
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;

  // Count words (split by whitespace)
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  // Get byte size
  const byteSize = buffer.byteLength;

  // Additional statistics for detailed output
  let stats = {
    charCount,
    lineCount,
    wordCount,
    byteSize,
  };

  if (showDetail) {
    // Count non-whitespace characters
    const nonWhitespaceCharCount = content.replace(/\s/g, "").length;

    // Word length distribution
    const wordLengths = words.map((word) => word.length);
    const averageWordLength =
      wordLengths.reduce((sum, length) => sum + length, 0) / wordCount || 0;

    // Count paragraphs (separated by double newlines)
    const paragraphCount = content
      .split(/\r?\n\s*\r?\n/)
      .filter((para) => para.trim().length > 0).length;

    // Find most common words
    const wordFrequency = {};
    words.forEach((word) => {
      const normalizedWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (normalizedWord.length > 0) {
        wordFrequency[normalizedWord] =
          (wordFrequency[normalizedWord] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Add to stats
    stats = {
      ...stats,
      nonWhitespaceCharCount,
      averageWordLength,
      paragraphCount,
      commonWords: sortedWords,
    };
  }

  return stats;
}

// Format byte size to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

// Display statistics
function displayStatistics(stats) {
  console.log("\n=== Text File Statistics ===\n");

  // Always show basic stats
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`Size: ${formatBytes(stats.byteSize)}`);
  console.log(`Characters: ${stats.charCount}`);
  console.log(`Words: ${stats.wordCount}`);
  console.log(`Lines: ${stats.lineCount}`);

  if (showDetail) {
    console.log("\n=== Detailed Statistics ===\n");

    console.log(`Non-whitespace characters: ${stats.nonWhitespaceCharCount}`);
    console.log(`Paragraphs: ${stats.paragraphCount}`);
    console.log(
      `Average word length: ${stats.averageWordLength.toFixed(2)} characters`
    );

    console.log("\nMost common words:");
    stats.commonWords.forEach(([word, count]) => {
      console.log(`  "${word}": ${count} occurrences`);
    });
  }

  console.log("\n=== End of Statistics ===");
}

// Main execution
const buffer = readFile(filePath);
const statistics = countStatistics(buffer);
displayStatistics(statistics);
